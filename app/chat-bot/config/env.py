from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    
    DATABASE_URL: str 
    PINECONE_API_KEY: str 
    PINECONE_INDEX_NAME: str

    # Backblaze B2 S3 settings
    B2_ENDPOINT_URL: str | None = None
    B2_APPLICATION_KEY_ID: str | None = None
    B2_APPLICATION_KEY: str | None = None
    B2_BUCKET_NAME: str | None = None
    
    
    
    # Message Queues, Cache and Vector DBs
    RABBITMQ_URI: str | None = None
    VECTOR_DB_URI: str | None = None
    REDIS_URL: str | None = None
    
    EMBEDDING_MODEL: str | None = None 
    GROQ_API_KEY : str | None = None 
    HUGGINGFACEHUG_API_TOKEN: str 
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    

settings = Settings()    