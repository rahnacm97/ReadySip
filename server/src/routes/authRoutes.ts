import { Router } from "express";
import { authController } from "../container";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/signup", (req, res) => authController.signup(req, res));
router.post("/verify-otp", (req, res) => authController.verifyOtp(req, res));
router.post("/resend-otp", (req, res) => authController.resendOtp(req, res));
router.post("/login", (req, res) => authController.login(req, res));
router.post("/google-login", (req, res) =>
  authController.googleLogin(req, res),
);
router.get("/me", protect, (req, res) => authController.getMe(req, res));

export default router;
