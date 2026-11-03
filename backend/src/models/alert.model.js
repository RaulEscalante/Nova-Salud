import * as InventoryModel from "./inventory.model.js";
import * as BatchModel from "./batch.model.js";

// Obtener datos necesarios para generar las alertas
export const findAlertData = async () => {
    const [inventories, batches] = await Promise.all([
        InventoryModel.findAll(),
        BatchModel.findAll()
    ]);

    return {
        inventories,
        batches
    };
};