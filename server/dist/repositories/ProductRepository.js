"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const Product_1 = __importDefault(require("../models/Product"));
class ProductRepository {
    async findAll(options) {
        const { type, search, page = 1, limit = 9 } = options;
        const filter = {};
        if (type)
            filter["type"] = type;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }
        const skip = (page - 1) * limit;
        const [products, total] = await Promise.all([
            Product_1.default.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Product_1.default.countDocuments(filter),
        ]);
        return { products, total };
    }
    async findById(id) {
        return Product_1.default.findById(id);
    }
    async create(data) {
        return Product_1.default.create(data);
    }
    async update(id, data) {
        return Product_1.default.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
    }
    async delete(id) {
        return Product_1.default.findByIdAndDelete(id);
    }
}
exports.ProductRepository = ProductRepository;
//# sourceMappingURL=ProductRepository.js.map