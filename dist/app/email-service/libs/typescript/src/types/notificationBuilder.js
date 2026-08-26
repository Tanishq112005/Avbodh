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
var notificationBuilder_exports = {};
__export(notificationBuilder_exports, {
  NotificationBuilder: () => NotificationBuilder
});
module.exports = __toCommonJS(notificationBuilder_exports);
class NotificationBuilder {
  constructor() {
    this.message = {};
  }
  setToEmail(email) {
    this.message.toEmail = email;
    return this;
  }
  setType(type) {
    this.message.type = type;
    return this;
  }
  setToPhone(phone) {
    this.message.toPhone = phone;
    return this;
  }
  setSubject(subject) {
    this.message.subject = subject;
    return this;
  }
  setContent(content) {
    this.message.content = content;
    return this;
  }
  addCc(email) {
    if (!this.message.cc) {
      this.message.cc = [];
    }
    this.message.cc.push(email);
    return this;
  }
  fromJSON(data) {
    const rawData = data.message ? data.message : data;
    Object.assign(this.message, rawData);
    return this;
  }
  build() {
    if (!this.message.toEmail && !this.message.toPhone) {
      throw new Error("Cannot build notification: No destination (email or phone) provided.");
    }
    return this.message;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  NotificationBuilder
});
