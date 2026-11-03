// Obtener la fecha actual sin considerar la hora
const getTodayDate = () => {
    const today = new Date();

    return Date.UTC(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );
};

// Obtener los días restantes para el vencimiento
export const getDaysUntilExpiration = (expirationDate) => {
    const expiration = new Date(expirationDate);

    const expirationTime = Date.UTC(
        expiration.getUTCFullYear(),
        expiration.getUTCMonth(),
        expiration.getUTCDate()
    );

    const difference = expirationTime - getTodayDate();

    return Math.round(difference / (1000 * 60 * 60 * 24));
};

// Obtener el estado de vencimiento
export const getExpirationStatus = (expirationDate) => {
    const difference = getDaysUntilExpiration(expirationDate);

    if (difference < 0) return "VENCIDO";
    if (difference <= 30) return "POR VENCER";

    return "VIGENTE";
};