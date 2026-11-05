
import { CalendarDays, Truck, Package, Hash } from "lucide-react";

import "./PurchaseDetail.css";

const PurchaseDetail = ({ purchase }) => {
  if (!purchase) return null;

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN"
    }).format(Number(amount || 0));
  };

  const details = purchase.details || [];

  return (
    <div className="purchase-detail">

      {/* Información general */}
      <div className="purchase-detail-info">
        <div className="purchase-detail-info-item">
          <Truck size={18} />

          <div>
            <span>Proveedor</span>
            <strong>{purchase.supplierName || "Sin proveedor"}</strong>
          </div>
        </div>

        <div className="purchase-detail-info-item">
          <CalendarDays size={18} />

          <div>
            <span>Fecha de registro</span>
            <strong>{formatDate(purchase.createdAt)}</strong>
          </div>
        </div>

        <div className="purchase-detail-info-item">
          <Package size={18} />

          <div>
            <span>Productos registrados</span>
            <strong>{details.length}</strong>
          </div>
        </div>
      </div>

      {/* Productos */}
      <div className="purchase-detail-products">
        <h3>Productos de la compra</h3>

        {details.length > 0 ? (
          <div className="purchase-detail-table-container">
            <table className="purchase-detail-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Lote</th>
                  <th>Vencimiento</th>
                  <th>Cantidad</th>
                  <th>Precio unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>

              <tbody>
                {details.map((detail) => (
                  <tr key={detail.id}>
                    <td>
                      <div className="purchase-detail-product-name">
                        <Package size={16} />
                        <span>
                          {detail.product?.name || "Producto no disponible"}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className="purchase-detail-batch">
                        <Hash size={13} />
                        {detail.batch?.batchCode || "—"}
                      </span>
                    </td>

                    <td>{formatDate(detail.batch?.expirationDate)}</td>

                    <td>{detail.quantity}</td>

                    <td>{formatCurrency(detail.unitPrice)}</td>

                    <td className="purchase-detail-subtotal">
                      {formatCurrency(detail.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="purchase-detail-empty">
            Esta compra no tiene productos registrados.
          </p>
        )}
      </div>

      {/* Total */}
      <div className="purchase-detail-total">
        <span>Total de la compra</span>
        <strong>{formatCurrency(purchase.total)}</strong>
      </div>

    </div>
  );
};

export default PurchaseDetail;
