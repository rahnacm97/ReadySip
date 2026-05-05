import mongoose, { Document, Schema } from "mongoose";
import { IOrderItem, IOrder } from "../interfaces/models/order";

const orderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new Schema<IOrder>(
  {
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String },
    items: { type: [orderItemSchema], required: true },
    timeOfArrival: { type: Date, required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "completed", "cancelled"],
      default: "pending",
    },
    paymentId: { type: String },
    razorpayOrderId: { type: String },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    rating: { type: Number, min: 1, max: 5 },
    feedback: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model<IOrder>("Order", orderSchema);
