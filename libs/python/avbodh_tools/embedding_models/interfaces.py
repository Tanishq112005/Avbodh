from abc import ABC, abstractmethod

## defination of the embedding models ## 

class IEmbedder(ABC): 
    
    @abstractmethod
    def set_model(self, model_name: str, api_key: str):
        pass 
    
    
    @abstractmethod
    def embedding_query(self, dataForEmbedding):
        pass   
    
    
    @abstractmethod
    def embedding_document(self, dataOfPdf):
        pass 
    
    
    
