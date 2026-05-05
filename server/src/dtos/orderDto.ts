export interface CreateOrderDTO {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: { product: string; title: string; price: number; quantity: number }[];
  timeOfArrival: Date;
  totalAmount: number;
  razorpayOrderId?: string;
}
