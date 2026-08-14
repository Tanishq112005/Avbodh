### all the functions of the node 
from .state import ChatBotStateSpace
from config.env import settings
from avbodh_tools.chat_models.factory import ChatModelFactory
from langchain_groq import ChatGroq




async def chatting(state : ChatBotStateSpace):
    
  
    try:
        api_key = settings.GROQ_API_KEY
        # Fix 1: Call the static method get_method, do not instantiate the class, and remove await
        chatModel: ChatGroq = ChatModelFactory.get_method("groq" , {
            "access_key" : api_key
         })
         
        message = state['message']
        
        # Fix 2: Use ainvoke (async invoke) to prevent blocking the event loop
        respone_of_chatBot = await chatModel.ainvoke(message)
        
        # Fix 3: Return the actual string content, not the AIMessage object
        return {'message' : respone_of_chatBot.content}
    except Exception as e: 
        print(f"Error is coming from the Chatting Node: {e}")
        return {'message': 'Sorry, I encountered an error.'}
        
    


    
    