import { appRabbitMQ } from "../../main"; 
import { NotificationMessage, RabbitMQProducer } from "@avbodh/typescript";
import { QUEUE_EXCHANGE , QUEUE_ROUTING_EMAIL } from "../../config/env";

export class EmailProducer {
  private producer: RabbitMQProducer;

  constructor() {
    this.producer = new RabbitMQProducer(appRabbitMQ);
  }

  async send(data: NotificationMessage) {
    try {
      console.log(data); 
      console.log("From the producer");
      
      const exchange = QUEUE_EXCHANGE as string;
      const routingKey = QUEUE_ROUTING_EMAIL as string;

      // The generic producer handles the JSON.stringify, Buffer.from, and assertExchange!
      await this.producer.publish(exchange, routingKey, data);
      
      console.log(`OTP Sent via Queue`);

    } catch (err: any) {
      console.error("Producer Error:", err);
      throw err;
    }
  }
}

export const emailProducer = new EmailProducer();
