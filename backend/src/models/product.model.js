
import prisma from "../config/prisma.js";

// Obtener productos con filtros y paginación opcional
export const findAll = async ({
  page,
  limit,
  search,
  order = "asc"
} = {}) => {
  const where = search
    ? {
      OR: [
        {
          name: {
            contains: search
          }
        },
        {
          sku: {
            contains: search
          }
        }
      ]
    }
    : {};

  return await prisma.product.findMany({
    where,
    include: {
      category: true,
      inventory: true,
      batches: {
        where: {
          quantity: { gt: 0 }
        },
        select: {
          quantity: true,
          expirationDate: true
        }
      }
    },
    orderBy: {
      name: order
    },
    ...(page && limit
      ? {
        skip: (page - 1) * limit,
        take: limit
      }
      : {})
  });
};

// Contar productos que coinciden con la búsqueda
export const countAll = async (search = "") => {
  const where = search
    ? {
      OR: [
        {
          name: {
            contains: search
          }
        },
        {
          sku: {
            contains: search
          }
        }
      ]
    }
    : {};

  return await prisma.product.count({ where });
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