import { Document } from "mongoose";
import type { DrinkType } from "../../types/product";

export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  type: DrinkType;
  imageUrl: string;
  isAvailable: boolean;
  averageRating: number;
  numReviews: number;
}
