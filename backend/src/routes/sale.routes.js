import { Router } from "express";
import * as SaleController from "../controllers/sale.controller.js";

const router = Router();

router.get("/", SaleController.getAll);
router.get("/:id", SaleController.getById);
router.post("/", SaleController.create);

export default router;