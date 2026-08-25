import json
from typing import Dict, Any
from avbodh_tools.tools import get_user_chats_from_mongo
from config.dependencies import Dependencies
from config.env import settings
from motor.motor_asyncio import AsyncIOMotorClient

class ChatHistoryService:

    @staticmethod
    async def fetch_mongo_history(user_id: str) -> Dict[str, Any]:
        try:
            mongo_doc = await get_user_chats_from_mongo(user_id, settings.DATABASE_URL)
        except Exception as e:
            print(f"Failed to fetch from MongoDB: {e}")
            mongo_doc = {"user_id": user_id, "threads": {}}

        if "threads" not in mongo_doc:
            mongo_doc["threads"] = {}
        return mongo_doc

    @staticmethod
    async def fetch_mongo_thread_history(user_id: str, thread_id: str) -> Dict[str, Any]:
        mongo_doc = {"user_id": user_id, "threads": {}}
        try:
            client = AsyncIOMotorClient(settings.DATABASE_URL)
            db = client.get_database("chat_bot")
            collection = db.get_collection("chat_history")
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
        return mongo_doc

    @staticmethod
    async def fetch_redis_pending_messages(user_id: str, mongo_doc: Dict[str, Any], target_thread_id: str = None):
        redis_client = Dependencies.get_redis_client()
        try:
            keys = await redis_client.keys(f"chat_state:user:{user_id}:*")
            for key in keys:
                state_data = await redis_client.get(key)
                if state_data:
                    chat = json.loads(state_data)
                    thread_id = chat.get("thread_id")
                    
                    if not thread_id or (target_thread_id and thread_id != target_thread_id):
                        continue
                        
                    if thread_id not in mongo_doc["threads"]:
                        mongo_doc["threads"][thread_id] = {"messages": []}
                    
                    mongo_doc["threads"][thread_id]["messages"].append({
                        "human_response": chat.get("last_message", ""),
                        "ai_response": chat.get("assistant_response", ""),
                        "_is_pending": True
                    })
        except Exception as e:
            print(f"Failed to fetch from Redis: {e}")

    @staticmethod
    async def get_synchronized_history(user_id: str) -> Dict[str, Any]:
        mongo_doc = await ChatHistoryService.fetch_mongo_history(user_id)
        await ChatHistoryService.fetch_redis_pending_messages(user_id, mongo_doc)
        return mongo_doc

    @staticmethod
    async def get_synchronized_thread_history(user_id: str, thread_id: str) -> Dict[str, Any]:
        mongo_doc = await ChatHistoryService.fetch_mongo_thread_history(user_id, thread_id)
        await ChatHistoryService.fetch_redis_pending_messages(user_id, mongo_doc, target_thread_id=thread_id)
        return mongo_doc
