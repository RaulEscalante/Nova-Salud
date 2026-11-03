// Obtener el estado del stock
export const getStockStatus = (quantity, minStock, maxStock) => {
    if (quantity === 0) {
        return "AGOTADO";
    }

    if (quantity <= minStock) {
        return "CRITICO";
    }

    if (quantity <= maxStock) {
        return "NORMAL";
    }

    return "SOBRESTOCK";
};