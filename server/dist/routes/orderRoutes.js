"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../container");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post("/", (req, res) => container_1.orderController.createOrder(req, res));
router.get("/my-orders", authMiddleware_1.protect, (req, res) => container_1.orderController.getMyOrders(req, res));
router.get("/", authMiddleware_1.protect, authMiddleware_1.adminOnly, (req, res) => container_1.orderController.getAllOrders(req, res));
router.get("/:id", authMiddleware_1.protect, authMiddleware_1.adminOnly, (req, res) => container_1.orderController.getOrderById(req, res));
router.patch("/:id/status", authMiddleware_1.protect, authMiddleware_1.adminOnly, (req, res) => container_1.orderController.updateStatus(req, res));
router.post("/:id/feedback", authMiddleware_1.protect, (req, res) => container_1.orderController.addFeedback(req, res));
exports.default = router;
//# sourceMappingURL=orderRoutes.js.map