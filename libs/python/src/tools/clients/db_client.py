import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

class SQLDatabaseClientFactory:
    """
    A generic factory to create SQL database connections (PostgreSQL, MySQL, SQLite)
    using SQLAlchemy.
    """
    _engine = None
    _SessionLocal = None

    @classmethod
    def initialize(cls):
        """
        Initializes the database engine using the DATABASE_URL environment variable.
        Example URL: postgresql://user:password@localhost/dbname
        """
        if cls._engine is None:
            # Defaulting to an in-memory SQLite database if no URL is provided, 
            # to prevent crashes during initial testing.
            database_url = os.getenv("DATABASE_URL", "sqlite:///:memory:")
            
            cls._engine = create_engine(database_url, pool_pre_ping=True)
            cls._SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=cls._engine)
            print(f"Database engine initialized for {database_url.split('://')[0]}")

    @classmethod
    def get_session(cls):
        """
        Returns a new database session.
        Usage:
            session = SQLDatabaseClientFactory.get_session()
            # do work
            session.close()
        """
        if cls._SessionLocal is None:
            cls.initialize()
        return cls._SessionLocal()
