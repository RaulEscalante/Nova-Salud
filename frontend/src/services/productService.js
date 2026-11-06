
import { apiRequest } from "./api";

// Obtener productos con filtros y paginación opcional
export const getProducts = ({
  page,
  limit,
  search = "",
  order = "asc"
} = {}) => {
  const params = new URLSearchParams();

  if (page !== undefined) params.append("page", page);
  if (limit !== undefined) params.append("limit", limit);
  if (search.trim()) params.append("search", search.trim());

  params.append("order", order);

  const query = params.toString();

  return apiRequest(`/products?${query}`);
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
