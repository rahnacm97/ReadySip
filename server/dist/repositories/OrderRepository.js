"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
const Order_1 = __importDefault(require("../models/Order"));
class OrderRepository {
    async findAll() {
        return Order_1.default.find().sort({ createdAt: -1 });
    }
    async findAllPaginated(page, limit) {
        const totalOrders = await Order_1.default.countDocuments();
        const totalPages = Math.ceil(totalOrders / limit);
        const orders = await Order_1.default.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        return { orders, totalPages, totalOrders };
    }
    async findById(id) {
        return Order_1.default.findById(id);
    }
    async findByCustomer(email, phone) {
        return Order_1.default.find({
            $or: [{ customerEmail: email }, { customerPhone: phone }],
        }).sort({ createdAt: -1 });
    }
    async findByCustomerPaginated(page, limit, email, phone) {
        const filter = {
            $or: [{ customerEmail: email }, { customerPhone: phone }],
        };
        const totalOrders = await Order_1.default.countDocuments(filter);
        const totalPages = Math.ceil(totalOrders / limit);
        const orders = await Order_1.default.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        return { orders, totalPages, totalOrders };
    }
    async create(data) {
        return Order_1.default.create(data);
    }
    async updateStatus(id, status) {
        const update = { status };
        if (status === "completed") {
            update.paymentStatus = "paid";
        }
        return Order_1.default.findByIdAndUpdate(id, update, { new: true });
    }
    async updatePayment(id, paymentId) {
        return Order_1.default.findByIdAndUpdate(id, { paymentId, paymentStatus: "paid" }, { new: true });
    }
    async addFeedback(id, rating, feedback) {
        return Order_1.default.findByIdAndUpdate(id, { rating, feedback }, { new: true });
    }
}
exports.OrderRepository = OrderRepository;
//# sourceMappingURL=OrderRepository.js.map