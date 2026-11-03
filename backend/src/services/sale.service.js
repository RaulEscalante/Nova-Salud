import * as SaleModel from "../models/sale.model.js";

// Obtener todas las ventas
export const getAllSales = async () => {
  return await SaleModel.findAll();
};

// Obtener una venta por ID
export const getSaleById = async (id) => {
  const saleId = Number(id);

  if (!Number.isInteger(saleId) || saleId <= 0) {
    throw new Error("El identificador de venta no es válido");
  }

  const sale = await SaleModel.findById(saleId);

  if (!sale) {
    throw new Error("Venta no encontrada");
  }

  return sale;
};

// Registrar una venta
export const createSale = async (data) => {

  // Verificar que existan productos en la solicitud
  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    throw new Error("La venta debe contener al menos un producto");
  }

  // Validar y consolidar productos repetidos
  const productsMap = new Map();

  for (const item of data.items) {
    const productId = Number(item.productId);
    const quantity = Number(item.quantity);

    if (!Number.isInteger(productId) || productId <= 0) {
      throw new Error("El producto seleccionado no es válido");
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("La cantidad debe ser un entero mayor que cero");
    }

    // Si el producto ya existe, sumar su cantidad
    if (productsMap.has(productId)) {
      const currentQuantity = productsMap.get(productId);

      const newQuantity = currentQuantity + quantity;

      if (!Number.isSafeInteger(newQuantity)) {
        throw new Error("La cantidad debe ser un entero mayor que cero");
      }

      productsMap.set(productId, newQuantity);

    } else {
      productsMap.set(productId, quantity);
    }
  }

  // Convertir los productos consolidados al formato esperado
  const items = Array.from(productsMap, ([productId, quantity]) => ({
    productId,
    quantity
  }));

  // Registrar la venta
  return await SaleModel.create({ items });
};
