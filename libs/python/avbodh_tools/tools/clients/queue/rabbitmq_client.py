import os
import json
import aio_pika
from typing import Optional, Any, Dict

class AvbodhRabbitMQClient:
    """
    A generic async RabbitMQ connection client using aio_pika.
    Provides methods for publishing and consuming messages.
    """

    def __init__(self, uri: str = None):
        # Fallback to environment variables if URI is not provided directly
        self.uri = uri or os.getenv("RABBITMQ_URI", "amqp://guest:guest@localhost:5672/")
        self.connection: Optional[aio_pika.RobustConnection] = None
        self.channel: Optional[aio_pika.Channel] = None

    async def connect(self):
        """Establishes a connection to the RabbitMQ server."""
        if not self.connection or self.connection.is_closed:
            self.connection = await aio_pika.connect_robust(self.uri)
            self.channel = await self.connection.channel()
            print("Connected to RabbitMQ (aio_pika)")
        return self.channel

    

    async def close(self):
        """Closes the RabbitMQ connection cleanly."""
        if self.connection and not self.connection.is_closed:
            await self.connection.close()
            print("RabbitMQ connection closed.")
