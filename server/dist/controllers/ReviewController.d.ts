import type { Request, Response } from "express";
import { IReviewController } from "../interfaces/controllers/IReviewController";
export declare class ReviewController implements IReviewController {
    createReview: (req: Request, res: Response) => Promise<void>;
    getRecentReviews: (req: Request, res: Response) => Promise<void>;
    getTestimonials: (req: Request, res: Response) => Promise<void>;
    getMyReviews: (req: Request, res: Response) => Promise<void>;
}
export declare const reviewController: ReviewController;
