
import prisma from "../config/prisma.js";

// Obtener todos los inventarios
export const findAll = async () => {
    return await prisma.inventory.findMany({
        include: {
            product: {
                include: {
                    category: true
                }
            }
        },
        orderBy: {
            product: {
                name: "asc"
            }
        }
    });
};

// Buscar inventario por producto
export const findByProductId = async (productId) => {
    return await prisma.inventory.findUnique({
        where: {
            productId
        },
        include: {
            product: {
                include: {
                    category: true
                }
            }
        }
    });
};

// Obtener movimientos de un producto
export const findMovementsByProductId = async (productId) => {
    return await prisma.inventoryMovement.findMany({
        where: {
            productId
        },
        include: {
            batch: true,
            sale: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });
};

// Buscar producto por ID
export const findProductById = async (productId) => {
    return await prisma.product.findUnique({
        where: { id: productId }
    });
};

// Registrar entrada de mercancía
export const registerPurchase = async (data) => {
    return await prisma.$transaction(async (tx) => {
        const inventory = await tx.inventory.findUnique({
            where: { productId: data.productId }
        });

        if (!inventory) {
            throw new Error("Inventario no encontrado");
        }

        // Buscar si el lote ya existe
        const existingBatch = await tx.batch.findUnique({
            where: {
                productId_batchCode: {
                    productId: data.productId,
                    batchCode: data.batchCode
                }
            }
        });

        let batch;

        if (existingBatch) {
            if (
                existingBatch.expirationDate.getTime() !==
                new Date(data.expirationDate).getTime()
            ) {
                throw new Error("El lote ya existe con otra fecha de vencimiento");
            }

            batch = await tx.batch.update({
                where: { id: existingBatch.id },
                data: {
                    quantity: {
                        increment: data.quantity
                    }
                }
            });
        } else {
            batch = await tx.batch.create({
                data: {
                    productId: data.productId,
                    batchCode: data.batchCode,
                    expirationDate: new Date(data.expirationDate),
                    quantity: data.quantity
                }
            });
        }

        // Actualizar existencias generales
        await tx.inventory.update({
            where: { productId: data.productId },
            data: {
                quantity: {
                    increment: data.quantity
                }
            }
        });

        // Registrar movimiento
        const movement = await tx.inventoryMovement.create({
            data: {
                productId: data.productId,
                batchId: batch.id,
                type: "PURCHASE",
                quantity: data.quantity,
                reason: data.reason || "Entrada de mercancía"
            }
        });

        return { batch, movement };
    });
};

// Registrar ajuste de inventario
export const registerAdjustment = async (data) => {
    return await prisma.$transaction(async (tx) => {
        const inventory = await tx.inventory.findUnique({
            where: { productId: data.productId }
        });

        if (!inventory) {
            throw new Error("Inventario no encontrado");
        }

        const batch = await tx.batch.findUnique({
            where: { id: data.batchId }
        });

        if (!batch || batch.productId !== data.productId) {
            throw new Error("El lote no pertenece al producto");
        }

        const difference = data.newQuantity - batch.quantity;

        if (difference === 0) {
            throw new Error("La cantidad nueva es igual a la cantidad actual");
        }

        if (inventory.quantity + difference < 0) {
            throw new Error("El ajuste supera las existencias disponibles");
        }

        // Actualizar cantidad del lote
        await tx.batch.update({
            where: { id: batch.id },
            data: {
                quantity: data.newQuantity
            }
        });

        // Actualizar inventario general
        await tx.inventory.update({
            where: { productId: data.productId },
            data: {
                quantity: {
                    increment: difference
                }
            }
        });

        // Registrar movimiento
        const movement = await tx.inventoryMovement.create({
            data: {
                productId: data.productId,
                batchId: batch.id,
                type: "ADJUSTMENT",
                quantity: difference,
                reason: data.reason
            }
        });

        return { batch, movement };
    });
};
