from .interfaces import IEmbedder
from langchain_huggingface import HuggingFaceEndpointEmbeddings


class HuggingFace(IEmbedder):
    
    def set_model(self, model_name: str, api_key: str):
        self.__model = HuggingFaceEndpointEmbeddings(
            model_name=model_name,
            huggingfacehub_api_token=api_key
        )
        
    
    def embedding_query(self , dataForEmbedding):
        return self.__model.aembed_query(dataForEmbedding) 
    
    
    def embedding_document(self , dataOfPdf):
        return self.__model.aembed_documents(dataOfPdf) 
    
    
    
        