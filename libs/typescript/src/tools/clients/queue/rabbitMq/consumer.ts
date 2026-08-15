import { RabbitMQClient } from "./connection";
import { Channel } from "amqplib";

type MessageHandler = (data: any, msg: any, channel: Channel) => Promise<void>;

export class RabbitMQConsumer {
  private client: RabbitMQClient;

  constructor(client: RabbitMQClient) {
    this.client = client;
  }

 
  async consume(
    exchange: string,
    queueName: string,
    routingKey: string,
    callback: MessageHandler
  ): Promise<void> {
    try {
      const channel = await this.client.getChannel();

      // Ensure the exchange and queue exist
      await channel.assertExchange(exchange, "direct", { durable: true });
      await channel.assertQueue(queueName, { durable: true });
      
      // Bind the queue to the exchange with the routing key
      await channel.bindQueue(queueName, exchange, routingKey);

      console.log(`[RabbitMQConsumer] Started consuming on queue '${queueName}' bound to exchange '${exchange}'`);

      channel.consume(queueName, async (msg: any) => {
        if (!msg) return;

        try {
          // Parse the buffer back into a JSON object automatically
          const data = JSON.parse(msg.content.toString());
          
          // Offload the custom business logic to the user's callback
          await callback(data, msg, channel);
          
        } catch (err) {
          console.error(`[RabbitMQConsumer] Error processing message on queue '${queueName}':`, err);
          // If the user hasn't already acked/nacked, safely nack it and do not requeue
          try {
            channel.nack(msg, false, false);
          } catch (nackErr) {
            // Ignore errors if the message was already acknowledged inside the callback
          }
        }
      });
    } catch (err) {
      console.error("[RabbitMQConsumer] Error starting consumer:", err);
      throw err;
    }
  }
}
