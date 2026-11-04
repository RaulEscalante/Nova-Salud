
import { apiRequest } from "./api";

// Obtener todas las categorías
export const getCategories = () => {
  return apiRequest("/categories");
};

// Crear una categoría
export const createCategory = (categoryData) => {
  return apiRequest("/categories", {
    method: "POST",
    body: JSON.stringify(categoryData)
  });
};

// Actualizar una categoría
export const updateCategory = (id, categoryData) => {
  return apiRequest(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(categoryData)
  });
};

// Cambiar estado de una categoría
export const updateCategoryStatus = (id, active) =>
  apiRequest(`/categories/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ active })
  });
