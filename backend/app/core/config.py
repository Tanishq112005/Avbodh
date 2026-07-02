from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    HUGGINGFACEHUG_API_TOKEN: str 
    DATABASE_URL: str 
    PINECONE_API_KEY: str 
    PINECONE_INDEX_NAME: str
    
    # Backblaze B2 S3 settings
    B2_ENDPOINT_URL: str | None = None
    B2_APPLICATION_KEY_ID: str | None = None
    B2_APPLICATION_KEY: str | None = None
    B2_BUCKET_NAME: str | None = None
    
    model_config = SettingsConfigDict(env_file=".env")
    

settings = Settings()    