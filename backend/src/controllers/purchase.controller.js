
import * as PurchaseService from "../services/purchase.service.js";

// Obtener todas las compras
export const getAll = async (req, res, next) => {
    try {
        const purchases = await PurchaseService.getAllPurchases();

        res.status(200).json({
            mensaje: "Compras obtenidas correctamente",
            compras: purchases
        });
    } catch (error) {
        next(error);
    }
};

// Obtener una compra por ID
export const getById = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        const purchase = await PurchaseService.getPurchaseById(id);

        res.status(200).json({
            mensaje: "Compra obtenida correctamente",
            compra: purchase
        });
    } catch (error) {
        next(error);
    }
};

// Registrar una compra
export const create = async (req, res, next) => {
    try {
        const purchase = await PurchaseService.createPurchase(req.body);

        res.status(201).json({
            mensaje: "Compra registrada correctamente",
            compra: purchase
        });
    } catch (error) {
        next(error);
    }
};
