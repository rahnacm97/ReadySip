import type { IProductRepository } from "../interfaces/repositories/IProductRepository";
import { IProduct } from "../interfaces/models/product";
import { IProductService } from "../interfaces/services/IProductService";
export declare class ProductService implements IProductService {
    private readonly productRepo;
    constructor(productRepo: IProductRepository);
    getAll(options: {
        type?: string;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        products: IProduct[];
        total: number;
    }>;
    getById(id: string): Promise<IProduct>;
    create(data: {
        title: string;
        description: string;
        price: number;
        type: string;
        imageUrl?: string;
        isAvailable?: boolean;
    }): Promise<IProduct>;
    update(id: string, data: Partial<IProduct>): Promise<IProduct>;
    delete(id: string): Promise<void>;
}
