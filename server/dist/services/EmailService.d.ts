import type { IEmailService } from "../interfaces/services/INotificationService";
export declare class EmailService implements IEmailService {
    private readonly transporter;
    private readonly from;
    sendOTP(email: string, otp: string): Promise<void>;
    sendOrderConfirmationToAdmin(order: {
        customerName: string;
        customerPhone: string;
        items: {
            title: string;
            quantity: number;
            price: number;
        }[];
        timeOfArrival: string;
        totalAmount: number;
        orderId: string;
    }): Promise<void>;
    sendOrderAcceptedToCustomer(email: string, name: string, timeOfArrival: string): Promise<void>;
}
