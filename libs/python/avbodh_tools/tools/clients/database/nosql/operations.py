from ..nosql.nosql_client import AvbodhNoSqlClient

async def save_chat_to_mongo(data: dict, mongodb_uri: str, db_name: str = "chat_bot", collection_name: str = "chat_history"):
    """
    Shared library function to save a chat state/message directly to MongoDB.
    """
    from datetime import datetime, timezone
    client = AvbodhNoSqlClient(uri=mongodb_uri)
    collection = client.get_collection(db_name, collection_name)
    
    thread_id = data.get("thread_id")
    user_id = data.get("user_id")
    
    if thread_id and user_id:
        current_time = datetime.now(timezone.utc).isoformat()
        
        # New message block
        new_message = {
            "human_response": data.get("last_message", ""),
            "ai_response": data.get("assistant_response", ""),
            "date": current_time
        }
        
        # Check if the thread already exists for this user
        existing_doc = await collection.find_one({"user_id": user_id, f"threads.{thread_id}": {"$exists": True}})
        
        set_ops = {
            "updated_date": current_time,
            f"threads.{thread_id}.updated_date": current_time
        }
        
        # If the thread is new, record its start_time
        if not existing_doc:
            set_ops[f"threads.{thread_id}.start_time"] = current_time
        
        # Perform the nested upsert
        await collection.update_one(
            {"user_id": user_id},
            {
                "$push": {f"threads.{thread_id}.messages": new_message},
                "$set": set_ops
            },
            upsert=True
        )
    
    client.close()
    return True

async def get_user_chats_from_mongo(user_id: str, mongodb_uri: str, db_name: str = "chat_bot", collection_name: str = "chat_history"):
    """
    Shared library function to retrieve all chat history for a specific user.
    """
    client = AvbodhNoSqlClient(uri=mongodb_uri)
    collection = client.get_collection(db_name, collection_name)
    
    # Exclude the MongoDB _id field because it is not JSON serializable by default
    doc = await collection.find_one({"user_id": user_id}, {"_id": 0})
    
    client.close()
    
    if not doc:
        return {"user_id": user_id, "threads": {}}
        
    return doc
