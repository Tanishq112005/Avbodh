from langchain_google_genai import ChatGoogleGenerativeAI
from .interfaces import IChatModels
import os
from dotenv import load_dotenv

load_dotenv()


class Google(IChatModels):
    
    model : ChatGoogleGenerativeAI
    
    def setModel(self):
        try:
            print("Initalizing the model")
            self.model = ChatGoogleGenerativeAI(
               model="gemini-3.7-flash"
             )
            
            print("Initilization is completed") 
        except Exception as e:
            raise RuntimeError(f"Failed to initialize Ollama client: {e}")
        
    def getModel(self): 
        return self.model  