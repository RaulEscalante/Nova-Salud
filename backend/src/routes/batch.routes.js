import { Router } from "express";
import * as BatchController from "../controllers/batch.controller.js";

const router = Router();

router.get("/", BatchController.getAll);
router.get("/product/:productId", BatchController.getByProductId);

export default router;