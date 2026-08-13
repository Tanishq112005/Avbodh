import redis
import os

class RedisClientFactory:
    """
    A generic factory to create Redis clients for your Agents.
    """
    _instance = None

    @classmethod
    def get_client(cls):
        if cls._instance is None:
            host = os.getenv("REDIS_HOST", "localhost")
            port = int(os.getenv("REDIS_PORT", 6379))
            password = os.getenv("REDIS_PASSWORD", None)
            
            cls._instance = redis.Redis(
                host=host, 
                port=port, 
                password=password, 
                decode_responses=True
            )
        return cls._instance
