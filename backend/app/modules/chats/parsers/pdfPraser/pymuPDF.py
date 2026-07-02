import fitz  # PyMuPDF
from app.modules.chats.parsers.pdfPraser.interfaces import IFileParser

class PDFParser(IFileParser):
    async def parse(self, file_path: str) -> str:
        extracted_text = ""
        try:
            document = fitz.open(file_path)
        
            for page_num in range(len(document)):
                page = document.load_page(page_num)
                extracted_text += page.get_text("text") + "\n\n"
                
            document.close()
  
            if not extracted_text.strip():
                return "[Error: PDF is empty or contains unreadable scanned images.]"
                
            return extracted_text
            
        except Exception as e:
            raise ValueError(f"PDF parsing failed: {str(e)}")