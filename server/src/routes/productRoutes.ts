import { Router } from "express";
import { productController } from "../container";
import { protect, adminOnly } from "../middleware/authMiddleware";

const router = Router();

router.get("/", (req, res) => productController.getAll(req, res));
router.get("/:id", (req, res) => productController.getById(req, res));
router.post("/", protect, adminOnly, (req, res) =>
  productController.create(req, res),
);
router.put("/:id", protect, adminOnly, (req, res) =>
  productController.update(req, res),
);
router.delete("/:id", protect, adminOnly, (req, res) =>
  productController.delete(req, res),
);

export default router;
