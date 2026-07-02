## database connection file 

from prisma import Prisma

class DatabaseClient:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = Prisma()
        return cls._instance

db = DatabaseClient()