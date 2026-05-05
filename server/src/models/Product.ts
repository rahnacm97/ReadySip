import mongoose, { Schema } from "mongoose";
import { IProduct } from "../interfaces/models/product";

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    type: { type: String, enum: ["tea", "coffee", "juice"], required: true },
    imageUrl: { type: String, default: "" },
    isAvailable: { type: Boolean, default: true },
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model<IProduct>("Product", productSchema);
