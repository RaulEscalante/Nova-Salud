import * as AlertService from "../services/alert.service.js";

// Obtener todas las alertas
export const getAllAlerts = async (req, res, next) => {
    try {
        const result = await AlertService.getAllAlerts();

        res.status(200).json({
            mensaje: "Alertas obtenidas correctamente",
            resumen: result.summary,
            alertas: result.alerts
        });
    } catch (error) {
        next(error);
    }
};