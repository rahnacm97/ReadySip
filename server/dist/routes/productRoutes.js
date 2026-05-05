"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../container");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get("/", (req, res) => container_1.productController.getAll(req, res));
router.get("/:id", (req, res) => container_1.productController.getById(req, res));
router.post("/", authMiddleware_1.protect, authMiddleware_1.adminOnly, (req, res) => container_1.productController.create(req, res));
router.put("/:id", authMiddleware_1.protect, authMiddleware_1.adminOnly, (req, res) => container_1.productController.update(req, res));
router.delete("/:id", authMiddleware_1.protect, authMiddleware_1.adminOnly, (req, res) => container_1.productController.delete(req, res));
exports.default = router;
//# sourceMappingURL=productRoutes.js.map