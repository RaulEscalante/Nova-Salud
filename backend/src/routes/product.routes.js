
import { Router } from "express";
import * as ProductController from "../controllers/product.controller.js";

const router = Router();

router.get("/", ProductController.getAll);
router.get("/:id", ProductController.getById);
router.post("/", ProductController.create);
router.put("/:id", ProductController.update);
router.patch("/:id/status", ProductController.changeStatus);

export default router;
