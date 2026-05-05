"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env["SMTP_HOST"] ?? "smtp.gmail.com",
            port: parseInt(process.env["SMTP_PORT"] ?? "587"),
            secure: process.env["SMTP_SECURE"] === "true",
            auth: { user: process.env["SMTP_USER"], pass: process.env["SMTP_PASS"] },
        });
        this.from = `"ReadySip ☕" <${process.env["SMTP_USER"]}>`;
    }
    async sendOTP(email, otp) {
        try {
            if (!process.env["SMTP_PASS"]) {
                throw new Error("SMTP_PASS is missing");
            }
            await this.transporter.sendMail({
                from: this.from,
                to: email,
                subject: "Your ReadySip OTP Verification Code",
                html: `
          <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;background:#fafafa;border-radius:12px;border:1px solid #eee;">
            <h2 style="color:#c8601a;">ReadySip</h2>
            <p>Your verification code is:</p>
            <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#c8601a;text-align:center;padding:16px 0;">${otp}</div>
            <p style="color:#666;font-size:14px;">Expires in <strong>10 minutes</strong>. Do not share.</p>
          </div>`,
            });
            console.log(`✅ OTP Email sent to ${email}`);
        }
        catch (err) {
            console.log(err);
            console.warn("⚠️  Email Service Warning: SMTP is not configured properly.");
            console.log("-----------------------------------------");
            console.log(`🔑 DEVELOPMENT OTP FOR ${email}: ${otp}`);
            console.log("-----------------------------------------");
        }
    }
    async sendOrderConfirmationToAdmin(order) {
        try {
            if (!process.env["SMTP_PASS"])
                throw new Error("SMTP_PASS missing");
            const adminEmail = process.env["SMTP_USER"];
            const rows = order.items
                .map((i) => `<tr><td style="padding:4px 8px;">${i.title}</td><td style="padding:4px 8px;text-align:center;">${i.quantity}</td><td style="padding:4px 8px;text-align:right;">₹${(i.price * i.quantity).toFixed(2)}</td></tr>`)
                .join("");
            await this.transporter.sendMail({
                from: this.from,
                to: adminEmail,
                subject: `🆕 New Order from ${order.customerName}`,
                html: `<div style="font-family:Arial,sans-serif;padding:20px;"><h2>New Order!</h2><p>${order.customerName} is coming at ${order.timeOfArrival}</p><table>${rows}</table></div>`,
            });
        }
        catch {
            console.warn("⚠️  Could not send Admin email notification (SMTP not configured)");
        }
    }
    async sendOrderAcceptedToCustomer(email, name, timeOfArrival) {
        try {
            if (!process.env["SMTP_PASS"])
                throw new Error("SMTP_PASS missing");
            await this.transporter.sendMail({
                from: this.from,
                to: email,
                subject: "✅ Your ReadySip Order has been Accepted!",
                html: `<div style="font-family:Arial,sans-serif;padding:20px;"><h2>Order Accepted!</h2><p>Hi ${name}, see you at ${timeOfArrival}!</p></div>`,
            });
        }
        catch {
            console.warn("⚠️  Could not send Customer email notification (SMTP not configured)");
        }
    }
}
exports.EmailService = EmailService;
//# sourceMappingURL=EmailService.js.map