import { RabbitMQClient } from "./connection";
import { Channel } from "amqplib";
type MessageHandler = (data: any, msg: any, channel: Channel) => Promise<void>;
export declare class RabbitMQConsumer {
    private client;
    constructor(client: RabbitMQClient);
    consume(exchange: string, queueName: string, routingKey: string, callback: MessageHandler): Promise<void>;
}
export {};
