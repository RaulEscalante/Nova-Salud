
import prisma from "../config/prisma.js";

// Obtener todos los productos
export const findAll = async () => {
    return await prisma.product.findMany({
        include: {
            category: true,
            inventory: true
        },
        orderBy: {
            name: "asc"
        }
    });
};

// Buscar producto por ID
export const findById = async (id) => {
    return await prisma.product.findUnique({
        where: { id },
        include: {
            category: true,
            inventory: true
        }
    });
};

// Buscar producto por SKU
export const findBySku = async (sku) => {
    return await prisma.product.findUnique({
        where: { sku }
    });
};

// Buscar categoría por ID
export const findCategoryById = async (categoryId) => {
    return await prisma.category.findUnique({
        where: { id: categoryId }
    });
};

// Registrar producto y crear su inventario
export const create = async (data) => {
    return await prisma.product.create({
        data: {
            ...data,
            inventory: {
                create: {
                    quantity: 0
                }
            }
        },
        include: {
            category: true,
            inventory: true
        }
    });
};

// Actualizar producto
export const update = async (id, data) => {
    return await prisma.product.update({
        where: { id },
        data,
        include: {
            category: true,
            inventory: true
        }
    });
};

// Cambiar estado del producto
export const updateStatus = async (id, active) => {
    return await prisma.product.update({
        where: { id },
        data: { active },
        include: {
            category: true,
            inventory: true
        }
    });
};