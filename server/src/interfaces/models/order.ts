import mongoose, { Document } from "mongoose";
import type { OrderStatus, PaymentStatus } from "../../types/order";

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  title: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: IOrderItem[];
  timeOfArrival: Date;
  totalAmount: number;
  status: OrderStatus;
  paymentId?: string;
  razorpayOrderId?: string;
  paymentStatus: PaymentStatus;
  rating?: number;
  feedback?: string;
}
