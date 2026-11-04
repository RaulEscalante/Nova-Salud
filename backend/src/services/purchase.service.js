
import * as PurchaseModel from "../models/purchase.model.js";
import * as InventoryModel from "../models/inventory.model.js";

// Obtener todas las compras
export const getAllPurchases = async () => {
  return await PurchaseModel.findAll();
};

// Obtener una compra por ID
export const getPurchaseById = async (id) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("La compra seleccionada no es válida");
  }

  const purchase = await PurchaseModel.findById(id);

  if (!purchase) {
    throw new Error("Compra no encontrada");
  }

  return purchase;
};

// Registrar una compra con múltiples productos
export const createPurchase = async (data) => {
  const supplierName = data.supplierName?.trim() || null;
  const items = data.items;

  if (supplierName && supplierName.length > 160) {
    throw new Error("El nombre del proveedor no puede superar los 160 caracteres");
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("La compra debe contener al menos un producto");
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const validatedItems = [];

  for (const item of items) {
    const productId = Number(item.productId);
    const quantity = Number(item.quantity);
    const unitPrice = Number(item.unitPrice);
    const batchCode = item.batchCode?.trim();
    const expirationDate = item.expirationDate;

    if (!Number.isInteger(productId) || productId <= 0) {
      throw new Error("Uno de los productos seleccionados no es válido");
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("Las cantidades deben ser enteros mayores que cero");
    }

    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      throw new Error("Los precios de compra deben ser valores válidos");
    }

    if (!/^\d+(\.\d{1,2})?$/.test(String(item.unitPrice))) {
      throw new Error("Los precios de compra deben tener como máximo dos decimales");
    }

    if (!batchCode || batchCode.length > 80) {
      throw new Error("El código del lote es obligatorio y no debe superar los 80 caracteres");
    }

    if (
      !expirationDate ||
      !/^\d{4}-\d{2}-\d{2}$/.test(expirationDate)
    ) {
      throw new Error("La fecha de vencimiento no es válida");
    }

    const expiration = new Date(`${expirationDate}T00:00:00.000Z`);

    if (
      Number.isNaN(expiration.getTime()) ||
      expiration.toISOString().slice(0, 10) !== expirationDate
    ) {
      throw new Error("La fecha de vencimiento no es válida");
    }

    if (expiration <= today) {
      throw new Error("No se pueden registrar lotes vencidos");
    }

    // Verificar que el producto exista y esté activo
    const product = await InventoryModel.findProductById(productId);

    if (!product || !product.active) {
      throw new Error(
        `El producto con ID ${productId} no existe o está desactivado`
      );
    }

    validatedItems.push({
      productId,
      quantity,
      unitPrice: unitPrice.toFixed(2),
      batchCode,
      expirationDate
    });
  }

  return await PurchaseModel.register({
    supplierName,
    items: validatedItems
  });
};
