import os
from typing import List, Dict, Any
import json
from avbodh_tools.tools import get_user_chats_from_mongo
from config.dependencies import Dependencies
from config.env import settings





class ChatHistoryService:
  

    @staticmethod
    async def get_synchronized_history(user_id: str) -> Dict[str, Any]:
       
        mongodb_uri = settings.DATABASE_URL
        
        try:
            mongo_doc = await get_user_chats_from_mongo(user_id, mongodb_uri)
        except Exception as e:
            print(f"Failed to fetch from MongoDB: {e}")
            mongo_doc = {"user_id": user_id, "threads": {}}

        # Ensure the document has a valid structure
        if "threads" not in mongo_doc:
            mongo_doc["threads"] = {}
        
        redis_client = Dependencies.get_redis_client()
        try:
            keys = await redis_client.keys(f"chat_state:user:{user_id}:*")
            
            for key in keys:
                state_data = await redis_client.get(key)
                if state_data:
                    chat = json.loads(state_data)
                    thread_id = chat.get("thread_id")
                    if thread_id:
                        if thread_id not in mongo_doc["threads"]:
                            mongo_doc["threads"][thread_id] = {
                                "messages": []
                            }
                        
                        # Append the pending chat message
                        pending_message = {
                            "human_response": chat.get("last_message", ""),
                            "ai_response": chat.get("assistant_response", ""),
                            "_is_pending": True
                        }
                        mongo_doc["threads"][thread_id]["messages"].append(pending_message)
                    
        except Exception as e:
            print(f"Failed to fetch from Redis: {e}")

        return mongo_doc
