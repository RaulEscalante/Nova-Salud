import { Router } from "express";
import * as InventoryController from "../controllers/inventory.controller.js";

const router = Router();

router.get("/", InventoryController.getAll);
router.get("/product/:productId/movements", InventoryController.getMovements);
router.get("/product/:productId", InventoryController.getByProductId);
router.post("/purchases", InventoryController.createPurchase);
router.post("/adjustments", InventoryController.createAdjustment);

export default router;