import json
from datetime import datetime, timezone


class AvbodhStepLogger:
    @staticmethod
    def _emit(step: str, thread_id: str, user_id: str, data: dict):
        entry = {"ts": datetime.now(timezone.utc).isoformat(), "step": step,
                  "thread_id": thread_id, "user_id": user_id, **data}
        print(json.dumps(entry, default=str))
        return entry

    @classmethod
    def log_query(cls, thread_id, user_id, query):
        return cls._emit("query_received", thread_id, user_id, {"query": query})

    @classmethod
    def log_llm_decision(cls, thread_id, user_id, tool_calls):
        if tool_calls:
            return cls._emit("llm_decision", thread_id, user_id,
                              {"decided": "call_tools", "tools_requested": [tc["name"] for tc in tool_calls]})
        return cls._emit("llm_decision", thread_id, user_id, {"decided": "direct_answer"})

    @classmethod
    def log_tool_start(cls, thread_id, user_id, tool_name, tool_input):
        return cls._emit("tool_start", thread_id, user_id, {"tool": tool_name, "input": tool_input})

    @classmethod
    def log_tool_end(cls, thread_id, user_id, tool_name, duration_ms, output, error=None):
        return cls._emit("tool_end", thread_id, user_id,
                          {"tool": tool_name, "duration_ms": round(duration_ms, 1),
                           "output_preview": (output or "")[:300], "error": error})

    @classmethod
    def log_final_response(cls, thread_id, user_id, response):
        return cls._emit("final_response", thread_id, user_id, {"response_preview": response[:300]})