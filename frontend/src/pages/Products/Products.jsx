
import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Package,
  Pencil,
  Power
} from "lucide-react";

import {
  getProducts,
  updateProductStatus
} from "../../services/productService";

import { getCategories } from "../../services/categoryService";

import ProductForm from "../../components/products/ProductForm";
import DataTable from "../../components/common/DataTable";
import { useToast } from "../../context/ToastContext";

import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");
  const [categoryFilter, setCategoryFilter] = useState("TODAS");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [updatingProductId, setUpdatingProductId] = useState(null);

  const { showToast } = useToast();

  // Cargar productos y categorías
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories()
      ]);

      setProducts(productsData.productos || []);
      setCategories(categoriesData.categorias || []);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Abrir formulario para registrar
  const handleNewProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  // Abrir formulario para editar
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  // Activar o desactivar producto
  const handleToggleProductStatus = async (product) => {
    const action = product.active ? "desactivar" : "activar";

    const confirmed = window.confirm(
      `¿Estás seguro de que deseas ${action} el producto "${product.name}"?`
    );

    if (!confirmed) return;

    try {
      setUpdatingProductId(product.id);

      await updateProductStatus(product.id, !product.active);

      showToast(
        `El producto "${product.name}" fue ${product.active ? "desactivado" : "activado"
        } correctamente.`,
        "success"
      );

      await loadProducts();

    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setUpdatingProductId(null);
    }
  };

  // Cerrar formulario
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  // Actualizar listado después de guardar
  const handleFormSuccess = async () => {
    handleCloseForm();
    await loadProducts();
  };

  // Buscar y filtrar productos
  const filteredProducts = products.filter((product) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      product.name.toLowerCase().includes(searchText) ||
      product.sku.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "TODOS" ||
      (statusFilter === "ACTIVOS" && product.active) ||
      (statusFilter === "INACTIVOS" && !product.active);

    const matchesCategory =
      categoryFilter === "TODAS" ||
      product.categoryId === Number(categoryFilter);

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Formatear precios
  const formatPrice = (price) => {
    return `S/ ${Number(price).toFixed(2)}`;
  };

  // Determinar estado del stock
  const getStockStatus = (product) => {
    const quantity = product.inventory?.quantity ?? 0;

    if (quantity === 0) {
      return { label: "Agotado", className: "out" };
    }

    if (quantity <= product.minStock) {
      return { label: "Crítico", className: "critical" };
    }

    if (quantity > product.maxStock) {
      return { label: "Sobrestock", className: "overstock" };
    }

    return { label: "Normal", className: "normal" };
  };

  // Columnas de la tabla
  const columns = [
    {
      key: "sku",
      label: "Código SKU",
      render: (sku) => (
        <span className="product-sku">{sku}</span>
      )
    },
    {
      key: "name",
      label: "Producto",
      render: (_, product) => (
        <div className="product-name">
          <Package size={18} />
          <span>{product.name}</span>
        </div>
      )
    },
    {
      key: "category",
      label: "Categoría",
      render: (category) => category?.name || "Sin categoría"
    },
    {
      key: "purchasePrice",
      label: "Precio compra",
      render: (price) => formatPrice(price)
    },
    {
      key: "salePrice",
      label: "Precio venta",
      render: (price) => formatPrice(price)
    },
    {
      key: "inventory",
      label: "Stock",
      render: (_, product) => {
        const quantity = product.inventory?.quantity ?? 0;
        const stockStatus = getStockStatus(product);

        return (
          <div className="product-stock">
            <span className="product-stock-quantity">
              {quantity}
            </span>

            <span className={`product-stock-status ${stockStatus.className}`}>
              {stockStatus.label}
            </span>
          </div>
        );
      }
    },
    {
      key: "active",
      label: "Estado",
      render: (active) => (
        <span className={`product-status ${active ? "active" : "inactive"}`}>
          {active ? "Activo" : "Inactivo"}
        </span>
      )
    },
    {
      key: "actions",
      label: "Acciones",
      render: (_, product) => (
        <div className="product-actions">
          <button
            type="button"
            className="product-action edit"
            onClick={() => handleEditProduct(product)}
            title="Editar producto"
          >
            <Pencil size={17} />
          </button>

          <button
            type="button"
            className="product-action status"
            onClick={() => handleToggleProductStatus(product)}
            disabled={updatingProductId === product.id}
            title={product.active ? "Desactivar producto" : "Activar producto"}
          >
            <Power size={17} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="products-page">

      <div className="products-toolbar">
        <div className="products-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Buscar por nombre o código SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          className="products-add-button"
          onClick={handleNewProduct}
        >
          <Plus size={18} />
          Nuevo producto
        </button>
      </div>

      <div className="products-filters">

        <div>
          <Package size={18} />
          <span>
            {filteredProducts.length} productos encontrados
          </span>
        </div>

        <div className="products-filter-controls">

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="TODAS">Todas las categorías</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="TODOS">Todos los estados</option>
            <option value="ACTIVOS">Activos</option>
            <option value="INACTIVOS">Inactivos</option>
          </select>

        </div>
      </div>

      {error && (
        <div className="products-message products-error">
          <span>{error}</span>

          <button type="button" onClick={loadProducts}>
            Reintentar
          </button>
        </div>
      )}

      <DataTable
        columns={columns}
        data={filteredProducts}
        loading={loading}
        emptyMessage="No se encontraron productos."
      />

      {showForm && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}

    </div>
  );
};

export default Products;
