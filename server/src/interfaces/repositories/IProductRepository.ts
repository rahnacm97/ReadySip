import type { DrinkType } from "../../types/product";
import { IProduct } from "../models/product";

export interface IProductRepository {
  findAll(options: {
    type?: DrinkType;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ products: IProduct[]; total: number }>;
  findById(id: string): Promise<IProduct | null>;
  create(data: {
    title: string;
    description: string;
    price: number;
    type: DrinkType;
    imageUrl?: string;
    isAvailable?: boolean;
  }): Promise<IProduct>;
  update(id: string, data: Partial<IProduct>): Promise<IProduct | null>;
  delete(id: string): Promise<IProduct | null>;
}
