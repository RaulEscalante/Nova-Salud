
import { apiRequest } from "./api";

// Obtener todas las compras
export const getPurchases = () => {
  return apiRequest("/purchases");
};

// Obtener una compra por su ID
export const getPurchaseById = (id) => {
  return apiRequest(`/purchases/${id}`);
};

// Registrar una compra
export const createPurchase = (purchaseData) => {
  return apiRequest("/purchases", {
    method: "POST",
    body: JSON.stringify(purchaseData)
  });
};
