import type { Request, Response } from "express";
import { HttpStatus, ResponseMessages } from "../constants/enums";
import { IReviewController } from "../interfaces/controllers/IReviewController";

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}
import Review from "../models/Review";
import Order from "../models/Order";
import User from "../models/User";
import Product from "../models/Product";

export class ReviewController implements IReviewController {
  createReview = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as AuthRequest).user?.id;
      if (!userId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ success: false, message: ResponseMessages.UNAUTHORIZED });
        return;
      }

      const { productId, rating, comment } = req.body;

      if (!productId || !rating || !comment) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: ResponseMessages.VALIDATION_ERROR });
        return;
      }

      // 1. Fetch user to get their name
      const user = await User.findById(userId);
      if (!user) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ success: false, message: ResponseMessages.USER_NOT_FOUND });
        return;
      }

      // 2. (Optional but good practice) Verify if user has ordered this product
      const hasOrdered = await Order.exists({
        $or: [{ customerEmail: user.email }, { customerPhone: user.phone }],
        status: "completed",
        "items.product": productId,
      });

      if (!hasOrdered) {
        res
          .status(HttpStatus.FORBIDDEN)
          .json({
            success: false,
            message:
              "You can only review products you have purchased and received.",
          });
        return;
      }

      // 3. Check if they already reviewed it
      const existingReview = await Review.findOne({
        user: userId,
        product: productId,
      });
      if (existingReview) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({
            success: false,
            message: "You have already reviewed this product",
          });
        return;
      }

      // 4. Create review
      const review = await Review.create({
        user: userId,
        userName: user.name,
        product: productId,
        rating,
        comment,
      });

      // 5. Update product aggregate rating
      const reviews = await Review.find({ product: productId });
      const numReviews = reviews.length;
      const averageRating =
        reviews.reduce((acc, r) => acc + r.rating, 0) / numReviews;

      await Product.findByIdAndUpdate(productId, { averageRating, numReviews });

      res.status(HttpStatus.CREATED).json({ success: true, review });
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message: err instanceof Error ? err.message : ResponseMessages.ERROR,
        });
    }
  };

  getRecentReviews = async (req: Request, res: Response): Promise<void> => {
    try {
      // Fetch the 6 most recent reviews with a rating of 4 or 5
      const reviews = await Review.find({ rating: { $gte: 4 } })
        .sort({ createdAt: -1 })
        .limit(6)
        .populate("product", "title imageUrl"); // Populate product details

      res.json({ success: true, reviews });
    } catch (err) {
      res
        .status(500)
        .json({
          success: false,
          message:
            err instanceof Error ? err.message : "Failed to fetch reviews",
        });
    }
  };

  getTestimonials = async (req: Request, res: Response): Promise<void> => {
    try {
      // Fetch the 6 most recent orders with a rating of 4 or 5
      const testimonials = await Order.find({ rating: { $gte: 4 } })
        .sort({ updatedAt: -1 })
        .limit(6)
        .select("customerName rating feedback updatedAt");

      res.json({ success: true, testimonials });
    } catch (err) {
      res
        .status(500)
        .json({
          success: false,
          message:
            err instanceof Error ? err.message : "Failed to fetch testimonials",
        });
    }
  };

  getMyReviews = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as AuthRequest).user?.id;
      const reviews = await Review.find({ user: userId });
      res.json({ success: true, reviews });
    } catch (err) {
      res
        .status(500)
        .json({
          success: false,
          message:
            err instanceof Error ? err.message : "Failed to fetch reviews",
        });
    }
  };
}

export const reviewController = new ReviewController();
