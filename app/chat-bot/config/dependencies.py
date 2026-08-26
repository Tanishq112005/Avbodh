from avbodh_tools.tools import AvbodhRabbitMQClient, VectorDBClientFactory, RedisClientFactory
from avbodh_tools.chat_models.factory import ChatModelFactory
from avbodh_tools.embedding_models.factory import EmbeddingModelFactory
from avbodh_tools import AvbodhMCPClientFactory
from .env import settings

class Dependencies:


    _rabbitmq_client = None
    _chat_model = None
    _redis_client = None
    _vector_client = None
    _embedding_model = None

    @classmethod
    def get_embedding_model(cls):

        if cls._embedding_model is None:
            config = {
                "model_name": settings.EMBEDDING_MODEL,
                "api_key": settings.HUGGINGFACEHUG_API_TOKEN
            }
            
            cls._embedding_model = EmbeddingModelFactory.get_method("hugging_face", config)
        return cls._embedding_model


    @classmethod
    def get_rabbitmq_client(cls) -> AvbodhRabbitMQClient:
        if cls._rabbitmq_client is None:
            cls._rabbitmq_client = AvbodhRabbitMQClient(uri=settings.RABBITMQ_URI)
        return cls._rabbitmq_client


    @classmethod
    def get_chat_model(cls):
        
        if cls._chat_model is None:
            api_key = settings.GROQ_API_KEY
            cls._chat_model = ChatModelFactory.get_method("openrouter" , {
               "access_key" : settings.OPENROUTER_API_KEY
            })
            
        return cls._chat_model


    @classmethod
    def get_redis_client(cls):
    
        if cls._redis_client is None:
            
            redis_url = settings.REDIS_URL
            cls._redis_client = RedisClientFactory.get_client(redis_url=redis_url)
        return cls._redis_client



    @classmethod
    def get_vector_client(cls):
        """Returns a singleton instance of the Vector DB client."""
        if cls._vector_client is None:
            api_key = getattr(settings, "PINECONE_API_KEY", None)
            index_name = getattr(settings, "PINECONE_INDEX_NAME", None)
            cls._vector_client = VectorDBClientFactory.get_client(
                "pinecone", 
                api_key=api_key, 
                index_name=index_name
            )
        return cls._vector_client
    
    
    @classmethod
    async def get_mcp_tools(cls, user_id: str):
     
        enabled_connectors = []
        
        if settings.GITHUB_PAT and settings.GITHUB_PAT != "your_github_pat_here":
            enabled_connectors.append({
                "connector_id": "github", 
                "credentials": {"personal_access_token": settings.GITHUB_PAT}
            })
            
        if settings.TAVILY_API_KEY and settings.TAVILY_API_KEY != "your_tavily_api_key_here":
            enabled_connectors.append({
                "connector_id": "tavily", 
                "credentials": {"api_key": settings.TAVILY_API_KEY}
            })
            
        return await AvbodhMCPClientFactory.get_tools(user_id, enabled_connectors)

    _bound_models_cache = {}

    @classmethod
    async def get_bound_model(cls, user_id: str):
        if user_id not in cls._bound_models_cache:
            chat_model = cls.get_chat_model()
            tools = await cls.get_mcp_tools(user_id)
            cls._bound_models_cache[user_id] = chat_model.bind_tools(tools)
        return cls._bound_models_cache[user_id]

