from .groq import Groq

class LLM:
    
    def __init__(self):
        self.groq_model = Groq()
        
    def model(self):
        return self.groq_model.gettingModel() 
    
    
    