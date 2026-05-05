import mongoose from "mongoose";
import { IReview } from "../interfaces/models/review";
declare const _default: mongoose.Model<IReview, {}, {}, {}, mongoose.Document<unknown, {}, IReview, {}, mongoose.DefaultSchemaOptions> & IReview & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IReview>;
export default _default;
