"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMSService = void 0;
const twilio_1 = __importDefault(require("twilio"));
class SMSService {
    getClient() {
        const sid = process.env["TWILIO_ACCOUNT_SID"];
        const token = process.env["TWILIO_AUTH_TOKEN"];
        if (!sid || !token) {
            console.warn("⚠️ Twilio not configured — SMS skipped");
            return null;
        }
        return (0, twilio_1.default)(sid, token);
    }
    async sendNewOrderAlert(adminPhone, customerName, orderId) {
        const client = this.getClient();
        const from = process.env["TWILIO_PHONE_NUMBER"];
        if (!client || !from || !adminPhone || adminPhone.includes("X"))
            return;
        try {
            await client.messages.create({
                body: `📦 New ReadySip Order!\nCustomer: ${customerName}\nOrder: ${orderId}\nLogin to accept.`,
                from,
                to: adminPhone,
            });
        }
        catch (e) {
            console.error("Admin SMS failed:", e);
        }
    }
    async sendOrderAccepted(customerPhone, customerName, timeOfArrival) {
        const client = this.getClient();
        const from = process.env["TWILIO_PHONE_NUMBER"];
        if (!client || !from)
            return;
        try {
            await client.messages.create({
                body: `✅ Hi ${customerName}, your ReadySip order is accepted! Arrive by ${timeOfArrival}. ☕`,
                from,
                to: customerPhone,
            });
        }
        catch (e) {
            console.error("Customer SMS failed:", e);
        }
    }
}
exports.SMSService = SMSService;
//# sourceMappingURL=SMSService.js.map