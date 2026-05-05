import type { Request, Response } from "express";
import type { PaymentService } from "../services/PaymentService";
import { IPaymentController } from "../interfaces/controllers/IPaymentController";
export declare class PaymentController implements IPaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    createOrder: (req: Request, res: Response) => Promise<void>;
    verifyPayment: (req: Request, res: Response) => Promise<void>;
}
