from .interfaces import IChatModels
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint


## Hugging Face Model 
class HuggingFace(IChatModels):
    
    def setModel(self, repo_id: str, task: str , max_length: int , temperature: float, api_key: str):
      
        self.__llm = HuggingFaceEndpoint(
            repo_id=repo_id, 
            task=task,
            huggingfacehub_api_token=api_key,
            max_length=max_length,
            temperature=temperature
        )
        
        self__model = ChatHuggingFace(llm = self.__llm) 
    
  
    def invoke(self, question: str):
        response = self.__model.invoke(question)
        return response.content 
    
    
    


    
    
    
    