"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var connection_exports = {};
__export(connection_exports, {
  RabbitMQClient: () => RabbitMQClient
});
module.exports = __toCommonJS(connection_exports);
var import_amqplib = __toESM(require("amqplib"));
var import_typescript = require("@avbodh/typescript");
class RabbitMQClient {
  constructor(api_key) {
    this.connection = null;
    this.channel = null;
    this.connected = false;
    this.reconnectAttempts = 0;
    this.reconnecting = false;
    this.MAX_RECONNECT_ATTEMPTS = 10;
    this.RECONNECT_DELAY_MS = 5e3;
    this.api_key = null;
    this.api_key = api_key;
  }
  async connect() {
    if (this.connected && this.channel) return;
    try {
      console.log(`Connecting to RabbitMQ... (Attempt ${this.reconnectAttempts + 1})`);
      if (!this.api_key) {
        throw new Error("FATAL: QUEUE URL is undefined. Check .env.dev loading.");
      }
      this.connection = await import_amqplib.default.connect(this.api_key);
      this.channel = await this.connection.createChannel();
      this.connected = true;
      this.reconnecting = false;
      this.reconnectAttempts = 0;
      console.log("Queue Connected Successfully");
      this.connection.on("error", (err) => {
        console.error("Queue Connection Error:", err.message);
        this.handleDisconnect();
      });
      this.connection.on("close", () => {
        console.warn("Queue Connection Closed. Triggering reconnect...");
        this.handleDisconnect();
      });
      this.channel.on("error", (err) => {
        console.error("Queue Channel Error:", err.message);
        this.handleDisconnect();
      });
      this.channel.on("close", () => {
        console.warn("Queue Channel Closed. Triggering reconnect...");
        this.handleDisconnect();
      });
      return this;
    } catch (error) {
      console.error("Queue Connection Failed:", error.message);
      this.connected = false;
      this.channel = null;
      this.connection = null;
      await this.scheduleReconnect();
      return this;
    }
  }
  handleDisconnect() {
    if (this.reconnecting) return;
    this.connected = false;
    this.channel = null;
    this.connection = null;
    this.reconnecting = true;
    this.scheduleReconnect();
  }
  async scheduleReconnect() {
    if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
      console.error(`Max reconnect attempts (${this.MAX_RECONNECT_ATTEMPTS}) reached. Giving up.`);
      this.reconnecting = false;
      return;
    }
    this.reconnectAttempts++;
    const delay = this.RECONNECT_DELAY_MS * this.reconnectAttempts;
    console.log(`Reconnecting in ${delay / 1e3}s... (Attempt ${this.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS})`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    await this.connect();
  }
  async getChannel() {
    if (this.reconnecting) {
      console.log("Waiting for RabbitMQ reconnection...");
      await this.waitForReconnection();
    }
    if (!this.channel || !this.connected) {
      await this.connect();
    }
    return this.channel;
  }
  // Polls until reconnection is done or channel is available
  waitForReconnection() {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (this.connected && this.channel) {
          clearInterval(interval);
          resolve();
        } else if (!this.reconnecting && (!this.connected || !this.channel)) {
          clearInterval(interval);
          reject(new import_typescript.ApiError("RabbitMQ is unavailable after reconnection attempts", new Error("Reconnection failed")));
        }
      }, 500);
    });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RabbitMQClient
});
