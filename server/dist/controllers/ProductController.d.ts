import type { Request, Response } from "express";
import type { ProductService } from "../services/ProductService";
import { IProductController } from "../interfaces/controllers/IProductController";
export declare class ProductController implements IProductController {
    private readonly productService;
    constructor(productService: ProductService);
    getAll: (req: Request, res: Response) => Promise<void>;
    getById: (req: Request, res: Response) => Promise<void>;
    create: (req: Request, res: Response) => Promise<void>;
    update: (req: Request, res: Response) => Promise<void>;
    delete: (req: Request, res: Response) => Promise<void>;
}
