"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQClient = void 0;
const tslib_1 = require("tslib");
const amqplib_1 = tslib_1.__importDefault(require("amqplib"));
const typescript_1 = require("@avbodh/typescript");
class RabbitMQClient {
    constructor(api_key) {
        this.connection = null;
        this.channel = null;
        this.connected = false;
        this.reconnectAttempts = 0;
        this.reconnecting = false;
        this.MAX_RECONNECT_ATTEMPTS = 10;
        this.RECONNECT_DELAY_MS = 5000;
        this.api_key = null;
        this.api_key = api_key;
    }
    connect() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.connected && this.channel)
                return;
            try {
                console.log(`Connecting to RabbitMQ... (Attempt ${this.reconnectAttempts + 1})`);
                if (!this.api_key) {
                    throw new Error("FATAL: QUEUE URL is undefined. Check .env.dev loading.");
                }
                this.connection = yield amqplib_1.default.connect(this.api_key);
                this.channel = yield this.connection.createChannel();
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
                return this; // Return the client instance here!
            }
            catch (error) {
                console.error("Queue Connection Failed:", error.message);
                this.connected = false;
                this.channel = null;
                this.connection = null;
                yield this.scheduleReconnect();
                return this; // Return the client instance even if reconnecting
            }
        });
    }
    handleDisconnect() {
        // Prevent multiple simultaneous reconnect loops
        if (this.reconnecting)
            return;
        this.connected = false;
        this.channel = null;
        this.connection = null;
        this.reconnecting = true;
        this.scheduleReconnect();
    }
    scheduleReconnect() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
                console.error(`Max reconnect attempts (${this.MAX_RECONNECT_ATTEMPTS}) reached. Giving up.`);
                this.reconnecting = false;
                return;
            }
            this.reconnectAttempts++;
            const delay = this.RECONNECT_DELAY_MS * this.reconnectAttempts;
            console.log(`Reconnecting in ${delay / 1000}s... (Attempt ${this.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS})`);
            yield new Promise((resolve) => setTimeout(resolve, delay));
            yield this.connect();
        });
    }
    getChannel() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // If reconnection is in progress, wait until it resolves
            if (this.reconnecting) {
                console.log("Waiting for RabbitMQ reconnection...");
                yield this.waitForReconnection();
            }
            if (!this.channel || !this.connected) {
                yield this.connect();
            }
            return this.channel;
        });
    }
    // Polls until reconnection is done or channel is available
    waitForReconnection() {
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                if (this.connected && this.channel) {
                    clearInterval(interval);
                    resolve();
                }
                else if (!this.reconnecting && (!this.connected || !this.channel)) {
                    // Reconnection gave up
                    clearInterval(interval);
                    reject(new typescript_1.ApiError("RabbitMQ is unavailable after reconnection attempts", new Error("Reconnection failed")));
                }
            }, 500);
        });
    }
}
exports.RabbitMQClient = RabbitMQClient;
//# sourceMappingURL=connection.js.map