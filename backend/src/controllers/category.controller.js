
import * as CategoryService from "../services/category.service.js";

// Listar categorías
export const getAll = async (req, res, next) => {
    try {
        const categories = await CategoryService.getAllCategories();

        res.status(200).json({
            mensaje: "Categorías obtenidas correctamente",
            categorias: categories
        });
    } catch (error) {
        next(error);
    }
};

// Obtener categoría por ID
export const getById = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: "El ID de la categoría no es válido"
            });
        }

        const category = await CategoryService.getCategoryById(id);

        res.status(200).json({
            mensaje: "Categoría obtenida correctamente",
            categoria: category
        });
    } catch (error) {
        next(error);
    }
};

// Registrar categoría
export const create = async (req, res, next) => {
    try {
        const category = await CategoryService.createCategory(req.body);

        res.status(201).json({
            mensaje: "Categoría registrada correctamente",
            categoria: category
        });
    } catch (error) {
        next(error);
    }
};

// Actualizar categoría
export const update = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: "El ID de la categoría no es válido"
            });
        }

        const category = await CategoryService.updateCategory(id, req.body);

        res.status(200).json({
            mensaje: "Categoría actualizada correctamente",
            categoria: category
        });
    } catch (error) {
        next(error);
    }
};

// Activar o desactivar categoría
export const changeStatus = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: "El ID de la categoría no es válido"
            });
        }

        const category = await CategoryService.changeCategoryStatus(
            id,
            req.body.active
        );

        res.status(200).json({
            mensaje: category.active
                ? "Categoría activada correctamente"
                : "Categoría desactivada correctamente",
            categoria: category
        });
    } catch (error) {
        next(error);
    }
};
