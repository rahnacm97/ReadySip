import type { Request, Response } from "express";
import type { ProductService } from "../services/ProductService";
import { HttpStatus, ResponseMessages } from "../constants/enums";
import { IProductController } from "../interfaces/controllers/IProductController";

export class ProductController implements IProductController {
  constructor(private readonly productService: ProductService) {}

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const options = {
        type: req.query["type"] as string | undefined,
        search: req.query["search"] as string | undefined,
        page: req.query["page"] ? Number(req.query["page"]) : undefined,
        limit: req.query["limit"] ? Number(req.query["limit"]) : undefined,
      };
      const result = await this.productService.getAll(options);
      res.json({
        success: true,
        products: result.products,
        total: result.total,
        page: options.page || 1,
        limit: options.limit || 9,
        totalPages: Math.ceil(result.total / (options.limit || 9)),
      });
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message: err instanceof Error ? err.message : ResponseMessages.ERROR,
        });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.productService.getById(
        req.params.id as string,
      );
      res.json({ success: true, product });
    } catch (err) {
      res
        .status(HttpStatus.NOT_FOUND)
        .json({
          success: false,
          message:
            err instanceof Error ? err.message : ResponseMessages.NOT_FOUND,
        });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("✨ Creating Product:", req.body);
      const product = await this.productService.create(
        req.body as Parameters<ProductService["create"]>[0],
      );
      res.status(HttpStatus.CREATED).json({ success: true, product });
    } catch (err) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({
          success: false,
          message: err instanceof Error ? err.message : ResponseMessages.ERROR,
        });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("🔄 Updating Product:", req.params.id, req.body);
      const product = await this.productService.update(
        req.params.id as string,
        req.body as object,
      );
      res.json({ success: true, product });
    } catch (err) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({
          success: false,
          message: err instanceof Error ? err.message : ResponseMessages.ERROR,
        });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.productService.delete(req.params.id as string);
      res.json({ success: true, message: "Product deleted" });
    } catch (err) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({
          success: false,
          message: err instanceof Error ? err.message : ResponseMessages.ERROR,
        });
    }
  };
}
