
import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Package,
  LoaderCircle
} from "lucide-react";
import { getProducts } from "../../../services/productService";
import "./ProductSearch.css";

const ProductSearch = ({ onAddProduct, cartItems = [] }) => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProducts();
        setProducts(response.productos || []);
      } catch (err) {
        setError(err.message || "No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Esperar 300 ms después de escribir para filtrar.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const filteredProducts = products.filter((product) => {
    const searchText = debouncedSearch.toLowerCase().trim();

    if (!searchText) return false;

    const matchesName = product.name?.toLowerCase().includes(searchText);
    const matchesSku = product.sku?.toLowerCase().includes(searchText);

    return product.active && (matchesName || matchesSku);
  });

  const getCartQuantity = (productId) => {
    const item = cartItems.find(
      (cartItem) => cartItem.productId === productId
    );

    return item?.quantity || 0;
  };

  const handleAddProduct = (product) => {
    onAddProduct(product);
  };

  return (
    <section className="product-search-section">
      <div className="product-search-header">
        <div>
          <h2>Buscar productos</h2>
          <p>
            Busca por nombre o código SKU para agregar productos a la venta.
          </p>
        </div>
      </div>

      <div className="product-search-input">
        <Search size={20} />

        <input
          type="text"
          placeholder="Escribe el nombre o código del producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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

      <div className="product-search-results">
        {loading ? (
          <div className="product-search-message">
            <LoaderCircle size={20} className="search-spinner" />
            <span>Cargando productos...</span>
          </div>
        ) : error ? (
          <div className="product-search-error">{error}</div>
        ) : !debouncedSearch.trim() ? (
          <div className="product-search-message">
            <Package size={25} />
            <span>Escribe para buscar productos disponibles.</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="product-search-message">
            <Package size={25} />
            <span>No se encontraron productos.</span>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const stock = Number(product.availableStock ?? 0)
            const cartQuantity = getCartQuantity(product.id);
            const availableStock = Math.max(0, stock - cartQuantity);
            const outOfStock = availableStock <= 0;

            return (
              <div className="product-search-item" key={product.id}>
                <div className="product-search-info">
                  <strong>{product.name}</strong>
                  <span>SKU: {product.sku}</span>
                  <span>
                    Precio: S/ {Number(product.salePrice).toFixed(2)}
                  </span>
                  <span>
                    Stock: {stock} unidades
                  </span>
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
    </section>
  );
};

export default ProductSearch;
