import prisma from "../config/prisma.js";

// Obtener todas las ventas
export const findAll = async () => {
  return await prisma.sale.findMany({
    include: {
      details: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};

// Buscar una venta por ID
export const findById = async (id) => {
  return await prisma.sale.findUnique({
    where: { id },
    include: {
      details: {
        include: {
          product: true
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

// Registrar una venta
export const create = async (data) => {
  return await prisma.$transaction(async (tx) => {

    // 1. Obtener productos activos
    const productIds = data.items.map((item) => item.productId);
    const products = await tx.product.findMany({
      where: {
        id: { in: productIds },
        active: true
      }
    });

    if (products.length !== productIds.length) {
      throw new Error("Uno o más productos no existen o están desactivados");
    }

    const saleDetails = [];
    const movements = [];
    let total = 0;

    //2 Fecha de hoy a medianoche UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // 3. Procesar cada producto
    for (const item of data.items) {
      const product = products.find(
        (p) => p.id === item.productId
      );

      const quantity = item.quantity;
      const unitPrice = Number(product.salePrice);
      const subtotal = Number((unitPrice * quantity).toFixed(2));

      // 4. Comprobar inventario general
      const inventory = await tx.inventory.findUnique({
        where: {
          productId: product.id
        }
      });

      if (!inventory || inventory.quantity < quantity) {
        throw new Error(
          `Stock insuficiente para el producto ${product.name}`
        );
      }

      // 5. Buscar lotes disponibles mediante FEFO
      const batches = await tx.batch.findMany({
        where: {
          productId: product.id,
          quantity: { gt: 0 },
          expirationDate: { gte: today }
        },
        orderBy: [
          { expirationDate: "asc" },
          { id: "asc" }
        ]
      });

      const availableQuantity = batches.reduce(
        (sum, batch) => sum + batch.quantity,
        0
      );

      if (availableQuantity < quantity) {
        throw new Error(
          `No hay suficientes existencias vigentes para ${product.name}`
        );
      }

      // 6. Preparar detalle de venta
      saleDetails.push({
        productId: product.id,
        quantity,
        unitPrice,
        subtotal
      });

      total += subtotal;

      // 7. Descontar lotes siguiendo FEFO
      let remaining = quantity;

      for (const batch of batches) {
        if (remaining <= 0) break;

        const deducted = Math.min(
          batch.quantity,
          remaining
        );

        // Actualizar únicamente si todavía hay suficientes unidades
        const batchUpdate = await tx.batch.updateMany({
          where: {
            id: batch.id,
            quantity: { gte: deducted }
          },
          data: {
            quantity: { decrement: deducted }
          }
        });

        if (batchUpdate.count !== 1) {
          throw new Error(
            `No se pudieron actualizar las existencias del lote ${batch.batchCode}`
          );
        }

        movements.push({
          productId: product.id,
          batchId: batch.id,
          type: "SALE",
          quantity: -deducted,
          reason: "Venta de producto"
        });

        remaining -= deducted;
      }

      // 8. Actualizar inventario general
      const inventoryUpdate = await tx.inventory.updateMany({
        where: {
          productId: product.id,
          quantity: { gte: quantity }
        },
        data: {
          quantity: { decrement: quantity }
        }
      });

      if (inventoryUpdate.count !== 1) {
        throw new Error(
          `No se pudieron actualizar las existencias de ${product.name}`
        );
      }
    }

    // 9. Crear venta y detalles
    const sale = await tx.sale.create({
      data: {
        total: Number(total.toFixed(2)),
        details: {
          create: saleDetails
        }
      }
    });

    // 10. Registrar movimientos
    await tx.inventoryMovement.createMany({
      data: movements.map((movement) => ({
        ...movement,
        saleId: sale.id
      }))
    });

    // 11. Devolver venta completa
    return await tx.sale.findUnique({
      where: {
        id: sale.id
      },
      include: {
        details: {
          include: {
            product: true
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
  });
};