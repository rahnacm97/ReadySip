"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../container");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post("/signup", (req, res) => container_1.authController.signup(req, res));
router.post("/verify-otp", (req, res) => container_1.authController.verifyOtp(req, res));
router.post("/resend-otp", (req, res) => container_1.authController.resendOtp(req, res));
router.post("/login", (req, res) => container_1.authController.login(req, res));
router.post("/google-login", (req, res) => container_1.authController.googleLogin(req, res));
router.get("/me", authMiddleware_1.protect, (req, res) => container_1.authController.getMe(req, res));
exports.default = router;
//# sourceMappingURL=authRoutes.js.map