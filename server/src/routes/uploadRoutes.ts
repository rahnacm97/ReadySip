import { Router } from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary";
import { v4 as uuidv4 } from "uuid";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
  console.log("📤 Upload request received");
  console.log("☁️ Cloudinary Config:", {
    cloud_name: cloudinary.config().cloud_name,
    api_key: cloudinary.config().api_key ? "***" : "MISSING",
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

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "readysip/products",
      public_id: `product_${uuidv4()}`,
    });

    res.status(200).json({
      success: true,
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

export default router;
