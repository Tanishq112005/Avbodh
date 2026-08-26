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
var producer_exports = {};
__export(producer_exports, {
  RabbitMQProducer: () => RabbitMQProducer
});
module.exports = __toCommonJS(producer_exports);
class RabbitMQProducer {
  constructor(client) {
    this.client = client;
  }
  async publish(exchange, routingKey, data) {
    try {
      const channel = await this.client.getChannel();
      await channel.assertExchange(exchange, "direct", { durable: true });
      const jsonString = JSON.stringify(data);
      const bufferData = Buffer.from(jsonString);
      channel.publish(
        exchange,
        routingKey,
        bufferData,
        { persistent: true }
        // Ensure message survives broker restarts
      );
      console.log(`[RabbitMQProducer] Successfully published message to exchange '${exchange}' with routing key '${routingKey}'`);
    } catch (err) {
      console.error("[RabbitMQProducer] Error publishing message:", err);
      throw err;
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RabbitMQProducer
});
