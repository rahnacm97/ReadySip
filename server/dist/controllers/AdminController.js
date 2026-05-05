"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = exports.AdminController = void 0;
const enums_1 = require("../constants/enums");
const Order_1 = __importDefault(require("../models/Order"));
const User_1 = __importDefault(require("../models/User"));
class AdminController {
    constructor() {
        this.getDashboardStats = async (req, res) => {
            try {
                const { timeframe, startDate, endDate } = req.query;
                let start = new Date(0);
                let end = new Date();
                if (startDate && endDate) {
                    start = new Date(startDate);
                    end = new Date(endDate);
                    end.setHours(23, 59, 59, 999);
                }
                else if (timeframe === "day") {
                    start = new Date();
                    start.setHours(0, 0, 0, 0);
                }
                else if (timeframe === "week") {
                    start = new Date();
                    start.setDate(start.getDate() - 7);
                }
                else if (timeframe === "month") {
                    start = new Date();
                    start.setMonth(start.getMonth() - 1);
                }
                else if (timeframe === "year") {
                    start = new Date();
                    start.setFullYear(start.getFullYear() - 1);
                }
                const matchQuery = {
                    createdAt: { $gte: start, $lte: end },
                };
                // 1. Summary Stats
                const summary = await Order_1.default.aggregate([
                    { $match: matchQuery },
                    {
                        $group: {
                            _id: null,
                            totalOrders: { $sum: 1 },
                            completedOrders: {
                                $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
                            },
                            revenue: {
                                $sum: {
                                    $cond: [
                                        {
                                            $or: [
                                                { $eq: ["$paymentStatus", "paid"] },
                                                { $eq: ["$status", "completed"] },
                                            ],
                                        },
                                        "$totalAmount",
                                        0,
                                    ],
                                },
                            },
                        },
                    },
                ]);
                const totalCustomers = await User_1.default.countDocuments({
                    role: "customer",
                    createdAt: { $gte: start, $lte: end },
                });
                // 2. Revenue Trend
                const revenueTrend = await Order_1.default.aggregate([
                    {
                        $match: {
                            ...matchQuery,
                            $or: [{ paymentStatus: "paid" }, { status: "completed" }],
                        },
                    },
                    {
                        $group: {
                            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                            revenue: { $sum: "$totalAmount" },
                        },
                    },
                    { $sort: { _id: 1 } },
                ]);
                // 3. Category Distribution (Pie Chart)
                const categoryStats = await Order_1.default.aggregate([
                    { $match: matchQuery },
                    { $unwind: "$items" },
                    {
                        $lookup: {
                            from: "products",
                            localField: "items.product",
                            foreignField: "_id",
                            as: "productInfo",
                        },
                    },
                    { $unwind: "$productInfo" },
                    {
                        $group: {
                            _id: "$productInfo.type",
                            value: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
                        },
                    },
                    { $project: { name: "$_id", value: 1, _id: 0 } },
                ]);
                // 4. Order Status Distribution (Bar/Pie Chart)
                const statusStats = await Order_1.default.aggregate([
                    { $match: matchQuery },
                    {
                        $group: {
                            _id: "$status",
                            count: { $sum: 1 },
                        },
                    },
                    { $project: { name: "$_id", count: 1, _id: 0 } },
                ]);
                // 5. Top Selling Products
                const topProducts = await Order_1.default.aggregate([
                    { $match: matchQuery },
                    { $unwind: "$items" },
                    {
                        $group: {
                            _id: "$items.product",
                            title: { $first: "$items.title" },
                            totalSold: { $sum: "$items.quantity" },
                            totalRevenue: {
                                $sum: { $multiply: ["$items.price", "$items.quantity"] },
                            },
                        },
                    },
                    { $sort: { totalSold: -1 } },
                    { $limit: 5 },
                ]);
                res.json({
                    success: true,
                    summary: summary[0] || {
                        totalOrders: 0,
                        completedOrders: 0,
                        revenue: 0,
                    },
                    totalCustomers,
                    trends: { revenue: revenueTrend },
                    categoryStats,
                    statusStats,
                    topProducts,
                });
            }
            catch (err) {
                console.error(err);
                res
                    .status(enums_1.HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ success: false, message: enums_1.ResponseMessages.SERVER_ERROR });
            }
        };
    }
}
exports.AdminController = AdminController;
exports.adminController = new AdminController();
//# sourceMappingURL=AdminController.js.map