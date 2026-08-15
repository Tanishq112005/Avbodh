import { appRabbitMQ } from "../../main"; 
import { NotificationMessage } from "@avbodh/typescript";
import { QUEUE_EXCHANGE , QUEUE_ROUTING_EMAIL } from "../../config/env";
export class EmailProducer {
  constructor() {}

  async send(data: NotificationMessage) {
    try {
      const channel = await appRabbitMQ.getChannel(); 
      console.log(data); 
      console.log("From the producer");
      
      const exchange = QUEUE_EXCHANGE;
      const routingKey = QUEUE_ROUTING_EMAIL;

      await channel.assertExchange(exchange as string, "direct", { durable: true });

      // 1. Convert the class instance properties into a JSON string
      const jsonString = JSON.stringify(data);
      
      // 2. Convert the string into raw bytes (Buffer) for RabbitMQ
      const bufferData = Buffer.from(jsonString);
      channel.publish(
        exchange as string,
        routingKey as string,
        bufferData, // <-- Send the Buffer, not the object
        { persistent: true }
      );
      
      console.log(`OTP Sent via Queue`);

    } catch (err: any) {
      console.error("Producer Error:", err);
      throw err;
    }
  }
}

export const emailProducer = new EmailProducer();
