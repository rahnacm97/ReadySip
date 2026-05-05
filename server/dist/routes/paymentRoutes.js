"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../container");
const router = (0, express_1.Router)();
router.post("/create-order", (req, res) => container_1.paymentController.createOrder(req, res));
router.post("/verify", (req, res) => container_1.paymentController.verifyPayment(req, res));
exports.default = router;
//# sourceMappingURL=paymentRoutes.js.map