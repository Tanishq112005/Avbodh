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
        console.log("📨 Received new message from queue:", JSON.stringify(data, null, 2));
        
        try {
          const rawMessage = data.message ? data.message : data;

          if (!rawMessage.toEmail && !rawMessage.toPhone) {
            console.warn("⚠️ Invalid message format. Missing toEmail/toPhone:", data);
            channel.ack(msg);
            return;
          }

          const message = new NotificationBuilder().fromJSON(data).build();

          console.log(`🚀 Attempting to send email to ${message.toEmail}...`);
          await emailService.send(message);
          
          console.log(`✅ Email successfully sent via Brevo to ${message.toEmail}`);
          channel.ack(msg);
        } catch (error: any) {
          console.error("❌ Failed to process or send email:", error.message || error);
          // Assuming we want to reject or nack it on failure, but for now just log it
          // You might want to use channel.nack(msg, false, false) for dead-lettering later
          channel.ack(msg); // acking so it doesn't infinitely loop on crash while testing
        }
      }
    );
  }
}

// Helper function to start the consumer easily from main.ts
export const startEmailConsumer = async () => {
  const consumer = new EmailConsumer();
  await consumer.start();
};
