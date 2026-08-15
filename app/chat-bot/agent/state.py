from langgraph.graph import StateGraph 
from typing import TypedDict , Annotated
from langchain_core.messages import BaseMessage 
from langgraph.graph.message import add_messages 


class ChatBotStateSpace(TypedDict):  
     message: Annotated[list[BaseMessage] , add_messages] 
     
      
    