import { RabbitMQClient } from "./connection";

export class RabbitMQProducer {
  private client: RabbitMQClient;

  constructor(client: RabbitMQClient) {
    this.client = client;
  }

 
  async publish(exchange: string, routingKey: string, data: any): Promise<void> {
    try {
      const channel = await this.client.getChannel();

      // Assert the exchange just in case it doesn't exist
      await channel.assertExchange(exchange, "direct", { durable: true });

      // Convert the object into a JSON string
      const jsonString = JSON.stringify(data);

      // Convert the string into raw bytes (Buffer) for RabbitMQ
      const bufferData = Buffer.from(jsonString);
      
      channel.publish(
        exchange,
        routingKey,
        bufferData,
        { persistent: true } // Ensure message survives broker restarts
      );

      console.log(`[RabbitMQProducer] Successfully published message to exchange '${exchange}' with routing key '${routingKey}'`);
    } catch (err: any) {
      console.error("[RabbitMQProducer] Error publishing message:", err);
      throw err;
    }
  }
}
