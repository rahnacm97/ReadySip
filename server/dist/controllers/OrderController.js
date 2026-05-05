"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const enums_1 = require("../constants/enums");
const User_1 = __importDefault(require("../models/User"));
class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
        this.createOrder = async (req, res) => {
            try {
                const body = req.body;
                if (!body.customerName ||
                    !body.customerPhone ||
                    !body.items?.length ||
                    !body.timeOfArrival ||
                    !body.totalAmount) {
                    res
                        .status(enums_1.HttpStatus.BAD_REQUEST)
                        .json({ success: false, message: enums_1.ResponseMessages.VALIDATION_ERROR });
                    return;
                }
                const order = await this.orderService.createOrder({
                    ...body,
                    timeOfArrival: new Date(body.timeOfArrival),
                });
                res.status(enums_1.HttpStatus.CREATED).json({ success: true, order });
            }
            catch (err) {
                res.status(enums_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: err instanceof Error ? err.message : enums_1.ResponseMessages.ERROR,
                });
            }
        };
        this.getMyOrders = async (req, res) => {
            try {
                // Cast req to AuthRequest to access the user object attached by authMiddleware
                const userId = req.user?.id;
                if (!userId) {
                    res
                        .status(enums_1.HttpStatus.UNAUTHORIZED)
                        .json({ success: false, message: enums_1.ResponseMessages.UNAUTHORIZED });
                    return;
                }
                // We need the User model to fetch email and phone
                // Since we don't have it injected, we've imported it at the top
                const user = await User_1.default.findById(userId);
                if (!user) {
                    res
                        .status(enums_1.HttpStatus.NOT_FOUND)
                        .json({ success: false, message: enums_1.ResponseMessages.USER_NOT_FOUND });
                    return;
                }
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 3;
                const { orders, totalPages, totalOrders } = await this.orderService.getOrdersByCustomerPaginated(page, limit, user.email, user.phone);
                res.json({ success: true, orders, totalPages, totalOrders, currentPage: page });
            }
            catch (err) {
                res.status(enums_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: err instanceof Error ? err.message : enums_1.ResponseMessages.ERROR,
                });
            }
        };
        this.getAllOrders = async (req, res) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const { orders, totalPages, totalOrders } = await this.orderService.getAllOrders(page, limit);
                res.json({
                    success: true,
                    orders,
                    totalPages,
                    totalOrders,
                    currentPage: page,
                });
            }
            catch (err) {
                res.status(enums_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: err instanceof Error ? err.message : enums_1.ResponseMessages.ERROR,
                });
            }
        };
        this.getOrderById = async (req, res) => {
            try {
                const order = await this.orderService.getOrderById(req.params.id);
                res.json({ success: true, order });
            }
            catch (err) {
                res.status(enums_1.HttpStatus.NOT_FOUND).json({
                    success: false,
                    message: err instanceof Error ? err.message : enums_1.ResponseMessages.NOT_FOUND,
                });
            }
        };
        this.updateStatus = async (req, res) => {
            try {
                const { status } = req.body;
                const order = await this.orderService.updateStatus(req.params.id, status);
                res.json({ success: true, order });
            }
            catch (err) {
                res.status(enums_1.HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: err instanceof Error ? err.message : enums_1.ResponseMessages.ERROR,
                });
            }
        };
        this.addFeedback = async (req, res) => {
            try {
                const { rating, feedback } = req.body;
                if (!rating || typeof rating !== "number") {
                    res
                        .status(enums_1.HttpStatus.BAD_REQUEST)
                        .json({ success: false, message: enums_1.ResponseMessages.VALIDATION_ERROR });
                    return;
                }
                const order = await this.orderService.addFeedback(req.params.id, rating, feedback ?? "");
                res.json({ success: true, order });
            }
            catch (err) {
                res.status(enums_1.HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: err instanceof Error ? err.message : enums_1.ResponseMessages.ERROR,
                });
            }
        };
    }
}
exports.OrderController = OrderController;
//# sourceMappingURL=OrderController.js.map