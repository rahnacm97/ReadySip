"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ReviewController_1 = require("../controllers/ReviewController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public route to fetch recent top reviews for the landing page
router.get("/recent", ReviewController_1.reviewController.getRecentReviews);
router.get("/testimonials", ReviewController_1.reviewController.getTestimonials);
// Protected route to submit a new review
router.post("/", authMiddleware_1.protect, ReviewController_1.reviewController.createReview);
router.get("/my-reviews", authMiddleware_1.protect, ReviewController_1.reviewController.getMyReviews);
exports.default = router;
//# sourceMappingURL=reviewRoutes.js.map