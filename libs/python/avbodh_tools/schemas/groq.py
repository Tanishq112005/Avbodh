from pydantic import BaseModel

class GroqChatModelConfig(BaseModel):
    access_key : str     