
import * as ProductModel from "../models/product.model.js";


export const getAllProducts = async ({
  page,
  limit,
  search = "",
  order = "asc"
} = {}) => {
  // Validar paginación
  const paginated = page !== undefined || limit !== undefined;

  if (paginated) {
    page = Number(page ?? 1);
    limit = Number(limit ?? 10);

    if (!Number.isInteger(page) || page < 1) {
      throw new Error("El número de página no es válido");
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new Error("La cantidad de productos por página no es válida");
    }
  }

  // Validar orden
  if (!["asc", "desc"].includes(order)) {
    throw new Error("El orden de los productos no es válido");
  }

  const normalizedSearch = String(search).trim();

  // Consultar productos
  const products = await ProductModel.findAll({
    page: paginated ? page : undefined,
    limit: paginated ? limit : undefined,
    search: normalizedSearch,
    order
  });

  // Calcular stock disponible excluyendo lotes vencidos
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const productsWithStock = products.map((product) => {
    const availableStock = product.batches.reduce(
      (total, batch) => {
        const expirationDate = new Date(batch.expirationDate);

        return expirationDate >= today
          ? total + batch.quantity
          : total;
      },
      0
    );

    const { batches, ...productData } = product;

    return {
      ...productData,
      availableStock
    };
  });

  // Mantener compatibilidad con las consultas sin paginación
  if (!paginated) {
    return productsWithStock;
  }

  // Obtener cantidad total de coincidencias
  const total = await ProductModel.countAll(normalizedSearch);

  return {
    productos: productsWithStock,
    paginacion: {
      pagina: page,
      limite: limit,
      total,
      totalPaginas: Math.ceil(total / limit)
    }
  };
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
