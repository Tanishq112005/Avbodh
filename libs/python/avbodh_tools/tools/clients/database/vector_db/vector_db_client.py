import os
import asyncio
from pinecone import Pinecone

class VectorDBClientFactory:
    """
    A generic interface for connecting to a Vector Database 
    (like Pinecone, Chroma, Qdrant, etc.) for multi-language embeddings.
    """
    
    _instance = None

    @classmethod
    def get_client(cls, db_type: str = "pinecone", api_key=None, environment=None, index_name=None):
        if cls._instance is None:
            if db_type == "pinecone":
                # Fallback to env variables if not explicitly passed
                api_key = api_key
                index_name = index_name 
                cls._instance = PineconeClientWrapper(api_key, index_name)
            else:
                raise ValueError(f"Unsupported db_type: {db_type}")
        return cls._instance


class PineconeClientWrapper:
    def __init__(self, api_key: str, index_name: str):
        self.api_key = api_key
        self.index_name = index_name
        self.pc = Pinecone(api_key=self.api_key)
        self.index = self.pc.Index(self.index_name)
        print(f"Connected to Pinecone Index: {self.index_name}")

    async def save_embedding(self, text: str, embedding: list[float], metadata: dict = None):
        """
        Generic method to save an embedding to Pinecone.
        """
        if metadata is None:
            metadata = {}
        
        metadata["text"] = text  # Always store the original text in metadata
        
        # We need a unique ID for the vector. In a real app, you might hash the text or use a UUID.
        # Here we'll generate a simple hash of the text.
        import hashlib
        vector_id = hashlib.md5(text.encode('utf-8')).hexdigest()
        
        def _upsert():
            self.index.upsert(
                vectors=[
                    {"id": vector_id, "values": embedding, "metadata": metadata}
                ]
            )
        
        # Run blocking Pinecone call in a thread pool so we don't block the async event loop
        await asyncio.to_thread(_upsert)
        print(f"[Vector Worker] Successfully saved embedding for: {text[:30]}...")
        return True

    async def query(self, query_embedding: list[float], top_k=5):
        """
        Generic async method to query the vector database.
        """
        def _query():
            return self.index.query(
                vector=query_embedding,
                top_k=top_k,
                include_metadata=True
            )
            
        results = await asyncio.to_thread(_query)
        return results
