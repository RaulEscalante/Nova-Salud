
import { Router } from "express";
import * as PurchaseController from "../controllers/purchase.controller.js";

const router = Router();

router.get("/", PurchaseController.getAll);
router.get("/:id", PurchaseController.getById);
router.post("/", PurchaseController.create);

export default router;
