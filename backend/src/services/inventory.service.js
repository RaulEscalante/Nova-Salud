
import * as InventoryModel from "../models/inventory.model.js";
import { getStockStatus } from "../utils/stock.utils.js";

// Listar inventarios
export const getAllInventories = async () => {
    const inventories = await InventoryModel.findAll();

    return inventories.map((inventory) => ({
        ...inventory,
        stockStatus: getStockStatus(
            inventory.quantity,
            inventory.product.minStock,
            inventory.product.maxStock
        )
    }));
};

// Consultar inventario de un producto
export const getInventoryByProductId = async (productId) => {
    const inventory = await InventoryModel.findByProductId(productId);

    if (!inventory) {
        throw new Error("Inventario no encontrado");
    }

    return {
        ...inventory,
        stockStatus: getStockStatus(
            inventory.quantity,
            inventory.product.minStock,
            inventory.product.maxStock
        )
    };
};

// Consultar movimientos de un producto
export const getProductMovements = async (productId) => {
    await getInventoryByProductId(productId);

    return await InventoryModel.findMovementsByProductId(productId);
};



 // Registrar entrada de mercancía
export const createPurchase = async (data) => {
    const productId = Number(data.productId);
    const quantity = Number(data.quantity);
    const batchCode = data.batchCode?.trim();
    const expirationDate = data.expirationDate;
    const reason = data.reason?.trim() || "Entrada de mercancía";

    if (!Number.isInteger(productId) || productId <= 0) {
        throw new Error("El producto seleccionado no es válido");
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error("La cantidad debe ser un entero mayor que cero");
    }

    if (!batchCode) {
        throw new Error("El código del lote es obligatorio");
    }

    if (!expirationDate || !/^\d{4}-\d{2}-\d{2}$/.test(expirationDate)) {
        throw new Error("La fecha de vencimiento no es válida");
    }

    const expiration = new Date(`${expirationDate}T00:00:00.000Z`);

    if (
        Number.isNaN(expiration.getTime()) ||
        expiration.toISOString().slice(0, 10) !== expirationDate
    ) {
        throw new Error("La fecha de vencimiento no es válida");
    }

    if (expiration <= new Date(new Date().toISOString().slice(0, 10) + "T00:00:00.000Z")) {
        throw new Error("No se pueden registrar lotes vencidos");
    }

    const product = await InventoryModel.findProductById(productId);

    if (!product || !product.active) {
        throw new Error("El producto no existe o está desactivado");
    }

    return await InventoryModel.registerPurchase({
        productId,
        quantity,
        batchCode,
        expirationDate,
        reason
    });
};

// Registrar ajuste de inventario
export const createAdjustment = async (data) => {
    const productId = Number(data.productId);
    const batchId = Number(data.batchId);
    const newQuantity = Number(data.newQuantity);
    const reason = data.reason?.trim();

    if (!Number.isInteger(productId) || productId <= 0) {
        throw new Error("El producto seleccionado no es válido");
    }

    if (!Number.isInteger(batchId) || batchId <= 0) {
        throw new Error("El lote seleccionado no es válido");
    }

    if (!Number.isInteger(newQuantity) || newQuantity < 0) {
        throw new Error("La nueva cantidad debe ser un entero no negativo");
    }

    if (!reason) {
        throw new Error("El motivo del ajuste es obligatorio");
    }

    const product = await InventoryModel.findProductById(productId);

    if (!product) {
        throw new Error("Producto no encontrado");
    }

    return await InventoryModel.registerAdjustment({
        productId,
        batchId,
        newQuantity,
        reason
    });
};