import type { Request, Response } from "express";
import type { PaymentService } from "../services/PaymentService";
import { HttpStatus, ResponseMessages } from "../constants/enums";
import { IPaymentController } from "../interfaces/controllers/IPaymentController";

export class PaymentController implements IPaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const { amount, currency, receipt } = req.body as {
        amount: number;
        currency?: string;
        receipt: string;
      };
      if (!amount) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: ResponseMessages.VALIDATION_ERROR });
        return;
      }
      const order = await this.paymentService.createRazorpayOrder(
        amount,
        currency,
        receipt,
      );
      res.json({ success: true, order });
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message: err instanceof Error ? err.message : ResponseMessages.ERROR,
        });
    }
  };

  verifyPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderId,
      } = req.body as Record<string, string>;
      await this.paymentService.verifyAndRecord(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderId,
      );
      res.json({ success: true, message: "Payment verified" });
    } catch (err) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({
          success: false,
          message: err instanceof Error ? err.message : ResponseMessages.ERROR,
        });
    }
  };
}
