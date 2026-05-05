import api from "../api/axios";

interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
}

export const paymentService = {
  async createOrder(
    amount: number,
    receipt: string,
  ): Promise<RazorpayOrderResponse> {
    const res = await api.post<{ order: RazorpayOrderResponse }>(
      "/payments/create-order",
      {
        amount,
        receipt,
      },
    );
    return res.data.order;
  },

  async verify(
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string,
    orderId: string,
  ): Promise<void> {
    await api.post("/payments/verify", {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    });
  },
};
