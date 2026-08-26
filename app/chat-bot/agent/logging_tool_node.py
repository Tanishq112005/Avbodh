import time
from langgraph.prebuilt import ToolNode
from avbodh_tools import AvbodhStepLogger 


class LoggingToolNode(ToolNode):
    
    async def ainvoke(self, state, config=None, **kwargs):
        thread_id = config["configurable"].get("thread_id", "unknown")
        user_id = state.get("user_id", "unknown")

        last_msg = state["message"][-1]
        for tc in last_msg.tool_calls:
            print(f"\n[TOOL CALL] LLM is using tool: {tc['name']}", flush=True)
            print(f"[TOOL CALL] Arguments / Queries: {tc['args']}\n", flush=True)
            AvbodhStepLogger.log_tool_start(thread_id, user_id, tc["name"], tc["args"])

        start = time.perf_counter()
        result = await super().ainvoke(state, config, **kwargs)
        duration_ms = (time.perf_counter() - start) * 1000

        for msg in result["message"]:
            safe_content = str(msg.content)[:200].encode('ascii', errors='replace').decode('ascii')
            print(f"[TOOL RESULT] Retrieved data for {getattr(msg, 'name', 'unknown')}: {safe_content}...", flush=True)
            AvbodhStepLogger.log_tool_end(
                thread_id, user_id, getattr(msg, "name", "unknown"),
                duration_ms, str(msg.content),
            )
        
        print(f"[TIMER] Tools Node execution for thread '{thread_id}' took {duration_ms:.2f} ms")
        return result