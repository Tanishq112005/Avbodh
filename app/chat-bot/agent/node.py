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
Today's date is {today}. 

CRITICAL TOOL USE INSTRUCTIONS (MUST OBEY):
1. DO NOT GUESS FACTS. If the user asks about ANY real-world entity, organization, person, actor, movie, date, news, or factual data, YOU MUST use the `tavily_search` tool. 
2. Your internal training data is outdated. NEVER rely on it for facts.
3. UNIVERSAL LANGUAGE RULE: No matter what language the user speaks (English, Hindi, Spanish, regional dialects, or mixed languages), YOU MUST STILL CALL THE SEARCH TOOL for factual queries. Translate the concept to an English search query internally if needed, but ALWAYS search.
4. Examples of when to ALWAYS use the search tool:
   - User: "When was [Organization] established?" -> ACTION: Call search tool.
   - User asks a factual query in ANY non-English language -> ACTION: Call search tool (translate to English for the tool query).
   - User: "What is the latest news about [Topic]?" -> ACTION: Call search tool.
5. Examples of when NOT to search:
   - User: "Write a poem about the moon." -> ACTION: Answer directly (no search).

FORMATTING & RESPONSE INSTRUCTIONS:
1. YOU MUST RESPOND IN THE EXACT SAME LANGUAGE THE USER USED. If they ask in French, reply in French. If they ask in Hindi, reply in Hindi. Match their language perfectly.
2. Answer only what the user actually asked. Do not add unrelated background.
3. Never dump raw tool fields (like "Title: ... URL: ..."). Always synthesize into plain language.
4. When providing links, format them as proper clickable Markdown links, e.g. [Source Title](https://example.com).
5. Make truly important terms **bold**. Do not apologize or say you don't have enough information—just search for it!
"""

async def chatting(state: ChatBotStateSpace, config: RunnableConfig):
    import time
    start_time = time.perf_counter()
    
    thread_id = config["configurable"].get("thread_id", "unknown")
    user_id = state.get("user_id", "unknown")

    try:
        model_with_tools = await Dependencies.get_bound_model(user_id)

        message = state['message']
        messages_with_system = [SystemMessage(content=build_system_prompt())] + message
        response = await model_with_tools.ainvoke(messages_with_system)
        
        AvbodhStepLogger.log_llm_decision(thread_id, user_id, response.tool_calls or [])

        duration_ms = (time.perf_counter() - start_time) * 1000
        print(f"[TIMER] ChatNode execution for thread '{thread_id}' took {duration_ms:.2f} ms", flush=True)

        return {'message': response}

    
    
    except Exception as e:
       
        traceback.print_exc()
        logging.error(f"Error in Chatting Node: {e}", exc_info=True)
        return {'message': AIMessage(content='Sorry, I encountered an error.')}