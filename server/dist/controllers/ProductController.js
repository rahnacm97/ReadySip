"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const enums_1 = require("../constants/enums");
class ProductController {
    constructor(productService) {
        this.productService = productService;
        this.getAll = async (req, res) => {
            try {
                const options = {
                    type: req.query["type"],
                    search: req.query["search"],
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
            }
            catch (err) {
                res
                    .status(enums_1.HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({
                    success: false,
                    message: err instanceof Error ? err.message : enums_1.ResponseMessages.ERROR,
                });
            }
        };
        this.getById = async (req, res) => {
            try {
                const product = await this.productService.getById(req.params.id);
                res.json({ success: true, product });
            }
            catch (err) {
                res
                    .status(enums_1.HttpStatus.NOT_FOUND)
                    .json({
                    success: false,
                    message: err instanceof Error ? err.message : enums_1.ResponseMessages.NOT_FOUND,
                });
            }
        };
        this.create = async (req, res) => {
            try {
                console.log("✨ Creating Product:", req.body);
                const product = await this.productService.create(req.body);
                res.status(enums_1.HttpStatus.CREATED).json({ success: true, product });
            }
            catch (err) {
                res
                    .status(enums_1.HttpStatus.BAD_REQUEST)
                    .json({
                    success: false,
                    message: err instanceof Error ? err.message : enums_1.ResponseMessages.ERROR,
                });
            }
        };
        this.update = async (req, res) => {
            try {
                console.log("🔄 Updating Product:", req.params.id, req.body);
                const product = await this.productService.update(req.params.id, req.body);
                res.json({ success: true, product });
            }
            catch (err) {
                res
                    .status(enums_1.HttpStatus.BAD_REQUEST)
                    .json({
                    success: false,
                    message: err instanceof Error ? err.message : enums_1.ResponseMessages.ERROR,
                });
            }
        };
        this.delete = async (req, res) => {
            try {
                await this.productService.delete(req.params.id);
                res.json({ success: true, message: "Product deleted" });
            }
            catch (err) {
                res
                    .status(enums_1.HttpStatus.BAD_REQUEST)
                    .json({
                    success: false,
                    message: err instanceof Error ? err.message : enums_1.ResponseMessages.ERROR,
                });
            }
        };
    }
}
exports.ProductController = ProductController;
//# sourceMappingURL=ProductController.js.map