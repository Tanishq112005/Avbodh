from app.modules.chats.chat import Chat
from app.modules.chats.parsers.imageParser.aioFiles import ImageParser
from app.modules.chats.parsers.pdfPraser.pymuPDF import PDFParser


class ChatBuilder:
    """
    Builder class for constructing Chat instances step-by-step.
    """
    def __init__(self):
        # Start with a fresh, empty Chat instance
        self._chat = Chat()
        
    def with_query(self, query: str) -> 'ChatBuilder':
        self._chat.setQuery(query)
        return self

    def add_file_url(self, url: str) -> 'ChatBuilder':
        """Appends a single document/file URL to the chat."""
        self._chat.addFileUrl(url)
        return self
        
    def with_file_urls(self, urls: list) -> 'ChatBuilder':
        """Adds a list of multiple document/file URLs to the chat at once."""
        for url in urls:
            self._chat.addFileUrl(url)
        return self

    def add_image_url(self, url: str) -> 'ChatBuilder':
        """Appends a single image URL to the chat."""
        self._chat.addImageUrl(url)
        return self

    def with_image_urls(self, urls: list) -> 'ChatBuilder':
        """Adds a list of multiple image URLs to the chat at once."""
        for url in urls:
            self._chat.addImageUrl(url)
        return self
        
    def with_chat_model(self, model_name: str, config: dict = None) -> 'ChatBuilder':
        config = config or {}
        self._chat.setChatModel(model_name, config)
        return self
        
    def with_embedding_model(self, model_name: str, config: dict = None) -> 'ChatBuilder':
        config = config or {}
        self._chat.setEmbeddingModel(model_name, config)
        return self
        
    def with_pdf_parser(self) -> 'ChatBuilder':
        self._chat.parser.pdfParser = PDFParser()
        return self
        
    def with_image_parser(self) -> 'ChatBuilder':
        self._chat.parser.imageParser = ImageParser()
        return self
        
    def build(self) -> Chat:
        return self._chat
