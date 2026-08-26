import { NotificationMessage } from "../types/notificationInterface";
export declare class NotificationBuilder {
    message: NotificationMessage;
    constructor();
    setToEmail(email: string): this;
    setType(type: string): this;
    setToPhone(phone: string): this;
    setSubject(subject: string): this;
    setContent(content: string): this;
    addCc(email: string): this;
    fromJSON(data: any): this;
    build(): NotificationMessage;
}
