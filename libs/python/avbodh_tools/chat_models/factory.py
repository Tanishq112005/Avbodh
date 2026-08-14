## model factory , defing the models used 
from ..schemas.huggingFace import HuggingFaceChatModelConfig
from .huggingFace import HuggingFace
from langchain_groq import ChatGroq
from ..schemas.groq import GroqChatModelConfig
from .groq import Groq
class ChatModelFactory:
    
    @staticmethod
    def get_method(model_type: str, config: dict):
        
        if model_type == "hugging_face":
            validated_data = HuggingFaceChatModelConfig(**config)
            model = HuggingFace()
            
            # Extract api_key from config directly if not in schema, or assume it's in schema
            api_key = config.get("api_key", getattr(validated_data, "api_key", None))
            
            model.setModel(
                repo_id=validated_data.repo_id, 
                task=validated_data.task, 
                max_length=validated_data.max_length, 
                temperature=validated_data.temperature,
                api_key=api_key
            )
            return model.getModel()
        
        if model_type == "groq":
            validated_data = GroqChatModelConfig(**config) 
            model = Groq()
            api_key = validated_data.access_key
            model.setModel(uri=api_key)
            
            return model.getModel()
            
             
            
        
        