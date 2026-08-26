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
var main_exports = {};
__export(main_exports, {
  rabbitMqClient: () => rabbitMqClient
});
module.exports = __toCommonJS(main_exports);
var import_express = __toESM(require("express"));
var import_env = require("./config/env");
var import_typescript = require("@avbodh/typescript");
var import_consumer = require("./queue/consumer");
const host = String(import_env.HOST || "");
const port = parseInt(import_env.PORT || "3000");
const app = (0, import_express.default)();
app.get("/", (req, res) => {
  res.send({ message: "Hello API" });
});
const apiKey = String(import_env.QUEUE_URL);
const rabbitMqClient = new import_typescript.RabbitMQClient(apiKey);
app.get("/health", (req, res) => {
  res.status(200).json(
    new import_typescript.ApiResponse(
      "Server is running properly"
    )
  );
});
async function startServer() {
  await rabbitMqClient.connect();
  await (0, import_consumer.startEmailConsumer)();
  app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
  });
}
startServer();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  rabbitMqClient
});
