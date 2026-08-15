from .state import ChatBotStateSpace
from config.dependencies import Dependencies
from langgraph.graph import END


### defing the chatting node 
async def chatting(state : ChatBotStateSpace):
    
    try:
        # Use our persistent Singleton connection!
        chatModel = Dependencies.get_chat_model()
         
        message = state['message']
        
        # Fix 2: Use ainvoke (async invoke) to prevent blocking the event loop
        respone_of_chatBot = await chatModel.ainvoke(message)
        
        # Fix 3: Return the actual AIMessage object so LangGraph knows it's from the AI
        return {'message': respone_of_chatBot}
    except Exception as e: 
        print(f"Error is coming from the Chatting Node: {e}")
        from langchain_core.messages import AIMessage
        return {'message': AIMessage(content='Sorry, I encountered an error.')}
    
    
    
    
    
    
