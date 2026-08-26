import { Channel } from "amqplib";
declare class RabbitMQClient {
    private connection;
    private channel;
    private connected;
    private reconnectAttempts;
    private reconnecting;
    private readonly MAX_RECONNECT_ATTEMPTS;
    private readonly RECONNECT_DELAY_MS;
    private api_key;
    constructor(api_key: string);
    connect(): Promise<this | undefined>;
    private handleDisconnect;
    private scheduleReconnect;
    getChannel(): Promise<Channel>;
    private waitForReconnection;
}
export { RabbitMQClient };
