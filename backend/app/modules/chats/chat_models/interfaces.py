from abc import ABC , classmethod  


## define the work of the each of the chat models 


class IChatModels(ABC):
    
    @classmethod  
    def invoke(prompt):
        pass 
    
    
    @classmethod
    def setModel(modelName):
        pass
    