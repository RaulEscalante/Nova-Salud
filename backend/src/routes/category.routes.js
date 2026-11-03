
import { Router } from "express";
import * as CategoryController from "../controllers/category.controller.js";

const router = Router();

router.get("/", CategoryController.getAll);
router.get("/:id", CategoryController.getById);
router.post("/", CategoryController.create);
router.put("/:id", CategoryController.update);
router.patch("/:id/status", CategoryController.changeStatus);

export default router;
