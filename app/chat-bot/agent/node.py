### all the functions of the node 
from .state import ChatBotStateSpace
from ..config.env import settings
from avbodh_tools import chat_models
from langchain_groq import ChatGroq




async def chatting(state : ChatBotStateSpace):
    
  
    try:
        api_key = settings.GROQ_API_KEY
        chatModel : ChatGroq = await chat_models.factory.ChatModelFactory("groq" , {
            "access_key" : api_key
         })
         
        message = state['message']
        
        respone_of_chatBot = await chatModel.invoke(message)
        
        return {'message' : respone_of_chatBot}
    except: 
        print("Error is comming from the Chatting Node")
        
    


    
    