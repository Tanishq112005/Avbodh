import base64
import aiofiles
from app.modules.chats.parsers.imageParser.interfaces import IFileParser

class ImageParser(IFileParser):
    async def parse(self, file_path: str) -> str:
        try:
            # Asynchronously image ko binary mode ('rb') mein read kiya
            async with aiofiles.open(file_path, 'rb') as image_file:
                image_data = await image_file.read()
                
            # Base64 mein convert kiya (LLMs yahi format samajhte hain)
            base64_encoded = base64.b64encode(image_data).decode('utf-8')
            
            # Image ki extension nikal kar proper data URI format banana
            ext = file_path.split('.')[-1].lower()
            mime_type = f"image/{'jpeg' if ext == 'jpg' else ext}"
            
            return f"data:{mime_type};base64,{base64_encoded}"
            
        except Exception as e:
            raise ValueError(f"Image parsing failed: {str(e)}")