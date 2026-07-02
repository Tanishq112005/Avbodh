from pinecone import Pinecone
from ..app.core.config import settings

class VectorDBClient:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            pc = Pinecone(api_key=settings.PINECONE_API_KEY)
            # Connect to your specific index
            cls._instance = pc.Index(settings.PINECONE_INDEX_NAME)
        return cls._instance


vector_db = VectorDBClient()