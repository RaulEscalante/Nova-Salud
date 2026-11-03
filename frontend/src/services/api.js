const API_URL = import.meta.env.VITE_API_URL;

// Función general para realizar peticiones
export const apiRequest = async (endpoint, options = {}) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.mensaje || "Error al comunicarse con el servidor");
    }

    return data;
};

// Obtener inventarios
export const getInventories = () => {
    return apiRequest("/inventory");
};

// Obtener alertas
export const getAlerts = () => {
    return apiRequest("/alerts");
};