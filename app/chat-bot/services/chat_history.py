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

    @staticmethod
    async def get_synchronized_thread_history(user_id: str, thread_id: str) -> Dict[str, Any]:
        from motor.motor_asyncio import AsyncIOMotorClient
        mongodb_uri = settings.DATABASE_URL
        mongo_doc = {"user_id": user_id, "threads": {}}
        
        try:
            client = AsyncIOMotorClient(mongodb_uri)
            db = client.get_database("chat_bot")
            collection = db.get_collection("chat_history")
            
            # Fetch ONLY the specific thread using MongoDB projection
            doc = await collection.find_one(
                {"user_id": user_id}, 
                {"_id": 0, "user_id": 1, f"threads.{thread_id}": 1}
            )
            client.close()
            
            if doc:
                mongo_doc = doc
        except Exception as e:
            print(f"Failed to fetch thread from MongoDB: {e}")

        if "threads" not in mongo_doc:
            mongo_doc["threads"] = {}
        if thread_id not in mongo_doc["threads"]:
            mongo_doc["threads"][thread_id] = {"messages": []}
            
        redis_client = Dependencies.get_redis_client()
        try:
            # We still scan the user's pending keys, but only append for the matched thread_id
            keys = await redis_client.keys(f"chat_state:user:{user_id}:*")
            
            for key in keys:
                state_data = await redis_client.get(key)
                if state_data:
                    chat = json.loads(state_data)
                    chat_thread_id = chat.get("thread_id")
                    
                    if chat_thread_id == thread_id:
                        pending_message = {
                            "human_response": chat.get("last_message", ""),
                            "ai_response": chat.get("assistant_response", ""),
                            "_is_pending": True
                        }
                        mongo_doc["threads"][thread_id]["messages"].append(pending_message)
                    
        except Exception as e:
            print(f"Failed to fetch thread from Redis: {e}")

        return mongo_doc
