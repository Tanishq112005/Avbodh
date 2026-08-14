from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime
from uuid import UUID, uuid4



class ChatMessage(BaseModel):
   
    role: str = Field(..., description="The role of the sender (e.g., 'user', 'assistant', 'system')")
    content: str = Field(..., description="The content of the message")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    

class ChatSession(BaseModel):
   
    session_id: UUID = Field(default_factory=uuid4, description="Unique ID for this specific chat thread")
    title: str = Field(default="New Chat", description="The title of the chat")
    
    # Dates
    started_at: datetime = Field(default_factory=datetime.utcnow, description="When the chat started")
    last_updated_at: datetime = Field(default_factory=datetime.utcnow, description="The last time this chat was interacted with")
    
    # History
    history: List[ChatMessage] = Field(default_factory=list, description="All messages in this chat")
    
    agent_state: Dict[str, Any] = Field(
        default_factory=dict, 
        description="The internal LangGraph state space (saves graph position, memory, etc.)"
    )



class User(BaseModel):
   
    user_id: UUID = Field(..., description="Unique UUID determining the user")
    chats: List[ChatSession] = Field(default_factory=list, description="Array of all chat sessions for this user")
    created_at: datetime = Field(default_factory=datetime.utcnow)
