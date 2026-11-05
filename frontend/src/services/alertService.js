
import { apiRequest } from "./api";

// Obtener todas las alertas del sistema
export const getAlerts = () => {
  return apiRequest("/alerts");
};
