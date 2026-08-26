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

async def build_chat_graph(user_id: str):
    tools = await Dependencies.get_mcp_tools(user_id)
    g = StateGraph(ChatBotStateSpace)
    g.add_node('ChatNode', chatting)
    g.add_node('tools', LoggingToolNode(tools, messages_key="message"))
    g.add_edge(START, 'ChatNode')
    g.add_conditional_edges('ChatNode', custom_tools_condition, {"tools": "tools", END: END})
    g.add_edge('tools', 'ChatNode')
    memory = MemorySaver()
    return g.compile(checkpointer=memory)

async def fetch_history_context(user_id: str, thread_id: str) -> list:
    input_messages = []
    try:
        history_doc = await ChatHistoryService.get_synchronized_thread_history(user_id, thread_id)
        threads = history_doc.get("threads", {})
        if thread_id in threads:
            past_messages = threads[thread_id].get("messages", [])
            for msg in past_messages:
                if msg.get("human_response"):
                    input_messages.append(HumanMessage(content=msg.get("human_response")))
                if msg.get("ai_response"):
                    input_messages.append(AIMessage(content=msg.get("ai_response")))
    except Exception as e:
        print(f"Failed to load chat history for LLM context: {e}")
    return input_messages

def prepare_input_messages(message: str, input_messages: list) -> list:
    enhanced_message = (
        f"{message}\n\n"
        "[SYSTEM REMINDER: If the question above asks for any facts, names, dates, or real-world information, "
        "YOU MUST CALL THE SEARCH TOOL. Do NOT guess the answer from your internal knowledge.]"
    )
    input_messages.append(HumanMessage(content=enhanced_message))
    return input_messages

async def publish_chat_event(thread_id: str, user_id: str, message: str, full_response: str):
    import json
    try:
        rabbitmq_client = Dependencies.get_rabbitmq_client()
        payload = {
            "thread_id": thread_id,
            "user_id": user_id,
            "last_message": message,
            "assistant_response": full_response
        }
        
        # Save to Redis as pending state
        try:
            redis_client = Dependencies.get_redis_client()
            redis_key = f"chat_state:user:{user_id}:{thread_id}"
            await redis_client.set(redis_key, json.dumps(payload))
        except Exception as redis_e:
            print(f"Failed to save pending state to Redis: {redis_e}")

        await rabbitmq_client.publish_to_exchange("chat_events_exchange", payload)
    except Exception as e:
        print(f"Failed to publish to RabbitMQ: {e}")

def extract_stream_content(content) -> str:
    if isinstance(content, list):
        return "".join(
            item.get("text", "") if isinstance(item, dict) else str(item) 
            for item in content
        )
    return str(content)

async def stream_chat(message: str, thread_id: str = "1", user_id: str = "unknown"):
    chatBot = await build_chat_graph(user_id) 
    config = {"configurable": {"thread_id": thread_id}}
    AvbodhStepLogger.log_query(thread_id, user_id, message)  
    
    current_state = chatBot.get_state(config)
    input_messages = []
    if not current_state.values.get("message", []):
        input_messages = await fetch_history_context(user_id, thread_id)
        
    input_messages = prepare_input_messages(message, input_messages)
    full_response = ""
    
    async for stream_type, payload in chatBot.astream(
        input={"message": input_messages, "user_id": user_id},
        stream_mode=["messages", "updates"],
        config=config
    ):
        if stream_type == "messages":
            msg_chunk, _ = payload
            if isinstance(msg_chunk, AIMessage) and msg_chunk.content:
                content_str = extract_stream_content(msg_chunk.content)
                if content_str:
                    full_response += content_str
                    yield content_str
                    
    AvbodhStepLogger.log_final_response(thread_id, user_id, full_response)
    await publish_chat_event(thread_id, user_id, message, full_response)