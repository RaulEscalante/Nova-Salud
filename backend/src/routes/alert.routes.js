import { Router } from "express";
import * as AlertController from "../controllers/alert.controller.js";

const router = Router();

// Obtener todas las alertas
router.get("/", AlertController.getAllAlerts);

export default router;