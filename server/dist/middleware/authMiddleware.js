"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = exports.protect = void 0;
const generateToken_1 = require("../utils/generateToken");
const protect = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;
    if (!token) {
        res
            .status(401)
            .json({ success: false, message: "Not authorized, no token" });
        return;
    }
    try {
        const decoded = (0, generateToken_1.verifyToken)(token);
        req.user = { id: decoded["id"], role: decoded["role"] };
        next();
    }
    catch {
        res
            .status(401)
            .json({ success: false, message: "Not authorized, invalid token" });
    }
};
exports.protect = protect;
const adminOnly = (req, res, next) => {
    if (req.user?.role !== "admin") {
        res
            .status(403)
            .json({ success: false, message: "Access denied. Admins only." });
        return;
    }
    next();
};
exports.adminOnly = adminOnly;
//# sourceMappingURL=authMiddleware.js.map