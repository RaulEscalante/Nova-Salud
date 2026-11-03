import prisma from "../config/prisma.js";

// Obtener todos los lotes
export const findAll = async () => {
    return await prisma.batch.findMany({
        include: {
            product: {
                include: {
                    category: true
                }
            }
        },
        orderBy: {
            expirationDate: "asc"
        }
    });
};

// Obtener lotes de un producto
export const findByProductId = async (productId) => {
    return await prisma.batch.findMany({
        where: {
            productId
        },
        include: {
            product: {
                include: {
                    category: true
                }
            }
        },
        orderBy: {
            expirationDate: "asc"
        }
    });
};