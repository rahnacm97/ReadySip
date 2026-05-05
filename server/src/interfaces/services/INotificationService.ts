export interface IEmailService {
  sendOTP(email: string, otp: string): Promise<void>;
  sendOrderConfirmationToAdmin(order: {
    customerName: string;
    customerPhone: string;
    items: { title: string; quantity: number; price: number }[];
    timeOfArrival: string;
    totalAmount: number;
    orderId: string;
  }): Promise<void>;
  sendOrderAcceptedToCustomer(
    email: string,
    name: string,
    timeOfArrival: string,
  ): Promise<void>;
  sendPasswordReset(email: string, resetUrl: string): Promise<void>;
}

export interface ISMSService {
  sendNewOrderAlert(
    adminPhone: string,
    customerName: string,
    orderId: string,
  ): Promise<void>;
  sendOrderAccepted(
    customerPhone: string,
    customerName: string,
    timeOfArrival: string,
  ): Promise<void>;
}
