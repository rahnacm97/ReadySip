import type { ISMSService } from "../interfaces/services/INotificationService";
export declare class SMSService implements ISMSService {
    private getClient;
    sendNewOrderAlert(adminPhone: string, customerName: string, orderId: string): Promise<void>;
    sendOrderAccepted(customerPhone: string, customerName: string, timeOfArrival: string): Promise<void>;
}
