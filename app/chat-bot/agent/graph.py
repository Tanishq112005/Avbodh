import asyncio
from langgraph.graph import START, END, StateGraph
from langgraph.graph.message import add_messages
from langgraph.prebuilt import tools_condition
from langgraph.checkpoint.memory import MemorySaver
from langchain_core.messages import HumanMessage, AIMessage
from .state import ChatBotStateSpace
from .node import chatting
from .logging_tool_node import LoggingToolNode
from config.dependencies import Dependencies
from services.chat_history import ChatHistoryService
from avbodh_tools import AvbodhStepLogger



def custom_tools_condition(state: ChatBotStateSpace):
    messages = state.get("message", [])
    if not messages:
        return END
    last_message = messages[-1]
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools"
    return END



### GRAPH BUILDER TOOL 
async def build_chat_graph(user_id: str):
    tools = await Dependencies.get_mcp_tools(user_id)

    g = StateGraph(ChatBotStateSpace)
    g.add_node('ChatNode', chatting)
    g.add_node('tools', LoggingToolNode(tools, messages_key="message"))

    g.add_edge(START, 'ChatNode')

    g.add_conditional_edges('ChatNode', custom_tools_condition, {"tools": "tools", END: END})

    # tool chalne ke baad WAPAS ChatNode — LLM result dekh kar decide karega
    # "aur tool chahiye ya final answer de du"
    g.add_edge('tools', 'ChatNode')

    memory = MemorySaver()
    return g.compile(checkpointer=memory)   





async def stream_chat(message: str, thread_id: str = "1", user_id: str = "unknown"):
    """
    Async Generator — SSE format mein chat response stream karta hai.
    """
    
    
    
    chatBot = await build_chat_graph(user_id) 

    config = {"configurable": {"thread_id": thread_id}}
    AvbodhStepLogger.log_query(thread_id, user_id, message)  
    current_state = chatBot.get_state(config)
    messages_in_memory = current_state.values.get("message", [])
    
    input_messages = []

    if not messages_in_memory:
  
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

    input_messages.append(HumanMessage(content=message))

    full_response = ""
    async for stream_type, payload in chatBot.astream(
        input={"message": input_messages, "user_id": user_id},
        stream_mode=["messages", "updates"],
        config=config
    ):
        if stream_type == "messages":
            msg_chunk, metadata = payload
            # Only stream AIMessages to the user, ignore ToolMessages and HumanMessages
            if isinstance(msg_chunk, AIMessage) and msg_chunk.content:
                content = msg_chunk.content
                if isinstance(content, list):
                 
                    content_str = "".join(
                        item.get("text", "") if isinstance(item, dict) else str(item) 
                        for item in content
                    )
                else:
                    content_str = str(content)
                    
                if content_str:
                    full_response += content_str
                    yield content_str
                

    AvbodhStepLogger.log_final_response(thread_id, user_id, full_response)

  
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
        
        
        