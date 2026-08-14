import time
from langgraph.graph import START, END, StateGraph 
from .state import ChatBotStateSpace
from .node import chatting
import asyncio

### 1. Define the agent State space for the graph 
graph = StateGraph(ChatBotStateSpace)

### 2. Define the Chat Node 
graph.add_node('ChatNode', chatting)

### 3. Make the edges in the Graph 
graph.add_edge(START, 'ChatNode') 
graph.add_edge('ChatNode', END) 

### 4. Compile the graph 
chatBot = graph.compile() 



async def stream_chat(message: str, thread_id: str = "1"):
    """
    Async Generator function to stream chat responses using Server-Sent Events (SSE) format.
    """
    config = {
        "configurable": {
            "thread_id": thread_id
        }
    }
    
    # Use 'astream' and 'async for' because the 'chatting' node is an async function!
    async for msg_chunk, metadata in chatBot.astream(
        input={"message": message},
        stream_mode="messages",
        config=config
    ):
        
        # We only want to stream actual content, not empty chunks or tool calls
        if msg_chunk.content:
            yield f"data: {msg_chunk.content}\n\n"
            await asyncio.sleep(0.05)  