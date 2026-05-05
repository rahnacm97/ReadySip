import { Router } from "express";
import { paymentController } from "../container";

const router = Router();

router.post("/create-order", (req, res) =>
  paymentController.createOrder(req, res),
);
router.post("/verify", (req, res) => paymentController.verifyPayment(req, res));

export default router;
