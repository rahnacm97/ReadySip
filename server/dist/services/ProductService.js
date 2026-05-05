"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
class ProductService {
    constructor(productRepo) {
        this.productRepo = productRepo;
    }
    async getAll(options) {
        const { type, search, page, limit } = options;
        const validTypes = ["tea", "coffee", "juice"];
        const drinkType = type && validTypes.includes(type) ? type : undefined;
        return this.productRepo.findAll({ type: drinkType, search, page, limit });
    }
    async getById(id) {
        const product = await this.productRepo.findById(id);
        if (!product)
            throw new Error("Product not found");
        return product;
    }
    async create(data) {
        if (!data.title || !data.description || !data.price || !data.type) {
            throw new Error("title, description, price, and type are required");
        }
        return this.productRepo.create({ ...data, type: data.type });
    }
    async update(id, data) {
        const product = await this.productRepo.update(id, data);
        if (!product)
            throw new Error("Product not found");
        return product;
    }
    async delete(id) {
        const product = await this.productRepo.delete(id);
        if (!product)
            throw new Error("Product not found");
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=ProductService.js.map