"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const enums_1 = require("../constants/enums");
class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
        this.createOrder = async (req, res) => {
            try {
                const { amount, currency, receipt } = req.body;
                if (!amount) {
                    res
                        .status(enums_1.HttpStatus.BAD_REQUEST)
                        .json({ success: false, message: enums_1.ResponseMessages.VALIDATION_ERROR });
                    return;
                }
                const order = await this.paymentService.createRazorpayOrder(amount, currency, receipt);
                res.json({ success: true, order });
            }
            catch (err) {
                res
                    .status(enums_1.HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({
                    success: false,
                    message: err instanceof Error ? err.message : enums_1.ResponseMessages.ERROR,
                });
            }
        };
        this.verifyPayment = async (req, res) => {
            try {
                const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId, } = req.body;
                await this.paymentService.verifyAndRecord(razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId);
                res.json({ success: true, message: "Payment verified" });
            }
            catch (err) {
                res
                    .status(enums_1.HttpStatus.BAD_REQUEST)
                    .json({
                    success: false,
                    message: err instanceof Error ? err.message : enums_1.ResponseMessages.ERROR,
                });
            }
        };
    }
}
exports.PaymentController = PaymentController;
//# sourceMappingURL=PaymentController.js.map