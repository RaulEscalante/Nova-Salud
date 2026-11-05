
import { apiRequest } from "./api";

// Obtener todas las ventas
export const getSales = () => {
  return apiRequest("/sales");
};

// Obtener una venta por su ID
export const getSaleById = (id) => {
  return apiRequest(`/sales/${id}`);
};

// Registrar una nueva venta
export const createSale = (saleData) => {
  return apiRequest("/sales", {
    method: "POST",
    body: JSON.stringify(saleData)
  });
};
