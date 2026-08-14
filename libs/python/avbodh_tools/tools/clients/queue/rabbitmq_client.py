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

    async def publish_to_exchange(self, exchange_name: str, message_data: Dict[str, Any], routing_key: str = ""):
        """Publishes a JSON message to a specific exchange (Pub/Sub)."""
        await self.connect()
        exchange = await self.channel.declare_exchange(
            exchange_name, aio_pika.ExchangeType.FANOUT, durable=True
        )
        
        message_body = json.dumps(message_data).encode()
        message = aio_pika.Message(
            body=message_body,
            delivery_mode=aio_pika.DeliveryMode.PERSISTENT
        )
        
        await exchange.publish(message, routing_key=routing_key)
        print(f"Published message to exchange '{exchange_name}'")

    async def consume_from_exchange(self, exchange_name: str, queue_name: str, callback_func):
        """
        Binds a queue to a fanout exchange and consumes messages.
        The callback_func should be an async function accepting a dictionary (the parsed JSON).
        """
        await self.connect()
        exchange = await self.channel.declare_exchange(
            exchange_name, aio_pika.ExchangeType.FANOUT, durable=True
        )
        
        queue = await self.channel.declare_queue(queue_name, durable=True)
        await queue.bind(exchange)
        
        async def on_message(message: aio_pika.abc.AbstractIncomingMessage):
            async with message.process():
                try:
                    data = json.loads(message.body.decode())
                    await callback_func(data)
                except Exception as e:
                    print(f"Error processing message in queue '{queue_name}': {e}")
                    
        await queue.consume(on_message)
        print(f"Started consuming from exchange '{exchange_name}' on queue '{queue_name}'")

    async def close(self):
        """Closes the RabbitMQ connection cleanly."""
        if self.connection and not self.connection.is_closed:
            await self.connection.close()
            print("RabbitMQ connection closed.")
