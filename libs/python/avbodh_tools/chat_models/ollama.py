from langchain_ollama import ChatOllama
from .interfaces import IChatModels

class Ollama(IChatModels):
    
    model : ChatOllama 
    
    def setModel(self):
        try:
            print("Initalizing the model")
            self.model = ChatOllama(
                 model="qwen3:14b",
                 temperature=0,
                 reasoning=False,
                 num_predict=300,     
                 num_ctx=8192,
            )
            
            print("Initilization is completed") 
        except Exception as e:
            raise RuntimeError(f"Failed to initialize Ollama client: {e}")
        
    def getModel(self): 
        return self.model  