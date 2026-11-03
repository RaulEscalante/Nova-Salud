
import * as CategoryModel from "../models/category.model.js";

export const getAllCategories = async () => {
    return await CategoryModel.findAll();
};

export const getCategoryById = async (id) => {
    const category = await CategoryModel.findById(id);

    if (!category) {
        throw new Error("Categoría no encontrada");
    }

    return category;
};

export const createCategory = async (data) => {
    const name = data.name?.trim();

    if (!name) {
        throw new Error("El nombre de la categoría es obligatorio");
    }

    const existingCategory = await CategoryModel.findByName(name);

    if (existingCategory) {
        throw new Error("Ya existe una categoría con ese nombre");
    }

    return await CategoryModel.create({ name });
};

export const updateCategory = async (id, data) => {
    const category = await getCategoryById(id);

    const name = data.name?.trim();

    if (!name) {
        throw new Error("El nombre de la categoría es obligatorio");
    }

    const existingCategory = await CategoryModel.findByName(name);

    if (existingCategory && existingCategory.id !== category.id) {
        throw new Error("Ya existe otra categoría con ese nombre");
    }

    return await CategoryModel.update(id, { name });
};

export const changeCategoryStatus = async (id, active) => {
    await getCategoryById(id);

    if (typeof active !== "boolean") {
        throw new Error("El estado debe ser verdadero o falso");
    }

    return await CategoryModel.update(id, { active });
};
