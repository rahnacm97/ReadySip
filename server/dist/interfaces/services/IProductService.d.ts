import { IProduct } from "../models/product";
export interface IProductService {
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
