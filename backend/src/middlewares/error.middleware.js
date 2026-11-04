
const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  // Errores de recursos no encontrados
  const notFoundErrors = [
    "Categoría no encontrada",
    "Producto no encontrado",
    "Venta no encontrada",
    "Compra no encontrada"
  ];
  if (notFoundErrors.includes(err.message)) {
    return res.status(404).json({
      mensaje: err.message
    });
  }

  // Errores de validación
  const validationErrors = [
    // Categorías
    "El nombre de la categoría es obligatorio",
    "Ya existe una categoría con ese nombre",
    "El estado debe ser verdadero o falso",

    // Productos
    "El SKU y el nombre son obligatorios",
    "El precio de compra no es válido",
    "El precio de venta no es válido",
    "El stock mínimo debe ser un entero no negativo",
    "El stock máximo debe ser mayor que el mínimo",
    "La categoría seleccionada no es válida",
    "Ya existe un producto con ese SKU",
    "La categoría no existe o está desactivada",
    "El producto seleccionado no es válido",
    "El producto no existe o está desactivado",

    // Inventario y lotes
    "La cantidad debe ser un entero mayor que cero",
    "El código del lote es obligatorio",
    "La fecha de vencimiento no es válida",
    "No se pueden registrar lotes vencidos",
    "El lote seleccionado no es válido",
    "La nueva cantidad debe ser un entero no negativo",
    "El motivo del ajuste es obligatorio",
    "Inventario no encontrado",
    "El lote ya existe con otra fecha de vencimiento",
    "El lote no pertenece al producto",
    "La cantidad nueva es igual a la cantidad actual",
    "El ajuste supera las existencias disponibles",

    // Ventas
    "El identificador de venta no es válido",
    "La venta debe contener al menos un producto",
    "No se permiten productos duplicados en una venta",
    "Uno o más productos no existen o están desactivados",

    // Compras
    "La compra debe contener al menos un producto",
    "Los precios de compra deben ser valores válidos",
    "Los precios de compra deben tener como máximo dos decimales",
    "El código del lote es obligatorio y no debe superar los 80 caracteres",
    "Las cantidades deben ser enteros mayores que cero"
  ];

  if (validationErrors.includes(err.message)) {
    return res.status(400).json({
      mensaje: err.message
    });
  }

  // Errores dinámicos de stock insuficiente
  if (
    err.message.startsWith("Stock insuficiente para el producto") ||
    err.message.startsWith("No hay suficientes existencias vigentes para")
  ) {
    return res.status(400).json({
      mensaje: err.message
    });
  }

  // Errores dinámicos de compras
  if (
    err.message.startsWith("El producto con ID") ||
    err.message.startsWith("No existe inventario para el producto") ||
    err.message.startsWith("El lote")
  ) {
    return res.status(400).json({
      mensaje: err.message
    });
  }

  // Cualquier otro error no contemplado
  res.status(500).json({
    mensaje: "Error interno del servidor"
  });
};

export default errorMiddleware;
