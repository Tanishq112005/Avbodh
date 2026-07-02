from app.modules.chats.parsers.pdfPraser.interfaces import IPdfParser
from app.modules.chats.parsers.imageParser.interfaces import IImageParser

class Parser:

    def __init__(self):
        self.pdfParser = None
        self.imageParser = None
    
    # Added 'def', changed the type hint syntax to ':', and renamed 'object'
    def setPdfParser(self, parser_obj: IPdfParser):
        self.pdfParser = parser_obj 
     
    # Added 'def', changed the type hint syntax to ':', and renamed 'object'
    def setImageParser(self, parser_obj: IImageParser):
        self.imageParser = parser_obj