
import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Package,
  LoaderCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { getProducts } from "../../../services/productService";
import "./ProductSearch.css";

const PAGE_SIZE = 10;

const ProductSearch = ({ onAddProduct, cartItems = [], refreshKey = 0 }) => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    pagina: 1,
    limite: PAGE_SIZE,
    total: 0,
    totalPaginas: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Esperar 300 ms después de escribir
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Consultar productos paginados
  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProducts({
          page,
          limit: PAGE_SIZE,
          search: debouncedSearch,
          order
        });

        if (cancelled) return;

        setProducts(
          (response.productos || []).filter(
            (product) =>
              product.active &&
              Number(product.availableStock) > 0
          )
        );

        setPagination(response.paginacion);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "No se pudieron cargar los productos.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [page, debouncedSearch, order, refreshKey]);

  const getCartQuantity = (productId) => {
    const item = cartItems.find(
      (cartItem) => cartItem.productId === productId
    );

    return item?.quantity || 0;
  };

  const handleChangeOrder = (newOrder) => {
    setOrder(newOrder);
    setPage(1);
  };

  const handleChangeSearch = (value) => {
    setSearch(value);
  };

  const handleAddProduct = (product) => {
    onAddProduct(product);
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN"
    }).format(Number(amount));

  return (
    <section className="product-search-section">
      <div className="product-search-header">
        <div>
          <h2>Productos disponibles</h2>
          <p>
            Selecciona productos o busca por nombre y código SKU.
          </p>
        </div>
      </div>

      <div className="product-search-input">
        <Search size={20} />

        <input
          type="text"
          placeholder="Escribe el nombre o código del producto..."
          value={search}
          onChange={(e) => handleChangeSearch(e.target.value)}
        />

        {search && (
          <button
            type="button"
            className="product-search-clear"
            onClick={() => setSearch("")}
          >
            Limpiar
          </button>
        )}
      </div>

      <div className="product-search-toolbar">
        <span>Ordenar por nombre:</span>

        <select
          value={order}
          onChange={(e) => handleChangeOrder(e.target.value)}
        >
          <option value="asc">A - Z</option>
          <option value="desc">Z - A</option>
        </select>
      </div>

      <div className="product-search-results">
        {loading ? (
          <div className="product-search-message">
            <LoaderCircle size={20} className="search-spinner" />
            <span>Cargando productos...</span>
          </div>
        ) : error ? (
          <div className="product-search-error">{error}</div>
        ) : products.length === 0 ? (
          <div className="product-search-message">
            <Package size={25} />
            <span>
              {debouncedSearch
                ? "No se encontraron productos disponibles."
                : "No hay productos con existencias disponibles."}
            </span>
          </div>
        ) : (
          products.map((product) => {
            const stock = Number(product.availableStock ?? 0);
            const cartQuantity = getCartQuantity(product.id);
            const availableStock = Math.max(0, stock - cartQuantity);
            const outOfStock = availableStock <= 0;

            return (
              <div className="product-search-item" key={product.id}>
                <div className="product-search-info">
                  <strong>{product.name}</strong>
                  <span>SKU: {product.sku}</span>
                  <span>Precio: {formatCurrency(product.salePrice)}</span>
                  <span>Stock: {stock} unidades</span>
                </div>

                <div className="product-search-actions">
                  {cartQuantity > 0 && (
                    <span className="product-cart-indicator">
                      {cartQuantity} en carrito
                    </span>
                  )}

                  <button
                    type="button"
                    className={`product-add-button ${outOfStock ? "out-of-stock" : ""}`}
                    onClick={() => handleAddProduct(product)}
                    disabled={outOfStock}
                    title={
                      outOfStock
                        ? "No hay existencias disponibles"
                        : "Agregar producto"
                    }
                  >
                    {outOfStock ? (
                      "Sin stock"
                    ) : (
                      <>
                        <Plus size={17} />
                        Agregar
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {!loading && !error && pagination.total > 0 && (
        <div className="product-search-pagination">
          <span>
            Mostrando {products.length} de {pagination.total} productos
          </span>

          <div className="product-pagination-controls">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1}
              title="Página anterior"
            >
              <ChevronLeft size={18} />
            </button>

            <span>
              Página {page} de {pagination.totalPaginas}
            </span>

            <button
              type="button"
              onClick={() =>
                setPage((current) =>
                  Math.min(pagination.totalPaginas, current + 1)
                )
              }
              disabled={page >= pagination.totalPaginas}
              title="Página siguiente"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductSearch;
