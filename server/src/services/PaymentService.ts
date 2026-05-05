import Razorpay from "razorpay";
import crypto from "crypto";
import type { IOrderRepository } from "../interfaces/repositories/IOrderRepository";
import { IPaymentService } from "../interfaces/services/IPaymentService";

export class PaymentService implements IPaymentService {
  constructor(private readonly orderRepo: IOrderRepository) {}

  private getRazorpay(): Razorpay {
    const keyId = process.env["RAZORPAY_KEY_ID"] ?? "";
    const keySecret = process.env["RAZORPAY_KEY_SECRET"] ?? "";
    if (!keyId || !keySecret)
      throw new Error("Razorpay keys not configured in .env");
    return new Razorpay({ key_id: keyId, key_secret: keySecret });
  }

  async createRazorpayOrder(amount: number, currency = "INR", receipt: string) {
    const razorpay = this.getRazorpay();
    return razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt,
    });
  }

  async verifyAndRecord(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    orderId: string,
  ): Promise<void> {
    const keySecret = process.env["RAZORPAY_KEY_SECRET"] ?? "";
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expected = crypto
      .createHmac("sha256", keySecret)
      .update(body)
      .digest("hex");

    if (expected !== razorpaySignature)
      throw new Error("Invalid payment signature");
    await this.orderRepo.updatePayment(orderId, razorpayPaymentId);
  }
}
