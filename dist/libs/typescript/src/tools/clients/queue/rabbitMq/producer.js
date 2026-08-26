"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQProducer = void 0;
const tslib_1 = require("tslib");
class RabbitMQProducer {
    constructor(client) {
        this.client = client;
    }
    publish(exchange, routingKey, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const channel = yield this.client.getChannel();
                // Assert the exchange just in case it doesn't exist
                yield channel.assertExchange(exchange, "direct", { durable: true });
                // Convert the object into a JSON string
                const jsonString = JSON.stringify(data);
                // Convert the string into raw bytes (Buffer) for RabbitMQ
                const bufferData = Buffer.from(jsonString);
                channel.publish(exchange, routingKey, bufferData, { persistent: true } // Ensure message survives broker restarts
                );
                console.log(`[RabbitMQProducer] Successfully published message to exchange '${exchange}' with routing key '${routingKey}'`);
            }
            catch (err) {
                console.error("[RabbitMQProducer] Error publishing message:", err);
                throw err;
            }
        });
    }
}
exports.RabbitMQProducer = RabbitMQProducer;
//# sourceMappingURL=producer.js.map