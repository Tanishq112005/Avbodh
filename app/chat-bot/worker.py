import asyncio
from dotenv import load_dotenv
from config.env import settings 
from avbodh_tools.tools import save_chat_to_mongo, save_vector_embedding
from config.dependencies import Dependencies



async def process_mongo_write(data: dict):
    print(f"[Mongo Worker] Received data to save to MongoDB: {data.get('thread_id', 'unknown')}")
    mongodb_uri = settings.DATABASE_URL
    
    try:
        await save_chat_to_mongo(data, mongodb_uri)
        print("[Mongo Worker] Successfully saved to MongoDB.")
        redis_client = Dependencies.get_redis_client()
        redis_key = f"chat_state:user:{data.get('user_id')}:{data.get('thread_id')}"
        await redis_client.delete(redis_key)
        
    except Exception as e:
        print(f"[Mongo Worker] Error processing mongo/redis sync: {e}")




async def process_vector_embedding(data: dict):
    print(f"[Vector Worker] Received data to embed: {data.get('thread_id', 'unknown')}")

    text_to_embed = data.get("last_message", "")
    ai_response = data.get("assistant_response", "")
    
    print(text_to_embed)
    if not text_to_embed:
        print("[Vector Worker] No text to embed found in payload.")
        return
        
    vector_db_uri = settings.VECTOR_DB_URI
    try:
        embedding_model = Dependencies.get_embedding_model()
        vector_client = Dependencies.get_vector_client()
        
        vector = await embedding_model.embedding_query(text_to_embed)
        await save_vector_embedding(text_to_embed, ai_response, vector, vector_client)
        
        print("[Vector Worker] Successfully generated and saved vector embedding.")
    except Exception as e:
        print(f"[Vector Worker] Error saving vector embedding: {e}")





async def main():
    print("Starting Background Workers...")
    rabbitmq_client = Dependencies.get_rabbitmq_client()
    
    
    
    await asyncio.gather(
        rabbitmq_client.consume_from_exchange(
            exchange_name="chat_events_exchange", 
            queue_name="mongo_writes", 
            callback_func=process_mongo_write
        ),
        rabbitmq_client.consume_from_exchange(
            exchange_name="chat_events_exchange", 
            queue_name="vector_embeddings", 
            callback_func=process_vector_embedding
        )
    )
    
    print("Workers are running and listening to queues...")
    await asyncio.Future()  
    
    
    
    
    
if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Workers stopped.")
