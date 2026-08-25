from typing import Any, Dict, List, Optional
from uuid import UUID
from datetime import datetime
from avbodh_tools import AvbodhNoSqlClient
from .models import User, ChatSession, ChatMessage
from config.env import settings




class ChatDatabaseService:
    
    
    def __init__(self):
        api_key = settings.DATABASE_URL
        self.client = AvbodhNoSqlClient(uri=api_key)
        self.collection = self.client.get_collection("chat_bot_app", "users")

  
    async def get_user(self, user_id: UUID) -> Optional[User]:
        
        document = await self.collection.find_one({"user_id": str(user_id)})
        if document:
            return User(**document)
        return None


    async def create_chat_session(self, user_id: UUID, new_chat: ChatSession):

        chat_dict = new_chat.model_dump(mode='json')
        
        await self.collection.update_one(
            {"user_id": str(user_id)},
            {
                "$setOnInsert": {
                    "user_id": str(user_id),
                    "created_at": datetime.utcnow()
                },
                "$push": {"chats": chat_dict}
            },
            upsert=True
        )


    async def get_chat_details(self, user_id: UUID, session_id: UUID) -> Optional[ChatSession]:
    
        document = await self.collection.find_one(
            {"user_id": str(user_id), "chats.session_id": str(session_id)},
            {"chats.$": 1} 
        )
        
        if document and "chats" in document and len(document["chats"]) > 0:
            return ChatSession(**document["chats"][0])
        return None

  
  
    async def add_message(self, user_id: UUID, session_id: UUID, message: ChatMessage):
        
        await self.collection.update_one(
            {"user_id": str(user_id), "chats.session_id": str(session_id)},
            {
                "$push": {"chats.$.history": message.model_dump(mode='json')},
                "$set": {"chats.$.last_updated_at": datetime.utcnow()}
            }
        )




    async def update_agent_state(self, user_id: UUID, session_id: UUID, state: Dict[str, Any]):

        await self.collection.update_one(
            {"user_id": str(user_id), "chats.session_id": str(session_id)},
            {
                "$set": {
                    "chats.$.agent_state": state,
                    "chats.$.last_updated_at": datetime.utcnow()
                }
            }
        )

