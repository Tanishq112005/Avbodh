from ..vector_db.vector_db_client import VectorDBClientFactory



async def save_vector_embedding(text: str, ai_response: str, embedding: list[float], vector_client, collection_name: str = "chat_embeddings"):
    """
    Shared library function to save a pre-generated embedding to Vector DB.
    """
    
    # 2. Save to Vector DB
    # Passing the raw text and the pre-computed vector
    metadata = {
        "source": "user_message", 
        "collection": collection_name,
        "ai_response": ai_response
    }
    await vector_client.save_embedding(text=text, embedding=embedding, metadata=metadata)
    
    return True
