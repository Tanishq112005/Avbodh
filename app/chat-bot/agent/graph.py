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


# ---------------------------------------------------------------------------
# Custom tools condition kyunki state key 'message' hai, 'messages' nahi
# ---------------------------------------------------------------------------
def custom_tools_condition(state: ChatBotStateSpace):
    messages = state.get("message", [])
    if not messages:
        return END
    last_message = messages[-1]
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools"
    return END

# ---------------------------------------------------------------------------
# Graph builder — user-specific hai kyunki tools user ke connectors pe depend
# karte hain, isliye module-load pe ek fixed graph nahi bana sakte.
# Har naye user/session ke liye ye function call hogi.
# ---------------------------------------------------------------------------
async def build_chat_graph(user_id: str):
    tools = await Dependencies.get_mcp_tools(user_id)

    g = StateGraph(ChatBotStateSpace)
    g.add_node('ChatNode', chatting)
    g.add_node('tools', LoggingToolNode(tools, messages_key="message"))

    g.add_edge(START, 'ChatNode')

    # ★ REACT LOOP — LLM ne tool_calls bheji to 'tools' pe jao, warna END
    g.add_conditional_edges('ChatNode', custom_tools_condition, {"tools": "tools", END: END})

    # tool chalne ke baad WAPAS ChatNode — LLM result dekh kar decide karega
    # "aur tool chahiye ya final answer de du"
    g.add_edge('tools', 'ChatNode')

    memory = MemorySaver()
    return g.compile(checkpointer=memory)   # ★ ye line missing thi — return zaroori hai


# ---------------------------------------------------------------------------
# Streaming entrypoint — router/chatBot.py isko call karta hai
# ---------------------------------------------------------------------------
async def stream_chat(message: str, thread_id: str = "1", user_id: str = "unknown"):
    """
    Async Generator — SSE format mein chat response stream karta hai.
    """
    chatBot = await build_chat_graph(user_id)   # per-user tools ke saath graph

    config = {"configurable": {"thread_id": thread_id}}

    AvbodhStepLogger.log_query(thread_id, user_id, message)

    # 1. MemorySaver mein pehle se state hai kya check karo
    current_state = chatBot.get_state(config)
    messages_in_memory = current_state.values.get("message", [])

    input_messages = []

    if not messages_in_memory:
        # Memory khaali hai (server restart hua hoga) — MongoDB se seed karo
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

    # 2. current message add karo
    input_messages.append(HumanMessage(content=message))

    full_response = ""
    async for stream_type, payload in chatBot.astream(
        input={"message": input_messages, "user_id": user_id},
        stream_mode=["messages", "updates"],
        config=config
    ):
        if stream_type == "messages":
            msg_chunk, metadata = payload
            if msg_chunk.content:
                content = msg_chunk.content
                if isinstance(content, list):
                    # Some models/tool messages return a list of content blocks
                    content_str = "".join(
                        item.get("text", "") if isinstance(item, dict) else str(item) 
                        for item in content
                    )
                else:
                    content_str = str(content)
                    
                if content_str:
                    full_response += content_str
                    # For SSE stream we can yield chunks replacing newlines to avoid breaking the SSE format, 
                    # but typically just sending the string works if clients parse it.
                    yield f"data: {content_str}\n\n"
                await asyncio.sleep(0.01)

    AvbodhStepLogger.log_final_response(thread_id, user_id, full_response)

    # Streaming khatam hone ke baad, RabbitMQ pe poora event publish karo
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