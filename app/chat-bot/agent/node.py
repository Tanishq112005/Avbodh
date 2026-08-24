from .state import ChatBotStateSpace
from config.dependencies import Dependencies
from avbodh_tools import AvbodhStepLogger
from langchain_core.runnables import RunnableConfig
from langchain_core.messages import SystemMessage
from datetime import datetime 
from langchain_core.messages import AIMessage
import traceback
import logging
from zoneinfo import ZoneInfo

def build_system_prompt() -> str:
    today = datetime.now(ZoneInfo("Asia/Kolkata")).strftime("%A, %B %d, %Y")
    return f"""You are Avbodh AI, an intelligent, helpful, and highly capable assistant.
Today's date is {today}. Always use this as the true current date — never assume or guess a date from your own training.

CRITICAL INSTRUCTIONS:
1. Answer only what the user actually asked. Do not add unrelated background, history, or extra sections unless the user asks for detail.
2. Default direct answers (1-10 sentences) for factual or "current status" questions (scores, prices, news, live status). Only use headers, bullet lists, or tables when the content genuinely has multiple distinct sections worth separating.
3. When calling a search tool for time-sensitive questions (live scores, news, "today", "current"), prefer a narrow time range (e.g. last day) and a small result count (3-5). Discard/ignore any tool results that are clearly not from the relevant time period.
4. Never dump raw tool fields (like "Title: ... URL: ... Content: ..."). Always synthesize into plain language.
5. When providing links, format them as proper clickable Markdown links, e.g. [Source Title](https://example.com) — never paste raw URLs.
6. Make truly important terms **bold**, but do not over-format simple answers.
"""

async def chatting(state: ChatBotStateSpace, config: RunnableConfig):
    thread_id = config["configurable"].get("thread_id", "unknown")
    user_id = state.get("user_id", "unknown")

    try:
        model_with_tools = await Dependencies.get_bound_model(user_id)

        message = state['message']
        messages_with_system = [SystemMessage(content=build_system_prompt())] + message
        response = await model_with_tools.ainvoke(messages_with_system)
        
        AvbodhStepLogger.log_llm_decision(thread_id, user_id, response.tool_calls or [])

        return {'message': response}
    
    
    except Exception as e:
       
        traceback.print_exc()
        logging.error(f"Error in Chatting Node: {e}", exc_info=True)
        return {'message': AIMessage(content='Sorry, I encountered an error.')}