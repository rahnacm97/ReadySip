import { Router } from "express";
import { orderController } from "../container";
import { protect, adminOnly } from "../middleware/authMiddleware";

const router = Router();

router.post("/", (req, res) => orderController.createOrder(req, res));
router.get("/my-orders", protect, (req, res) =>
  orderController.getMyOrders(req, res),
);
router.get("/", protect, adminOnly, (req, res) =>
  orderController.getAllOrders(req, res),
);
router.get("/:id", protect, adminOnly, (req, res) =>
  orderController.getOrderById(req, res),
);
router.patch("/:id/status", protect, adminOnly, (req, res) =>
  orderController.updateStatus(req, res),
);
router.post("/:id/feedback", protect, (req, res) =>
  orderController.addFeedback(req, res),
);

export default router;
