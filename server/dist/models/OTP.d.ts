import mongoose from "mongoose";
import { IOTP } from "../interfaces/models/otp";
declare const _default: mongoose.Model<IOTP, {}, {}, {}, mongoose.Document<unknown, {}, IOTP, {}, mongoose.DefaultSchemaOptions> & IOTP & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IOTP>;
export default _default;
