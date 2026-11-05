
import { apiRequest } from "./api";

// Obtener todos los lotes
export const getBatches = () => {
  return apiRequest("/batches");
};

// Obtener los lotes de un producto específico
export const getBatchesByProduct = (productId) => {
  return apiRequest(`/batches/product/${productId}`);
};
