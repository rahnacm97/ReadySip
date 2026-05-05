"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
class PaymentService {
    constructor(orderRepo) {
        this.orderRepo = orderRepo;
    }
    getRazorpay() {
        const keyId = process.env["RAZORPAY_KEY_ID"] ?? "";
        const keySecret = process.env["RAZORPAY_KEY_SECRET"] ?? "";
        if (!keyId || !keySecret)
            throw new Error("Razorpay keys not configured in .env");
        return new razorpay_1.default({ key_id: keyId, key_secret: keySecret });
    }
    async createRazorpayOrder(amount, currency = "INR", receipt) {
        const razorpay = this.getRazorpay();
        return razorpay.orders.create({
            amount: Math.round(amount * 100),
            currency,
            receipt,
        });
    }
    async verifyAndRecord(razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId) {
        const keySecret = process.env["RAZORPAY_KEY_SECRET"] ?? "";
        const body = `${razorpayOrderId}|${razorpayPaymentId}`;
        const expected = crypto_1.default
            .createHmac("sha256", keySecret)
            .update(body)
            .digest("hex");
        if (expected !== razorpaySignature)
            throw new Error("Invalid payment signature");
        await this.orderRepo.updatePayment(orderId, razorpayPaymentId);
    }
}
exports.PaymentService = PaymentService;
//# sourceMappingURL=PaymentService.js.map