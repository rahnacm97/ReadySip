import type { IProductRepository } from "../interfaces/repositories/IProductRepository";
import type { DrinkType } from "../types/product";
import { IProduct } from "../interfaces/models/product";
import { IProductService } from "../interfaces/services/IProductService";

export class ProductService implements IProductService {
  constructor(private readonly productRepo: IProductRepository) {}

  async getAll(options: {
    type?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ products: IProduct[]; total: number }> {
    const { type, search, page, limit } = options;
    const validTypes = ["tea", "coffee", "juice"];
    const drinkType =
      type && validTypes.includes(type) ? (type as DrinkType) : undefined;

    return this.productRepo.findAll({ type: drinkType, search, page, limit });
  }

  async getById(id: string): Promise<IProduct> {
    const product = await this.productRepo.findById(id);
    if (!product) throw new Error("Product not found");
    return product;
  }

  async create(data: {
    title: string;
    description: string;
    price: number;
    type: string;
    imageUrl?: string;
    isAvailable?: boolean;
  }): Promise<IProduct> {
    if (!data.title || !data.description || !data.price || !data.type) {
      throw new Error("title, description, price, and type are required");
    }
    return this.productRepo.create({ ...data, type: data.type as DrinkType });
  }

  async update(id: string, data: Partial<IProduct>): Promise<IProduct> {
    const product = await this.productRepo.update(id, data);
    if (!product) throw new Error("Product not found");
    return product;
  }

  async delete(id: string): Promise<void> {
    const product = await this.productRepo.delete(id);
    if (!product) throw new Error("Product not found");
  }
}
