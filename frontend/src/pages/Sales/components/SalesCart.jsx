
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ShoppingBag
} from "lucide-react";

import "./SalesCart.css";

const SalesCart = ({
  items = [],
  onUpdateQuantity,
  onRemoveProduct,
  onConfirmSale,
  saving = false
}) => {
  const total = items.reduce(
    (sum, item) => sum + Number(item.salePrice) * item.quantity,
    0
  );

  return (
    <section className="sales-cart-section">
      <div className="sales-cart-header">
        <div>
          <h2>Productos de la venta</h2>
          <p>{items.length} productos agregados</p>
        </div>

        <div className="sales-cart-icon">
          <ShoppingCart size={21} />
        </div>
      </div>

      <div className="sales-cart-content">
        {items.length === 0 ? (
          <div className="sales-cart-empty">
            <ShoppingBag size={35} />
            <strong>El carrito está vacío</strong>
            <span>Busca y agrega productos para comenzar la venta.</span>
          </div>
        ) : (
          items.map((item) => {
            const subtotal = Number(item.salePrice) * item.quantity;

            return (
              <div className="sales-cart-item" key={item.productId}>
                <div className="sales-cart-item-info">
                  <strong>{item.name}</strong>
                  <span>SKU: {item.sku}</span>
                  <span>
                    S/ {Number(item.salePrice).toFixed(2)} por unidad
                  </span>
                </div>

                <div className="sales-cart-item-controls">
                  <div className="sales-quantity-control">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateQuantity(item.productId, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1 || saving}
                      aria-label="Disminuir cantidad"
                    >
                      <Minus size={14} />
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() =>
                        onUpdateQuantity(item.productId, item.quantity + 1)
                      }
                      disabled={saving}
                      aria-label="Aumentar cantidad"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <strong className="sales-cart-subtotal">
                    S/ {subtotal.toFixed(2)}
                  </strong>

                  <button
                    type="button"
                    className="sales-cart-remove"
                    onClick={() => onRemoveProduct(item.productId)}
                    disabled={saving}
                    aria-label="Eliminar producto"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="sales-cart-footer">
        <div className="sales-cart-total">
          <span>Total de venta</span>
          <strong>S/ {total.toFixed(2)}</strong>
        </div>

        <button
          type="button"
          className="sales-confirm-button"
          onClick={onConfirmSale}
          disabled={items.length === 0 || saving}
        >
          {saving ? "Registrando venta..." : "Confirmar venta"}
        </button>
      </div>
    </section>
  );
};

export default SalesCart;
