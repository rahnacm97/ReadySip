export interface IPaymentService {
  createRazorpayOrder(
    amount: number,
    currency: string,
    receipt: string,
  ): Promise<any>;
  verifyAndRecord(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    orderId: string,
  ): Promise<void>;
}
