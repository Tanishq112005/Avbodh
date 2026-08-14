from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime
from uuid import UUID, uuid4

class ChatMessage(BaseModel):
    """Represents a single message in the chat history"""
    role: str = Field(..., description="The role of the sender (e.g., 'user', 'assistant', 'system')")
    content: str = Field(..., description="The content of the message")
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ChatSession(BaseModel):
    """Represents a discrete chat session for a user"""
    session_id: UUID = Field(default_factory=uuid4, description="Unique ID for this specific chat thread")
    title: str = Field(default="New Chat", description="The title of the chat")
    
    # Dates
    started_at: datetime = Field(default_factory=datetime.utcnow, description="When the chat started")
    last_updated_at: datetime = Field(default_factory=datetime.utcnow, description="The last time this chat was interacted with")
    
    # History
    history: List[ChatMessage] = Field(default_factory=list, description="All messages in this chat")
    
    # LangGraph Agent State
    # We store the state as a flexible dictionary so LangGraph can save its internal graph position/state here
    # This allows the user to resume a paused graph exactly where they left off!
    agent_state: Dict[str, Any] = Field(
        default_factory=dict, 
        description="The internal LangGraph state space (saves graph position, memory, etc.)"
    )

class User(BaseModel):
    """Represents the root user and their array of chats"""
    user_id: UUID = Field(..., description="Unique UUID determining the user")
    
    # Array of their chats
    chats: List[ChatSession] = Field(default_factory=list, description="Array of all chat sessions for this user")
    
    # Optional metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
