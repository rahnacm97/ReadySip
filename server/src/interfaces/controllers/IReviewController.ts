import { Request, Response } from "express";

export interface IReviewController {
  createReview(req: Request, res: Response): Promise<void>;
  getRecentReviews(req: Request, res: Response): Promise<void>;
  getTestimonials(req: Request, res: Response): Promise<void>;
  getMyReviews(req: Request, res: Response): Promise<void>;
}
