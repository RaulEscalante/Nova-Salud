
import { useState } from "react";
import { Save, X } from "lucide-react";

import Modal from "../common/Modal";
import {
  createProduct,
  updateProduct
} from "../../services/productService";
import { useToast } from "../../context/ToastContext";

import "./ProductForm.css";

const ProductForm = ({ product, categories, onClose, onSuccess }) => {
  const isEditing = Boolean(product);

  const [formData, setFormData] = useState({
    sku: product?.sku || "",
    name: product?.name || "",
    description: product?.description || "",
    purchasePrice: product?.purchasePrice || "",
    salePrice: product?.salePrice || "",
    minStock: product?.minStock ?? 10,
    maxStock: product?.maxStock ?? 100,
    categoryId: product?.categoryId || ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      sku: formData.sku.trim().toUpperCase(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      purchasePrice: Number(formData.purchasePrice),
      salePrice: Number(formData.salePrice),
      minStock: Number(formData.minStock),
      maxStock: Number(formData.maxStock),
      categoryId: Number(formData.categoryId)
    };

    if (
      !productData.sku ||
      !productData.name ||
      !productData.categoryId
    ) {
      setError("Completa los campos obligatorios.");
      return;
    }

    if (
      productData.purchasePrice < 0 ||
      productData.salePrice < 0
    ) {
      setError("Los precios no pueden ser negativos.");
      return;
    }

    if (
      !Number.isInteger(productData.minStock) ||
      !Number.isInteger(productData.maxStock) ||
      productData.minStock < 0 ||
      productData.maxStock < 0
    ) {
      setError("Los niveles de stock deben ser números enteros positivos o cero.");
      return;
    }

    if (productData.maxStock < productData.minStock) {
      setError("El stock máximo no puede ser menor que el stock mínimo.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (isEditing) {
        await updateProduct(product.id, productData);

        showToast(
          `El producto "${productData.name}" fue actualizado correctamente.`,
          "success"
        );
      } else {
        await createProduct(productData);

        showToast(
          `El producto "${productData.name}" fue registrado correctamente.`,
          "success"
        );
      }

      onSuccess();
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isEditing ? "Editar producto" : "Nuevo producto"}
      onClose={onClose}
    >
      <form className="product-form" onSubmit={handleSubmit}>

        <div className="product-form-group">
          <label htmlFor="product-sku">
            Código SKU *
          </label>

          <input
            id="product-sku"
            name="sku"
            type="text"
            placeholder="Ej. MED-001"
            value={formData.sku}
            onChange={handleChange}
            maxLength={40}
            required
            autoFocus
          />

          <span className="product-form-hint">
            Código único para identificar el producto.
          </span>
        </div>

        <div className="product-form-group">
          <label htmlFor="product-name">
            Nombre del producto *
          </label>

          <input
            id="product-name"
            name="name"
            type="text"
            placeholder="Ej. Paracetamol 500 mg"
            value={formData.name}
            onChange={handleChange}
            maxLength={160}
            required
          />
        </div>

        <div className="product-form-group">
          <label htmlFor="product-description">
            Descripción
          </label>

          <textarea
            id="product-description"
            name="description"
            placeholder="Descripción o detalles del producto"
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="product-form-group">
          <label htmlFor="product-category">
            Categoría *
          </label>

          <select
            id="product-category"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar categoría</option>

            {categories
              .filter((category) => category.active)
              .map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>

        <div className="product-form-row">
          <div className="product-form-group">
            <label htmlFor="product-purchase-price">
              Precio de compra *
            </label>

            <input
              id="product-purchase-price"
              name="purchasePrice"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={formData.purchasePrice}
              onChange={handleChange}
              required
            />
          </div>

          <div className="product-form-group">
            <label htmlFor="product-sale-price">
              Precio de venta *
            </label>

            <input
              id="product-sale-price"
              name="salePrice"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={formData.salePrice}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="product-form-row">
          <div className="product-form-group">
            <label htmlFor="product-min-stock">
              Stock mínimo *
            </label>

            <input
              id="product-min-stock"
              name="minStock"
              type="number"
              min="0"
              step="1"
              value={formData.minStock}
              onChange={handleChange}
              required
            />
          </div>

          <div className="product-form-group">
            <label htmlFor="product-max-stock">
              Stock máximo *
            </label>

            <input
              id="product-max-stock"
              name="maxStock"
              type="number"
              min="0"
              step="1"
              value={formData.maxStock}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <span className="product-form-hint">
          El stock mínimo permite generar alertas de reposición.
          El máximo funciona como referencia.
        </span>

        {error && (
          <div className="product-form-error">
            {error}
          </div>
        )}

        <div className="product-form-actions">
          <button
            type="button"
            className="product-form-cancel"
            onClick={onClose}
            disabled={loading}
          >
            <X size={17} />
            Cancelar
          </button>

          <button
            type="submit"
            className="product-form-save"
            disabled={loading}
          >
            <Save size={17} />
            {loading
              ? "Guardando..."
              : isEditing
                ? "Guardar cambios"
                : "Registrar producto"
            }
          </button>
        </div>

      </form>
    </Modal>
  );
};

export default ProductForm;
