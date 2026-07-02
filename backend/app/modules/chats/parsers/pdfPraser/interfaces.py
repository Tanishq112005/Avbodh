from abc import ABC, abstractmethod
from typing import Any

class IPdfParser(ABC):
    
    
    @abstractmethod
    async def parse(self, file_path: str) -> Any:
        pass
