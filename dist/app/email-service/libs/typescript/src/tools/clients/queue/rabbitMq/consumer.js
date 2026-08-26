"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var consumer_exports = {};
__export(consumer_exports, {
  RabbitMQConsumer: () => RabbitMQConsumer
});
module.exports = __toCommonJS(consumer_exports);
class RabbitMQConsumer {
  constructor(client) {
    this.client = client;
  }
  async consume(exchange, queueName, routingKey, callback) {
    try {
      const channel = await this.client.getChannel();
      await channel.assertExchange(exchange, "direct", { durable: true });
      await channel.assertQueue(queueName, { durable: true });
      await channel.bindQueue(queueName, exchange, routingKey);
      console.log(`[RabbitMQConsumer] Started consuming on queue '${queueName}' bound to exchange '${exchange}'`);
      channel.consume(queueName, async (msg) => {
        if (!msg) return;
        try {
          const data = JSON.parse(msg.content.toString());
          await callback(data, msg, channel);
        } catch (err) {
          console.error(`[RabbitMQConsumer] Error processing message on queue '${queueName}':`, err);
          try {
            channel.nack(msg, false, false);
          } catch (nackErr) {
          }
        }
      });
    } catch (err) {
      console.error("[RabbitMQConsumer] Error starting consumer:", err);
      throw err;
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RabbitMQConsumer
});
