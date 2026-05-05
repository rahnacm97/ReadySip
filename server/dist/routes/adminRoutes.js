"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AdminController_1 = require("../controllers/AdminController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get("/stats", authMiddleware_1.protect, authMiddleware_1.adminOnly, AdminController_1.adminController.getDashboardStats);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map