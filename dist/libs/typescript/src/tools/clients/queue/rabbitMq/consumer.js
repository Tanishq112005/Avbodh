"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQConsumer = void 0;
const tslib_1 = require("tslib");
class RabbitMQConsumer {
    constructor(client) {
        this.client = client;
    }
    consume(exchange, queueName, routingKey, callback) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const channel = yield this.client.getChannel();
                // Ensure the exchange and queue exist
                yield channel.assertExchange(exchange, "direct", { durable: true });
                yield channel.assertQueue(queueName, { durable: true });
                // Bind the queue to the exchange with the routing key
                yield channel.bindQueue(queueName, exchange, routingKey);
                console.log(`[RabbitMQConsumer] Started consuming on queue '${queueName}' bound to exchange '${exchange}'`);
                channel.consume(queueName, (msg) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    if (!msg)
                        return;
                    try {
                        // Parse the buffer back into a JSON object automatically
                        const data = JSON.parse(msg.content.toString());
                        // Offload the custom business logic to the user's callback
                        yield callback(data, msg, channel);
                    }
                    catch (err) {
                        console.error(`[RabbitMQConsumer] Error processing message on queue '${queueName}':`, err);
                        // If the user hasn't already acked/nacked, safely nack it and do not requeue
                        try {
                            channel.nack(msg, false, false);
                        }
                        catch (nackErr) {
                            // Ignore errors if the message was already acknowledged inside the callback
                        }
                    }
                }));
            }
            catch (err) {
                console.error("[RabbitMQConsumer] Error starting consumer:", err);
                throw err;
            }
        });
    }
}
exports.RabbitMQConsumer = RabbitMQConsumer;
//# sourceMappingURL=consumer.js.map