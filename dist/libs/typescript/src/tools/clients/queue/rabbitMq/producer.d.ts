import { RabbitMQClient } from "./connection";
export declare class RabbitMQProducer {
    private client;
    constructor(client: RabbitMQClient);
    publish(exchange: string, routingKey: string, data: any): Promise<void>;
}
