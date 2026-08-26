export interface NotificationMessage {
    toEmail?: string;
    toPhone?: string;
    subject?: string;
    type?: string;
    content?: string;
    cc?: string[];
    metadata?: Record<string, any>;
}
export interface INotificationService {
    send(message: NotificationMessage): Promise<any>;
}
