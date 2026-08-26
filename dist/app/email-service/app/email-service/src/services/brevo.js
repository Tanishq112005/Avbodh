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
var brevo_exports = {};
__export(brevo_exports, {
  emailService: () => emailService
});
module.exports = __toCommonJS(brevo_exports);
var import_axios = __toESM(require("axios"));
var import_env = require("../config/env");
var import_typescript = require("@avbodh/typescript");
var import_emailTemplate = require("../utils/emailTemplate");
const BREVO_ACCOUNTS = [
  { apiKey: import_env.BREVO_KEY_1 ?? "", emailId: import_env.EMAIL_ID_1 ?? "", sentCount: 0 }
].filter((account) => account.apiKey !== "" && account.emailId !== "");
const MAX_EMAILS_PER_ACCOUNT = 295;
class Brevo {
  constructor() {
    this.currentKeyIndex = 0;
  }
  async send(message) {
    if (BREVO_ACCOUNTS.length === 0) {
      throw new import_typescript.ApiError("No Brevo accounts configured. Please check your .env file.", 500);
    }
    if (!message.toEmail) {
      throw new import_typescript.ApiError("Email destination is required for Brevo service", 400);
    }
    if (!message.content) {
      throw new import_typescript.ApiError(
        "No Content is There , Please Add It",
        500
      );
    }
    if (!message.type) {
      throw new import_typescript.ApiError(
        "Error  message type is not present"
      );
    }
    let attempts = 0;
    while (attempts < BREVO_ACCOUNTS.length) {
      const account = BREVO_ACCOUNTS[this.currentKeyIndex];
      if (account.sentCount >= MAX_EMAILS_PER_ACCOUNT) {
        console.log(`\u{1F53B} Account #${this.currentKeyIndex + 1} reached internal limit of ${MAX_EMAILS_PER_ACCOUNT}. Switching to next...`);
        this.currentKeyIndex = (this.currentKeyIndex + 1) % BREVO_ACCOUNTS.length;
        attempts++;
        continue;
      }
      try {
        console.log(`Trying Brevo Account #${this.currentKeyIndex + 1} (Sent: ${account.sentCount}/${MAX_EMAILS_PER_ACCOUNT})...`);
        const response = await import_axios.default.post(
          "https://api.brevo.com/v3/smtp/email",
          {
            // 4. Use the dynamic sender email from the account object
            sender: { name: "Avbodh Support", email: account.emailId },
            to: [{ email: message.toEmail, name: "User" }],
            subject: message.subject,
            htmlContent: (0, import_emailTemplate.emailTemplate)(message.content)
          },
          {
            headers: {
              "api-key": account.apiKey,
              // Use the specific key
              "Content-Type": "application/json",
              "accept": "application/json"
            }
          }
        );
        account.sentCount++;
        console.log(`Success! Sent via Account #${this.currentKeyIndex + 1}`);
        return response.data;
      } catch (error) {
        const status = error.response?.status;
        const errorMsg = error.response?.data?.message || error.message;
        console.warn(`Account #${this.currentKeyIndex + 1} Failed: ${errorMsg}`);
        if (status === 402 || status === 429 || errorMsg.toLowerCase().includes("credit") || errorMsg.toLowerCase().includes("exhausted") || errorMsg.toLowerCase().includes("limit")) {
          console.log(`\u{1F53B} Account #${this.currentKeyIndex + 1} Quota Empty. Switching to next...`);
          this.currentKeyIndex = (this.currentKeyIndex + 1) % BREVO_ACCOUNTS.length;
          attempts++;
        } else {
          console.error(`Fatal Error (Not Quota Related) for Account #${this.currentKeyIndex + 1}. Stopping.`);
          throw new import_typescript.ApiError(`Email Failed: ${errorMsg}`, 500);
        }
      }
    }
    throw new import_typescript.ApiError("All Brevo Accounts Exhausted", 500);
  }
}
const emailService = new Brevo();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  emailService
});
