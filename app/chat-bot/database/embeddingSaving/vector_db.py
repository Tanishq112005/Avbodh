from typing import List, Dict, Any, Optional
from avbodh_tools import VectorDBClientFactory

class EmbeddingDatabaseService:

    def __init__(self):

        self.vector_client = VectorDBClientFactory(
            index_name="book-embeddings"
        )

    async def save_book_embedding(self, chunk_text: str, embedding: List[float], metadata: Dict[str, Any]):
     
        await self.vector_client.save_embedding(chunk_text, embedding, metadata)
        return True

    async def search_similar_content(self, query_embedding: List[float], top_k: int = 5) -> List[Dict[str, Any]]:
       
        results = await self.vector_client.query(query_embedding, top_k)
        return results
