from langgraph.graph import START, END, StateGraph
from .state import ChatBotStateSpace
from .node import chatting, semantic_search_node, should_continue
import asyncio
from config.dependencies import Dependencies

### 1. Define the agent State space for the graph 
graph = StateGraph(ChatBotStateSpace)

### 2. Define the Nodes
graph.add_node('SemanticSearchNode', semantic_search_node)
graph.add_node('ChatNode', chatting)

### 3. Make the edges in the Graph 
graph.add_edge(START, 'SemanticSearchNode') 


graph.add_conditional_edges('SemanticSearchNode', should_continue)
graph.add_edge('ChatNode', END)

### 4. Compile the graph 
chatBot = graph.compile() 



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
    
    full_response = ""
    async for stream_type, payload in chatBot.astream(
        input={"message": message},
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
                
        elif stream_type == "updates":
            for node_name, state_update in payload.items():
                # If SemanticSearchNode tells us it hit the cache
                if state_update.get("cache_hit"):
                    cached_text = state_update.get("message", "")
                    if cached_text:
                        full_response += cached_text
                        # Simulate streaming character by character
                        for char in cached_text:
                            yield f"data: {char}\n\n"
                            await asyncio.sleep(0.05)
            
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