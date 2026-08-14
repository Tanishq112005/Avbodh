import redis.asyncio as redis
import os

class RedisClientFactory:
    """
    A generic factory to create async Redis clients for your Agents.
    """
    _instance = None

    @classmethod
    def get_client(cls, redis_url: str = None):
        if cls._instance is None:
            # Fallback to os.getenv if URL is not passed explicitly
            url = redis_url or os.getenv("REDIS_URL", "redis://localhost:6379")
            
            # Using from_url allows passing fully formatted strings (like Upstash provides)
            cls._instance = redis.from_url(
                url, 
                decode_responses=True
            )
        return cls._instance
