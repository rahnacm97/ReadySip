import mongoose, { Schema } from "mongoose";
import { IReview } from "../interfaces/models/review";

const reviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxlength: 500 },
  },
  { timestamps: true },
);

export default mongoose.model<IReview>("Review", reviewSchema);
