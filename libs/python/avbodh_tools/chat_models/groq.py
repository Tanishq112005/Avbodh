import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from .interfaces import IChatModels
load_dotenv()

class Groq(IChatModels):
    
    api_key : str 
    model : ChatGroq
    
    def setModel(self , uri: str):
        try:
            self.api_key = uri
            print("Initalizing the model")
            self.model = ChatGroq(
                api_key=self.api_key, 
                model="llama-3.1-8b-instant", 
                temperature=0, 
                timeout=None, 
                max_retries=2
            )
            
            print("Initilization is completed") 
        except Exception as e:
            raise RuntimeError(f"Failed to initialize Groq client: {e}")
        
    def getModel(self): 
        return self.model 
    
 
    
    
    
                         

            
        