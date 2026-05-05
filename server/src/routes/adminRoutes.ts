import { Router } from "express";
import { adminController } from "../controllers/AdminController";
import { protect, adminOnly } from "../middleware/authMiddleware";

const router = Router();

router.get("/stats", protect, adminOnly, adminController.getDashboardStats);

export default router;
