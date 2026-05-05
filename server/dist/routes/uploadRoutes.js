"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const uuid_1 = require("uuid");
const router = (0, express_1.Router)();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
router.post("/", upload.single("image"), async (req, res) => {
    console.log("📤 Upload request received");
    console.log("☁️ Cloudinary Config:", {
        cloud_name: cloudinary_1.default.config().cloud_name,
        api_key: cloudinary_1.default.config().api_key ? "***" : "MISSING",
    });
    try {
        if (!req.file) {
            return res
                .status(400)
                .json({ success: false, message: "No file uploaded" });
        }
        // Convert buffer to base64 for Cloudinary
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        const result = await cloudinary_1.default.uploader.upload(dataURI, {
            folder: "readysip/products",
            public_id: `product_${(0, uuid_1.v4)()}`,
        });
        res.status(200).json({
            success: true,
            imageUrl: result.secure_url,
        });
    }
    catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ success: false, message: "Upload failed" });
    }
});
exports.default = router;
//# sourceMappingURL=uploadRoutes.js.map