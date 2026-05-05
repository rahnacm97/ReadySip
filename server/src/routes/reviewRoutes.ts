import { Router } from "express";
import { reviewController } from "../controllers/ReviewController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

// Public route to fetch recent top reviews for the landing page
router.get("/recent", reviewController.getRecentReviews);
router.get("/testimonials", reviewController.getTestimonials);

// Protected route to submit a new review
router.post("/", protect, reviewController.createReview);
router.get("/my-reviews", protect, reviewController.getMyReviews);

export default router;
