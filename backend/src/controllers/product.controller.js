
import * as ProductService from "../services/product.service.js";

// Listar productos
export const getAll = async (req, res, next) => {
    try {
        const { page, limit, search, order } = req.query;

        const result = await ProductService.getAllProducts({
            page,
            limit,
            search,
            order
        });

        // Respuesta para consultas paginadas
        if (result.productos) {
            return res.status(200).json({
                mensaje: "Productos obtenidos correctamente",
                ...result
            });
        }

        // Respuesta para consultas sin paginación
        res.status(200).json({
            mensaje: "Productos obtenidos correctamente",
            productos: result
        });
    } catch (error) {
        next(error);
    }
};

// Obtener producto por ID
export const getById = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: "El ID del producto no es válido"
            });
        }

        const product = await ProductService.getProductById(id);

        res.status(200).json({
            mensaje: "Producto obtenido correctamente",
            producto: product
        });
    } catch (error) {
        next(error);
    }
};

// Registrar producto
export const create = async (req, res, next) => {
    try {
        const product = await ProductService.createProduct(req.body);

        res.status(201).json({
            mensaje: "Producto registrado correctamente",
            producto: product
        });
    } catch (error) {
        next(error);
    }
};

// Actualizar producto
export const update = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: "El ID del producto no es válido"
            });
        }

        const product = await ProductService.updateProduct(id, req.body);

        res.status(200).json({
            mensaje: "Producto actualizado correctamente",
            producto: product
        });
    } catch (error) {
        next(error);
    }
};

// Activar o desactivar producto
export const changeStatus = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: "El ID del producto no es válido"
            });
        }

        const product = await ProductService.changeProductStatus(
            id,
            req.body.active
        );

        res.status(200).json({
            mensaje: product.active
                ? "Producto activado correctamente"
                : "Producto desactivado correctamente",
            producto: product
        });
    } catch (error) {
        next(error);
    }
};