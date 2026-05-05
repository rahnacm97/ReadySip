import type { IOrderRepository } from "../interfaces/repositories/IOrderRepository";
import { IPaymentService } from "../interfaces/services/IPaymentService";
export declare class PaymentService implements IPaymentService {
    private readonly orderRepo;
    constructor(orderRepo: IOrderRepository);
    private getRazorpay;
    createRazorpayOrder(amount: number, currency: string | undefined, receipt: string): Promise<import("razorpay/dist/types/orders").Orders.RazorpayOrder>;
    verifyAndRecord(razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string, orderId: string): Promise<void>;
}
