import express from "express";
import cors from "cors";
import prisma from "./config/prisma.js";

import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import batchRoutes from "./routes/batch.routes.js";
import saleRoutes from "./routes/sale.routes.js";
import alertRoutes from "./routes/alert.routes.js";

import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

// Ruta de prueba
app.get("/api/health", (req, res) => {
  res.status(200).json({
    mensaje: "API de Nova Salud funcionando correctamente"
  });
});

app.get("/api/health/database", async (req, res) => {
  try {
    await prisma.$connect();

    res.status(200).json({
      mensaje: "Conexión con MySQL establecida correctamente"
    });
  } catch (error) {
    console.error("Error de conexión:", error);

    res.status(500).json({
      mensaje: "No se pudo conectar con la base de datos"
    });
  }
});

// Rutas del sistema
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/alerts", alertRoutes);

app.use(errorMiddleware);

export default app;