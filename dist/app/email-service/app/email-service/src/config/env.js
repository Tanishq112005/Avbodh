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
var env_exports = {};
__export(env_exports, {
  BREVO_KEY_1: () => BREVO_KEY_1,
  EMAIL_ID_1: () => EMAIL_ID_1,
  EMAIL_QUEUE_NAME: () => EMAIL_QUEUE_NAME,
  EXCHANGE_KEY: () => EXCHANGE_KEY,
  HOST: () => HOST,
  PORT: () => PORT,
  QUEUE_URL: () => QUEUE_URL
});
module.exports = __toCommonJS(env_exports);
var import_dotenv = __toESM(require("dotenv"));
var import_path = __toESM(require("path"));
var import_fs = __toESM(require("fs"));
process.env.DOTENV_QUIET = "true";
const envPaths = [
  import_path.default.join(process.cwd(), ".env"),
  import_path.default.join(process.cwd(), "app/email-service/.env")
];
for (const p of envPaths) {
  if (import_fs.default.existsSync(p)) {
    import_dotenv.default.config({ path: p });
    break;
  }
}
function requireEnv(key) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: "${key}"`);
  }
  return value;
}
const { PORT, HOST, QUEUE_URL, EXCHANGE_KEY, EMAIL_QUEUE_NAME, BREVO_KEY_1, EMAIL_ID_1 } = process.env;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BREVO_KEY_1,
  EMAIL_ID_1,
  EMAIL_QUEUE_NAME,
  EXCHANGE_KEY,
  HOST,
  PORT,
  QUEUE_URL
});
