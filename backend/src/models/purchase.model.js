
import prisma from "../config/prisma.js";

// Obtener todas las compras
export const findAll = async () => {
  return await prisma.purchase.findMany({
    include: {
      details: {
        include: {
          product: true,
          batch: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};

// Obtener una compra por ID
export const findById = async (id) => {
  return await prisma.purchase.findUnique({
    where: { id },
    include: {
      details: {
        include: {
          product: true,
          batch: true
        }
      },
      movements: {
        include: {
          product: true,
          batch: true
        }
      }
    }
  });
};

// Registrar una compra con múltiples productos
export const register = async (data) => {
  return await prisma.$transaction(async (tx) => {
    let total = 0;

    const purchaseDetails = [];

    // Crear compra inicialmente con total cero
    const purchase = await tx.purchase.create({
      data: {
        supplierName: data.supplierName || null,
        total: 0
      }
    });

    for (const item of data.items) {
      const inventory = await tx.inventory.findUnique({
        where: {
          productId: item.productId
        }
      });

      if (!inventory) {
        throw new Error(
          `No existe inventario para el producto ${item.productId}`
        );
      }

      // Buscar lote existente
      const existingBatch = await tx.batch.findUnique({
        where: {
          productId_batchCode: {
            productId: item.productId,
            batchCode: item.batchCode
          }
        }
      });

      let batch;

      if (existingBatch) {
        if (
          existingBatch.expirationDate.getTime() !==
          new Date(`${item.expirationDate}T00:00:00.000Z`).getTime()
        ) {
          throw new Error(
            `El lote ${item.batchCode} ya existe con otra fecha de vencimiento`
          );
        }

        batch = await tx.batch.update({
          where: {
            id: existingBatch.id
          },
          data: {
            quantity: {
              increment: item.quantity
            }
          }
        });
      } else {
        batch = await tx.batch.create({
          data: {
            productId: item.productId,
            batchCode: item.batchCode,
            expirationDate: new Date(
              `${item.expirationDate}T00:00:00.000Z`
            ),
            quantity: item.quantity
          }
        });
      }

      // Actualizar existencias generales
      await tx.inventory.update({
        where: {
          productId: item.productId
        },
        data: {
          quantity: {
            increment: item.quantity
          }
        }
      });

      // Actualizar último precio de compra
      await tx.product.update({
        where: {
          id: item.productId
        },
        data: {
          purchasePrice: item.unitPrice
        }
      });

      // Calcular subtotal
      const subtotal = item.quantity * item.unitPrice;
      total += subtotal;

      // Registrar detalle
      const detail = await tx.purchaseDetail.create({
        data: {
          purchaseId: purchase.id,
          productId: item.productId,
          batchId: batch.id,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal
        },
        include: {
          product: true,
          batch: true
        }
      });

      purchaseDetails.push(detail);

      // Registrar movimiento de inventario
      await tx.inventoryMovement.create({
        data: {
          productId: item.productId,
          batchId: batch.id,
          purchaseId: purchase.id,
          type: "PURCHASE",
          quantity: item.quantity,
          reason: `Compra #${purchase.id}`
        }
      });
    }

    // Actualizar total de la compra
    const updatedPurchase = await tx.purchase.update({
      where: {
        id: purchase.id
      },
      data: {
        total: total
      }
    });

    return {
      ...updatedPurchase,
      details: purchaseDetails
    };
  });
};
