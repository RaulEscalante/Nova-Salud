import * as InventoryService from "../services/inventory.service.js";

// Obtener todos los inventarios
export const getAll = async (req, res, next) => {
    try {
        const inventories = await InventoryService.getAllInventories();

        res.status(200).json({
            mensaje: "Inventario obtenido correctamente",
            inventarios: inventories
        });
    } catch (error) {
        next(error);
    }
};

// Obtener inventario de un producto
export const getByProductId = async (req, res, next) => {
    try {
        const productId = Number(req.params.productId);

        if (!Number.isInteger(productId) || productId <= 0) {
            throw new Error("El producto seleccionado no es válido");
        }

        const inventory = await InventoryService.getInventoryByProductId(productId);

        res.status(200).json({
            mensaje: "Inventario obtenido correctamente",
            inventario: inventory
        });
    } catch (error) {
        next(error);
    }
};

// Obtener historial de movimientos
export const getMovements = async (req, res, next) => {
    try {
        const productId = Number(req.params.productId);

        if (!Number.isInteger(productId) || productId <= 0) {
            throw new Error("El producto seleccionado no es válido");
        }

        const movements = await InventoryService.getProductMovements(productId);

        res.status(200).json({
            mensaje: "Historial de movimientos obtenido correctamente",
            movimientos: movements
        });
    } catch (error) {
        next(error);
    }
};

// Registrar entrada de mercancía
export const createPurchase = async (req, res, next) => {
    try {
        const result = await InventoryService.createPurchase(req.body);

        res.status(201).json({
            mensaje: "Entrada de mercancía registrada correctamente",
            ...result
        });
    } catch (error) {
        next(error);
    }
};

// Registrar ajuste de inventario
export const createAdjustment = async (req, res, next) => {
    try {
        const result = await InventoryService.createAdjustment(req.body);

        res.status(200).json({
            mensaje: "Ajuste de inventario registrado correctamente",
            ...result
        });
    } catch (error) {
        next(error);
    }
};