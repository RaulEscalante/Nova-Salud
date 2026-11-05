
import * as ProductModel from "../models/product.model.js";

// Listar productos con stock disponible para venta
export const getAllProducts = async () => {
  const products = await ProductModel.findAll();

  // Fecha actual a medianoche UTC
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  return products.map((product) => {
    const availableStock = product.batches.reduce(
      (total, batch) => {
        const expirationDate = new Date(batch.expirationDate);

        if (expirationDate >= today) {
          return total + batch.quantity;
        }

        return total;
      },
      0
    );

    const { batches, ...productData } = product;

    return {
      ...productData,
      availableStock
    };
  });
};


// Obtener producto por ID
export const getProductById = async (id) => {
  const product = await ProductModel.findById(id);

  if (!product) {
    throw new Error("Producto no encontrado");
  }

  return product;
};

// Validar datos del producto
const validateProductData = (data) => {
  const sku = data.sku?.trim().toUpperCase();
  const name = data.name?.trim();
  const description = data.description?.trim() || null;

  const purchasePrice = Number(data.purchasePrice);
  const salePrice = Number(data.salePrice);
  const minStock = Number(data.minStock);
  const maxStock = Number(data.maxStock);
  const categoryId = Number(data.categoryId);

  if (!sku || !name) {
    throw new Error("El SKU y el nombre son obligatorios");
  }

  if (!Number.isFinite(purchasePrice) || purchasePrice < 0) {
    throw new Error("El precio de compra no es válido");
  }

  if (!Number.isFinite(salePrice) || salePrice < 0) {
    throw new Error("El precio de venta no es válido");
  }

  if (!Number.isInteger(minStock) || minStock < 0) {
    throw new Error("El stock mínimo debe ser un entero no negativo");
  }

  if (!Number.isInteger(maxStock) || maxStock <= minStock) {
    throw new Error("El stock máximo debe ser mayor que el mínimo");
  }

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    throw new Error("La categoría seleccionada no es válida");
  }

  return {
    sku,
    name,
    description,
    purchasePrice,
    salePrice,
    minStock,
    maxStock,
    categoryId
  };
};

// Registrar producto
export const createProduct = async (data) => {
  const productData = validateProductData(data);

  const existingProduct = await ProductModel.findBySku(productData.sku);

  if (existingProduct) {
    throw new Error("Ya existe un producto con ese SKU");
  }

  const category = await ProductModel.findCategoryById(
    productData.categoryId
  );

  if (!category || !category.active) {
    throw new Error("La categoría no existe o está desactivada");
  }

  return await ProductModel.create(productData);
};

// Actualizar producto
export const updateProduct = async (id, data) => {
  const product = await getProductById(id);
  const productData = validateProductData(data);

  const existingProduct = await ProductModel.findBySku(productData.sku);

  if (existingProduct && existingProduct.id !== id) {
    throw new Error("Ya existe un producto con ese SKU");
  }

  const category = await ProductModel.findCategoryById(
    productData.categoryId
  );

  if (!category || !category.active) {
    throw new Error("La categoría no existe o está desactivada");
  }

  return await ProductModel.update(id, productData);
};

// Activar o desactivar producto
export const changeProductStatus = async (id, active) => {
  await getProductById(id);

  if (typeof active !== "boolean") {
    throw new Error("El estado debe ser verdadero o falso");
  }

  return await ProductModel.updateStatus(id, active);
};
