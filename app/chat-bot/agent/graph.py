from langgraph.graph import START, END, StateGraph
from .state import ChatBotStateSpace
from .node import chatting
import asyncio
from config.dependencies import Dependencies

### 1. Define the agent State space for the graph 
graph = StateGraph(ChatBotStateSpace)

### 2. Define the Nodes
graph.add_node('ChatNode', chatting)

### 3. Make the edges in the Graph 
graph.add_edge(START, 'ChatNode') 
graph.add_edge('ChatNode', END)

from langgraph.checkpoint.memory import MemorySaver

### 4. Compile the graph with a checkpointer
memory = MemorySaver()
chatBot = graph.compile(checkpointer=memory)


from langchain_core.messages import HumanMessage, AIMessage
from services.chat_history import ChatHistoryService

async def stream_chat(message: str, thread_id: str = "1", user_id: str = "unknown"):
    """
    Async Generator function to stream chat responses using Server-Sent Events (SSE) format.
    """
    
    ### configuring the thread , so each have there known chat 
    config = {
        "configurable": {
            "thread_id": thread_id
        }
    }
    
    # 1. Check if MemorySaver already has state for this thread
    current_state = chatBot.get_state(config)
    messages_in_memory = current_state.values.get("message", [])
    
    input_messages = []
    
    if not messages_in_memory:
        # Memory is blank (e.g., server restarted). Load from MongoDB to seed it.
        try:
            history_doc = await ChatHistoryService.get_synchronized_history(user_id)
            threads = history_doc.get("threads", {})
            if thread_id in threads:
                past_messages = threads[thread_id].get("messages", [])
                for msg in past_messages:
                    human_text = msg.get("human_response")
                    ai_text = msg.get("ai_response")
                    
                    if human_text:
                        input_messages.append(HumanMessage(content=human_text))
                    if ai_text:
                        input_messages.append(AIMessage(content=ai_text))
        except Exception as e:
            print(f"Failed to load chat history for LLM context: {e}")
            
    # 2. Append the current message
    input_messages.append(HumanMessage(content=message))
    
    full_response = ""
    async for stream_type, payload in chatBot.astream(
        input={"message": input_messages},
        stream_mode=["messages", "updates"],
        config=config
    ):
        if stream_type == "messages":
            msg_chunk, metadata = payload
            if msg_chunk.content:
                full_response += msg_chunk.content
                # Normal LLM token streaming
                yield f"data: {msg_chunk.content}\n\n"
                await asyncio.sleep(0.01)
            
    # After streaming finishes, publish the full message state to RabbitMQ Exchange
    try:
        rabbitmq_client = Dependencies.get_rabbitmq_client()
        payload = {
            "thread_id": thread_id,
            "user_id": user_id,
            "last_message": message,
            "assistant_response": full_response
        }
        await rabbitmq_client.publish_to_exchange("chat_events_exchange", payload)
    except Exception as e:
        print(f"Failed to publish to RabbitMQ: {e}")