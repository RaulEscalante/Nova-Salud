
import { useEffect, useState } from "react";
import { Plus, Trash2, Package } from "lucide-react";

import { getProducts } from "../../services/productService";
import { getCategories } from "../../services/categoryService";

import "./PurchaseForm.css";

const PurchaseForm = ({ onSubmit, onCancel, saving = false }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [supplierName, setSupplierName] = useState("");

  const [items, setItems] = useState([
    {
      productId: "",
      quantity: 1,
      unitPrice: "",
      batchCode: "",
      expirationDate: ""
    }
  ]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setLoadError("");

        const [productsResponse, categoriesResponse] = await Promise.all([
          getProducts(),
          getCategories()
        ]);

        setProducts(
          (productsResponse.productos || []).filter(
            (product) => product.active
          )
        );

        setCategories(
          (categoriesResponse.categorias || []).filter(
            (category) => category.active
          )
        );
      } catch (err) {
        setLoadError(
          err.message || "No se pudieron cargar los datos del formulario."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAddItem = () => {
    setItems((current) => [
      ...current,
      {
        productId: "",
        quantity: 1,
        unitPrice: "",
        batchCode: "",
        expirationDate: ""
      }
    ]);
  };

  const handleRemoveItem = (index) => {
    setItems((current) => current.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    setItems((current) =>
      current.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN"
    }).format(Number(amount || 0));

  const total = items.reduce(
    (sum, item) =>
      sum + Number(item.quantity || 0) * Number(item.unitPrice || 0),
    0
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const purchaseData = {
      supplierName: supplierName.trim() || null,
      items: items.map((item) => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        batchCode: item.batchCode.trim(),
        expirationDate: item.expirationDate
      }))
    };

    onSubmit(purchaseData);
  };

  if (loading) {
    return <p>Cargando información del formulario...</p>;
  }

  if (loadError) {
    return <p>{loadError}</p>;
  }

  return (
    <form className="purchase-form"  onSubmit={handleSubmit}>
      <div className="purchase-form-section">
        <h3>Información de la compra</h3>

        <div className="purchase-form-field">
          <label htmlFor="supplierName">Nombre del proveedor (opcional)</label>
          <input
            id="supplierName"
            type="text"
            maxLength={160}
            placeholder="Ej. Distribuidora Farmacéutica"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
          />
        </div>
      </div>

      <div className="purchase-form-section">
        <div className="purchase-form-section-header">
          <div>
            <h3>Productos de la compra</h3>
            <p>Agrega los productos y sus respectivos datos de lote.</p>
          </div>

          <button
            type="button"
            className="purchase-form-add-button"
            onClick={handleAddItem}
          >
            <Plus size={17} />
            Agregar producto
          </button>
        </div>

        {items.map((item, index) => (
          <div className="purchase-form-item" key={index}>
            <div className="purchase-form-item-header">
              <strong>Producto {index + 1}</strong>

              {items.length > 1 && (
                <button
                  type="button"
                  className="purchase-form-remove-button"
                  onClick={() => handleRemoveItem(index)}
                  title="Eliminar producto"
                >
                  <Trash2 size={17} />
                </button>
              )}
            </div>

            <div className="purchase-form-grid">
              <div className="purchase-form-field purchase-form-field-full">
                <label>Producto</label>
                <select
                  value={item.productId}
                  onChange={(e) =>
                    handleItemChange(index, "productId", e.target.value)
                  }
                  required
                >
                  <option value="">Seleccionar producto</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div className="purchase-form-field">
                <label>Cantidad</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", e.target.value)
                  }
                  required
                />
              </div>

              <div className="purchase-form-field">
                <label>Precio unitario (S/)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) =>
                    handleItemChange(index, "unitPrice", e.target.value)
                  }
                  required
                />
              </div>

              <div className="purchase-form-field">
                <label>Código de lote</label>
                <input
                  type="text"
                  maxLength={80}
                  placeholder="Ej. LOTE-001"
                  value={item.batchCode}
                  onChange={(e) =>
                    handleItemChange(index, "batchCode", e.target.value)
                  }
                  required
                />
              </div>

              <div className="purchase-form-field">
                <label>Fecha de vencimiento</label>
                <input
                  type="date"
                  value={item.expirationDate}
                  onChange={(e) =>
                    handleItemChange(index, "expirationDate", e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="purchase-form-item-subtotal">
              Subtotal: {formatCurrency(
                Number(item.quantity || 0) * Number(item.unitPrice || 0)
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="purchase-form-total">
        <span>Total de la compra</span>
        <strong>{formatCurrency(total)}</strong>
      </div>

      <div className="purchase-form-actions">
        <button
          type="button"
          className="purchase-form-cancel-button"
          onClick={onCancel}
          disabled={saving}
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="purchase-form-submit-button"
          disabled={saving}
        >
          <Package size={17} />
          {saving ? "Registrando..." : "Registrar compra"}
        </button>
      </div>
    </form>
  );
};

export default PurchaseForm;
