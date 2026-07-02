from abc import ABC, abstractmethod
from typing import Any

class IImageParser(ABC):
    
    
    @abstractmethod
    async def parse(self, file_path: str) -> Any:
        pass
