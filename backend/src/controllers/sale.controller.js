import * as SaleService from "../services/sale.service.js";

// Obtener todas las ventas
export const getAll = async (req, res, next) => {
  try {
    const sales = await SaleService.getAllSales();

    res.status(200).json({
      mensaje: "Ventas obtenidas correctamente",
      total: sales.length,
      ventas: sales
    });
  } catch (error) {
    next(error);
  }
};

// Obtener una venta por ID
export const getById = async (req, res, next) => {
  try {
    const sale = await SaleService.getSaleById(req.params.id);

    res.status(200).json({
      mensaje: "Venta obtenida correctamente",
      venta: sale
    });
  } catch (error) {
    next(error);
  }
};

// Registrar una venta
export const create = async (req, res, next) => {
  try {
    const sale = await SaleService.createSale(req.body);

    res.status(201).json({
      mensaje: "Venta registrada correctamente",
      venta: sale
    });
  } catch (error) {
    next(error);
  }
};  