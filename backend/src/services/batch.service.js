import * as BatchModel from "../models/batch.model.js";
import { getExpirationStatus } from "../utils/expiration.utils.js";

// Obtener todos los lotes con filtro opcional
export const getAllBatches = async (status) => {
    const batches = await BatchModel.findAll();

    const batchesWithStatus = batches.map((batch) => ({
        ...batch,
        expirationStatus: getExpirationStatus(batch.expirationDate)
    }));

    // Excluir lotes sin existencias de las alertas
    const availableBatches = batchesWithStatus.filter(
        (batch) => batch.quantity > 0
    );

    if (!status) {
        return batchesWithStatus;
    }

    const validStatuses = ["VIGENTE", "POR VENCER", "VENCIDO"];

    if (!validStatuses.includes(status)) {
        throw new Error("El filtro de vencimiento no es válido");
    }

    return availableBatches.filter(
        (batch) => batch.expirationStatus === status
    );
};

// Obtener lotes de un producto
export const getBatchesByProductId = async (productId) => {
    const batches = await BatchModel.findByProductId(productId);

    return batches.map((batch) => ({
        ...batch,
        expirationStatus: getExpirationStatus(batch.expirationDate)
    }));
};