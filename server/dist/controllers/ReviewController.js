"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewController = exports.ReviewController = void 0;
const enums_1 = require("../constants/enums");
const Review_1 = __importDefault(require("../models/Review"));
const Order_1 = __importDefault(require("../models/Order"));
const User_1 = __importDefault(require("../models/User"));
const Product_1 = __importDefault(require("../models/Product"));
class ReviewController {
    constructor() {
        this.createReview = async (req, res) => {
            try {
                const userId = req.user?.id;
                if (!userId) {
                    res
                        .status(enums_1.HttpStatus.UNAUTHORIZED)
                        .json({ success: false, message: enums_1.ResponseMessages.UNAUTHORIZED });
                    return;
                }
                const { productId, rating, comment } = req.body;
                if (!productId || !rating || !comment) {
                    res
                        .status(enums_1.HttpStatus.BAD_REQUEST)
                        .json({ success: false, message: enums_1.ResponseMessages.VALIDATION_ERROR });
                    return;
                }
                // 1. Fetch user to get their name
                const user = await User_1.default.findById(userId);
                if (!user) {
                    res
                        .status(enums_1.HttpStatus.NOT_FOUND)
                        .json({ success: false, message: enums_1.ResponseMessages.USER_NOT_FOUND });
                    return;
                }
                // 2. (Optional but good practice) Verify if user has ordered this product
                const hasOrdered = await Order_1.default.exists({
                    $or: [{ customerEmail: user.email }, { customerPhone: user.phone }],
                    status: "completed",
                    "items.product": productId,
                });
                if (!hasOrdered) {
                    res
                        .status(enums_1.HttpStatus.FORBIDDEN)
                        .json({
                        success: false,
                        message: "You can only review products you have purchased and received.",
                    });
                    return;
                }
                // 3. Check if they already reviewed it
                const existingReview = await Review_1.default.findOne({
                    user: userId,
                    product: productId,
                });
                if (existingReview) {
                    res
                        .status(enums_1.HttpStatus.BAD_REQUEST)
                        .json({
                        success: false,
                        message: "You have already reviewed this product",
                    });
                    return;
                }
                // 4. Create review
                const review = await Review_1.default.create({
                    user: userId,
                    userName: user.name,
                    product: productId,
                    rating,
                    comment,
                });
                // 5. Update product aggregate rating
                const reviews = await Review_1.default.find({ product: productId });
                const numReviews = reviews.length;
                const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / numReviews;
                await Product_1.default.findByIdAndUpdate(productId, { averageRating, numReviews });
                res.status(enums_1.HttpStatus.CREATED).json({ success: true, review });
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
        this.getRecentReviews = async (req, res) => {
            try {
                // Fetch the 6 most recent reviews with a rating of 4 or 5
                const reviews = await Review_1.default.find({ rating: { $gte: 4 } })
                    .sort({ createdAt: -1 })
                    .limit(6)
                    .populate("product", "title imageUrl"); // Populate product details
                res.json({ success: true, reviews });
            }
            catch (err) {
                res
                    .status(500)
                    .json({
                    success: false,
                    message: err instanceof Error ? err.message : "Failed to fetch reviews",
                });
            }
        };
        this.getTestimonials = async (req, res) => {
            try {
                // Fetch the 6 most recent orders with a rating of 4 or 5
                const testimonials = await Order_1.default.find({ rating: { $gte: 4 } })
                    .sort({ updatedAt: -1 })
                    .limit(6)
                    .select("customerName rating feedback updatedAt");
                res.json({ success: true, testimonials });
            }
            catch (err) {
                res
                    .status(500)
                    .json({
                    success: false,
                    message: err instanceof Error ? err.message : "Failed to fetch testimonials",
                });
            }
        };
        this.getMyReviews = async (req, res) => {
            try {
                const userId = req.user?.id;
                const reviews = await Review_1.default.find({ user: userId });
                res.json({ success: true, reviews });
            }
            catch (err) {
                res
                    .status(500)
                    .json({
                    success: false,
                    message: err instanceof Error ? err.message : "Failed to fetch reviews",
                });
            }
        };
    }
}
exports.ReviewController = ReviewController;
exports.reviewController = new ReviewController();
//# sourceMappingURL=ReviewController.js.map