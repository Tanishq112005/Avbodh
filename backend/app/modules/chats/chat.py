# this is class for the each specific chat 
import uuid
from datetime import datetime
from app.modules.chats.chat_models.interfaces import IChatModels
from app.modules.chats.embedding_models.interfaces import IEmbedder
from app.modules.chats.parsers.parser import Parser
from app.modules.chats.chat_models.factory import ChatModelFactory
from app.modules.chats.embedding_models.factory import EmbeddingModelFactory


class Chat:
    
    def __init__(self):
        new_uuid = uuid.uuid4()
        self.id = str(new_uuid) 
        self.created_at = datetime.now() 
        self.updated_at = datetime.now()
        self.is_answered: bool = False
        self.is_processed: bool = False
        self.query: str = None
        self.file_urls: list = []
        self.image_urls: list = []
        self.chatModel: IChatModels = None  
        self.embedding_models: IEmbedder = None  
        self.parser: Parser = Parser()  

    def setQuery(self, query: str):
        self.query = query
        self.update_timestamp()

    def addFileUrl(self, url: str):
        """Adds a cloud storage URL for an attached document/file."""
        self.file_urls.append(url)
        self.update_timestamp()

    def addImageUrl(self, url: str):
        """Adds a cloud storage URL for an attached image."""
        self.image_urls.append(url)
        self.update_timestamp()

    def mark_as_processed(self):
        """Marks the chat's files as fully processed/embedded."""
        self.is_processed = True
        self.update_timestamp()

    def update_timestamp(self):
        self.updated_at = datetime.now()
        
    def mark_as_answered(self):
        self.is_answered = True
        self.update_timestamp()
    
    def setChatModel(self, model_name: str, config: dict):
        self.chatModel = ChatModelFactory.get_method(model_name, config) 
    
    def setEmbeddingModel(self, model_name, config: dict):
        self.embedding_models = EmbeddingModelFactory.get_method(model_name, config)
        
        
