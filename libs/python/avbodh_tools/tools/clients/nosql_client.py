import os
from typing import Optional
from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.database import Database
from pymongo.errors import ConnectionFailure

class AvbodhNoSqlClient:
    """
    A generic NoSQL (MongoDB) connection client.
    Handles connection pooling and provides access to databases and collections.
    """
    
    def __init__(self, uri: str = None):
        # You can pass the URI directly, or it will fallback to environment variables
        self.uri = uri or os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
        self._client: Optional[MongoClient] = None
        self._connect()

    def _connect(self):
        try:
            self._client = MongoClient(self.uri)
            # Send a ping to confirm a successful connection
            self._client.admin.command('ping')
        except ConnectionFailure as e:
            print(f"Could not connect to MongoDB: {e}")
            raise e

    def get_client(self) -> MongoClient:
        """Returns the raw MongoClient instance."""
        if self._client is None:
            self._connect()
        return self._client

    def get_database(self, db_name: str) -> Database:
        """Returns a specific MongoDB database."""
        client = self.get_client()
        return client[db_name]

    def get_collection(self, db_name: str, collection_name: str) -> Collection:
        """Returns a specific MongoDB collection from a specific database."""
        db = self.get_database(db_name)
        return db[collection_name]

    def close(self):
        """Closes the MongoDB connection."""
        if self._client:
            self._client.close()
