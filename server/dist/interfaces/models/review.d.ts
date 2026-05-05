import mongoose, { Document } from "mongoose";
export interface IReview extends Document {
    user: mongoose.Types.ObjectId;
    userName: string;
    product: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
}
