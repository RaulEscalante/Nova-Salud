import * as AlertModel from "../models/alert.model.js";
import { getStockStatus } from "../utils/stock.utils.js";
import { getExpirationStatus, getDaysUntilExpiration } from "../utils/expiration.utils.js";

// Obtener todas las alertas
export const getAllAlerts = async () => {
  const { inventories, batches } = await AlertModel.findAlertData();

  // Generar alertas de stock
  const stockAlerts = inventories
    .filter((inventory) => inventory.product.active)
    .map((inventory) => {
      const { product, quantity } = inventory;

      const stockStatus = getStockStatus(
        quantity,
        product.minStock,
        product.maxStock
      );

      if (!["AGOTADO", "CRITICO"].includes(stockStatus)) {
        return null;
      }

      return {
        type: "STOCK",
        status: stockStatus,
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        quantity,
        minStock: product.minStock,
        message: stockStatus === "AGOTADO"
          ? `El producto ${product.name} está agotado. Es necesario reponerlo.`
          : `El producto ${product.name} tiene stock crítico. Se recomienda realizar una reposición.`
      };
    })
    .filter(Boolean);

  // Generar alertas de vencimiento
  const expirationAlerts = batches
    .filter((batch) =>
      batch.quantity > 0 && batch.product.active
    )
    .map((batch) => {
      const expirationStatus = getExpirationStatus(
        batch.expirationDate
      );

      if (!["VENCIDO", "POR VENCER"].includes(expirationStatus)) {
        return null;
      }

      const daysUntilExpiration = getDaysUntilExpiration(
        batch.expirationDate
      );

      return {
        type: "VENCIMIENTO",
        status: expirationStatus,
        productId: batch.product.id,
        productName: batch.product.name,
        sku: batch.product.sku,
        batchId: batch.id,
        batchCode: batch.batchCode,
        quantity: batch.quantity,
        expirationDate: batch.expirationDate,
        daysUntilExpiration,
        message: expirationStatus === "VENCIDO"
          ? `El lote ${batch.batchCode} del producto ${batch.product.name} está vencido. No debe utilizarse ni venderse.`
          : `El lote ${batch.batchCode} del producto ${batch.product.name} está próximo a vencer. Se recomienda revisar sus existencias.`
      };
    })
    .filter(Boolean);

  // Unificar alertas
  const alerts = [...stockAlerts, ...expirationAlerts];

  // Resumen de alertas
  const summary = {
    total: alerts.length,
    stock: stockAlerts.length,
    expiration: expirationAlerts.length,
    agotados: stockAlerts.filter(
      (alert) => alert.status === "AGOTADO"
    ).length,
    stockCritico: stockAlerts.filter(
      (alert) => alert.status === "CRITICO"
    ).length,
    vencidos: expirationAlerts.filter(
      (alert) => alert.status === "VENCIDO"
    ).length,
    porVencer: expirationAlerts.filter(
      (alert) => alert.status === "POR VENCER"
    ).length
  };

  return { summary, alerts };
};