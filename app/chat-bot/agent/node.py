from .state import ChatBotStateSpace
from config.dependencies import Dependencies
from avbodh_tools import AvbodhStepLogger
from langchain_core.runnables import RunnableConfig

async def chatting(state: ChatBotStateSpace, config: RunnableConfig):
    thread_id = config["configurable"].get("thread_id", "unknown")
    user_id = state.get("user_id", "unknown")

    try:
        chatModel = Dependencies.get_chat_model()
        tools = await Dependencies.get_mcp_tools(user_id)
        model_with_tools = chatModel.bind_tools(tools)

        message = state['message']
        response = await model_with_tools.ainvoke(message)

        # ★ LLM ne kya decide kiya — tool bulaya ya seedha jawab diya
        AvbodhStepLogger.log_llm_decision(thread_id, user_id, response.tool_calls or [])

        return {'message': response}
    except Exception as e:
        print(f"Error in Chatting Node: {e}")
        from langchain_core.messages import AIMessage
        return {'message': AIMessage(content='Sorry, I encountered an error.')}