import twilio from "twilio";
import type { ISMSService } from "../interfaces/services/INotificationService";

export class SMSService implements ISMSService {
  private getClient() {
    const sid = process.env["TWILIO_ACCOUNT_SID"];
    const token = process.env["TWILIO_AUTH_TOKEN"];
    if (!sid || !token) {
      console.warn("⚠️ Twilio not configured — SMS skipped");
      return null;
    }
    return twilio(sid, token);
  }

  async sendNewOrderAlert(
    adminPhone: string,
    customerName: string,
    orderId: string,
  ): Promise<void> {
    const client = this.getClient();
    const from = process.env["TWILIO_PHONE_NUMBER"];
    if (!client || !from || !adminPhone || adminPhone.includes("X")) return;
    try {
      await client.messages.create({
        body: `📦 New ReadySip Order!\nCustomer: ${customerName}\nOrder: ${orderId}\nLogin to accept.`,
        from,
        to: adminPhone,
      });
    } catch (e) {
      console.error("Admin SMS failed:", e);
    }
  }

  async sendOrderAccepted(
    customerPhone: string,
    customerName: string,
    timeOfArrival: string,
  ): Promise<void> {
    const client = this.getClient();
    const from = process.env["TWILIO_PHONE_NUMBER"];
    if (!client || !from) return;
    try {
      await client.messages.create({
        body: `✅ Hi ${customerName}, your ReadySip order is accepted! Arrive by ${timeOfArrival}. ☕`,
        from,
        to: customerPhone,
      });
    } catch (e) {
      console.error("Customer SMS failed:", e);
    }
  }
}
