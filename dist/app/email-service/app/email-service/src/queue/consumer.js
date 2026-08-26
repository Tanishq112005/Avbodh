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
  EmailConsumer: () => EmailConsumer,
  startEmailConsumer: () => startEmailConsumer
});
module.exports = __toCommonJS(consumer_exports);
var import_typescript = require("@avbodh/typescript");
var import_main = require("../main");
var import_brevo = require("../services/brevo");
class EmailConsumer {
  constructor() {
    this.consumer = new import_typescript.RabbitMQConsumer(import_main.rabbitMqClient);
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
      async (data, msg, channel) => {
        console.log("\u{1F4E8} Received new message from queue:", JSON.stringify(data, null, 2));
        try {
          const rawMessage = data.message ? data.message : data;
          if (!rawMessage.toEmail && !rawMessage.toPhone) {
            console.warn("\u26A0\uFE0F Invalid message format. Missing toEmail/toPhone:", data);
            channel.ack(msg);
            return;
          }
          const message = new import_typescript.NotificationBuilder().fromJSON(data).build();
          console.log(`\u{1F680} Attempting to send email to ${message.toEmail}...`);
          await import_brevo.emailService.send(message);
          console.log(`\u2705 Email successfully sent via Brevo to ${message.toEmail}`);
          channel.ack(msg);
        } catch (error) {
          console.error("\u274C Failed to process or send email:", error.message || error);
          channel.ack(msg);
        }
      }
    );
  }
}
const startEmailConsumer = async () => {
  const consumer = new EmailConsumer();
  await consumer.start();
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EmailConsumer,
  startEmailConsumer
});
