import * as BatchService from "../services/batch.service.js";

// Obtener todos los lotes con filtro opcional
export const getAll = async (req, res, next) => {
    try {
        const status = req.query.status?.trim().toUpperCase();

        const batches = await BatchService.getAllBatches(status);

        res.status(200).json({
            mensaje: "Lotes obtenidos correctamente",
            total: batches.length,
            lotes: batches
        });
    } catch (error) {
        next(error);
    }
};

// Obtener lotes de un producto
export const getByProductId = async (req, res, next) => {
    try {
        const productId = Number(req.params.productId);

        if (!Number.isInteger(productId) || productId <= 0) {
            throw new Error("El producto seleccionado no es válido");
        }

        const batches = await BatchService.getBatchesByProductId(productId);

        res.status(200).json({
            mensaje: "Lotes del producto obtenidos correctamente",
            lotes: batches
        });
    } catch (error) {
        next(error);
    }
};