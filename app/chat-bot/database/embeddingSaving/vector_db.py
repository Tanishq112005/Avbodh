from typing import List, Dict, Any, Optional
from avbodh_tools import VectorDBClientFactory

class EmbeddingDatabaseService:
    """
    Service responsible for saving and retrieving Vector Embeddings
    (e.g., from PDF books) to give the Chatbot context.
    """
    def __init__(self):
        # We initialize the generic vector DB client (e.g. Pinecone, Chroma)
        self.vector_client = VectorDBClientFactory(
            index_name="book-embeddings"
        )

    async def save_book_embedding(self, chunk_text: str, embedding: List[float], metadata: Dict[str, Any]):
        """
        Saves a vectorized chunk of a book into the Vector Database.
        """
        await self.vector_client.save_embedding(chunk_text, embedding, metadata)
        return True

    async def search_similar_content(self, query_embedding: List[float], top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Searches the Vector Database for chunks of the book that match the user's query embedding.
        Returns the top_k most similar chunks to feed into LangGraph!
        """
        results = await self.vector_client.query(query_embedding, top_k)
        return results
