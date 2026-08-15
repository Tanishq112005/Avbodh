import { RabbitMQConsumer, NotificationBuilder } from "@avbodh/typescript";
import { rabbitMqClient } from "../main";
import { emailService } from "../services/brevo";

export class EmailConsumer {
  private consumer: RabbitMQConsumer;

  constructor() {
    this.consumer = new RabbitMQConsumer(rabbitMqClient);
  }

  async start() {
    const exchangeName = "main_exchange";
    const queueName = "email_queue";
    const routingKey = "email.send";

    console.log("Initializing Email Consumer... Waiting for messages...");

    await this.consumer.consume(
      exchangeName,
      queueName,
      routingKey,
      async (data: any, msg: any, channel: any) => {
        const rawMessage = data.message ? data.message : data;

        if (!rawMessage.toEmail && !rawMessage.toPhone) {
          console.warn("⚠️ Invalid message format:", data);
          channel.ack(msg);
          return;
        }

      
        const message = new NotificationBuilder().fromJSON(data).build();

     
        await emailService.send(message);
        console.log(`Email successfully sent via Brevo to ${message.toEmail}`);

    
        channel.ack(msg);
      }
    );
  }
}

// Helper function to start the consumer easily from main.ts
export const startEmailConsumer = async () => {
  const consumer = new EmailConsumer();
  await consumer.start();
};
