from .state import ChatBotStateSpace
from config.dependencies import Dependencies
from langgraph.graph import END


### function doing the semantic search 
async def semantic_search_node(state: ChatBotStateSpace):
    # state['message'] is a list of BaseMessage objects. Extract the latest text.
    messages = state.get('message', [])
    if not messages:
        return {"cache_hit": False}
        
    last_message_text = messages[-1].content
    
    try:
        # Initialize Vector DB Client via central dependencies
        vector_client = Dependencies.get_vector_client()
        embedding_model = Dependencies.get_embedding_model()
        
        # We must generate the embedding for the query first
        query_embedding = await embedding_model.embedding_query(last_message_text)
        
        # Query Pinecone
        results = await vector_client.query(query_embedding, top_k=1)
        
        # Results from Pinecone look like:
        # {"matches": [{"id": "vec1", "score": 0.89, "metadata": {"ai_response": "...", "text": "..."}}]}
        
        if results and "matches" in results and len(results["matches"]) > 0:
            best_match = results["matches"][0]
            if best_match.get("score", 0) > 0.85:
                # Cache hit! Bypass LLM and return cached AI response
                cached_response = best_match["metadata"].get("ai_response", "")
                if cached_response:
                    print("Data is comming from db")
                    print(f"CACHE HIT! Score: {best_match.get('score')} for question: '{last_message_text}'")
                    return {
                        "message": cached_response,
                        "cache_hit": True
                    }
            
        # For now, if no match > 85% is found, we return the state as is to pass to the ChatNode
        return {"cache_hit": False}
        
    except Exception as e:
        print(f"Error in Semantic Search Node: {e}")
        return {"cache_hit": False}







### defing the chatting node 
async def chatting(state : ChatBotStateSpace):
    
    try:
        # Use our persistent Singleton connection!
        chatModel = Dependencies.get_chat_model()
         
        message = state['message']
        
        # Fix 2: Use ainvoke (async invoke) to prevent blocking the event loop
        respone_of_chatBot = await chatModel.ainvoke(message)
        
        # Fix 3: Return the actual string content, not the AIMessage object
        return {'message' : respone_of_chatBot.content}
    except Exception as e: 
        print(f"Error is coming from the Chatting Node: {e}")
        return {'message': 'Sorry, I encountered an error.'}
    
    
    
    
    
    
# Defing the conditional Logic 
def should_continue(state: ChatBotStateSpace):
    if state.get("cache_hit"):
        return END
    return 'ChatNode' 
        
    


    
    