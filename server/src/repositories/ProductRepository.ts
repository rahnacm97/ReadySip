import type { IProductRepository } from "../interfaces/repositories/IProductRepository";
import ProductModel from "../models/Product";
import type { DrinkType } from "../types/product";
import { IProduct } from "../interfaces/models/product";

export class ProductRepository implements IProductRepository {
  async findAll(options: {
    type?: DrinkType;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ products: IProduct[]; total: number }> {
    const { type, search, page = 1, limit = 9 } = options;
    const filter: Record<string, unknown> = {};

    if (type) filter["type"] = type;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      ProductModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ProductModel.countDocuments(filter),
    ]);

    return { products, total };
  }

  async findById(id: string): Promise<IProduct | null> {
    return ProductModel.findById(id);
  }

  async create(data: {
    title: string;
    description: string;
    price: number;
    type: DrinkType;
    imageUrl?: string;
    isAvailable?: boolean;
  }): Promise<IProduct> {
    return ProductModel.create(data);
  }

  async update(id: string, data: Partial<IProduct>): Promise<IProduct | null> {
    return ProductModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string): Promise<IProduct | null> {
    return ProductModel.findByIdAndDelete(id);
  }
}
