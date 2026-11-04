
import { apiRequest } from "./api";

// Obtener todos los productos
export const getProducts = () => {
  return apiRequest("/products");
};

// Obtener un producto por su ID
export const getProductById = (id) => {
  return apiRequest(`/products/${id}`);
};

// Crear un producto
export const createProduct = (productData) => {
  return apiRequest("/products", {
    method: "POST",
    body: JSON.stringify(productData)
  });
};

// Actualizar un producto
export const updateProduct = (id, productData) => {
  return apiRequest(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(productData)
  });
};

// Cambiar estado de un producto
export const updateProductStatus = (id, active) => {
  return apiRequest(`/products/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ active })
  });
};
