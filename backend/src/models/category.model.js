
import prisma from "../config/prisma.js";

// Obtener todas las categorías
export const findAll = async () => {
    return await prisma.category.findMany({
        orderBy: {
            name: "asc"
        }
    });
};

// Buscar una categoría por ID
export const findById = async (id) => {
    return await prisma.category.findUnique({
        where: { id }
    });
};

// Buscar una categoría por nombre
export const findByName = async (name) => {
    return await prisma.category.findUnique({
        where: { name }
    });
};

// Registrar una categoría
export const create = async (data) => {
    return await prisma.category.create({
        data
    });
};

// Actualizar una categoría
export const update = async (id, data) => {
    return await prisma.category.update({
        where: { id },
        data
    });
};
