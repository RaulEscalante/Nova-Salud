
import { useEffect, useState } from "react";
import {
    CalendarDays,
    Hash,
    Package,
    LoaderCircle,
    Receipt
} from "lucide-react";

import { getSaleById } from "../../../services/saleService";
import Modal from "../../../components/common/Modal";

import "./SaleDetail.css";

const SaleDetail = ({ saleId, onClose }) => {
    const [sale, setSale] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const loadSale = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getSaleById(saleId);

                if (!cancelled) {
                    setSale(response.venta);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.message || "No se pudo cargar el detalle de la venta."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        if (saleId) {
            loadSale();
        }

        return () => {
            cancelled = true;
        };
    }, [saleId]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("es-PE", {
            style: "currency",
            currency: "PEN"
        }).format(Number(amount));
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString("es-PE", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const saleNumber = `V-${String(saleId).padStart(5, "0")}`;

    return (
        <Modal
            title={`Detalle de venta ${saleNumber}`}
            onClose={onClose}
            className="sale-detail-modal"
        >
            {loading ? (
                <div className="sale-detail-state">
                    <LoaderCircle size={24} className="loading-spinner" />
                    <span>Cargando detalle de la venta...</span>
                </div>
            ) : error ? (
                <div className="sale-detail-error">
                    {error}
                </div>
            ) : sale ? (
                <div className="sale-detail-content">

                    <div className="sale-detail-information">
                        <div className="sale-detail-info-item">
                            <div className="sale-detail-info-icon">
                                <Hash size={18} />
                            </div>

                            <div>
                                <span>Número de venta</span>
                                <strong>
                                    V-{String(sale.id).padStart(5, "0")}
                                </strong>
                            </div>
                        </div>

                        <div className="sale-detail-info-item">
                            <div className="sale-detail-info-icon">
                                <CalendarDays size={18} />
                            </div>

                            <div>
                                <span>Fecha de registro</span>
                                <strong>{formatDate(sale.createdAt)}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="sale-detail-products">
                        <div className="sale-detail-section-title">
                            <Package size={19} />
                            <h3>Productos vendidos</h3>
                        </div>

                        <div className="sale-detail-table-container">
                            <table className="sale-detail-table">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Precio unitario</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {sale.details.map((detail) => (
                                        <tr key={detail.id}>
                                            <td>
                                                <div className="sale-detail-product-name">
                                                    <strong>
                                                        {detail.product.name}
                                                    </strong>
                                                    <span>
                                                        SKU: {detail.product.sku}
                                                    </span>
                                                </div>
                                            </td>

                                            <td>{detail.quantity}</td>

                                            <td>
                                                {formatCurrency(detail.unitPrice)}
                                            </td>

                                            <td className="sale-detail-subtotal">
                                                {formatCurrency(detail.subtotal)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="sale-detail-total">
                        <div>
                            <Receipt size={19} />
                            <span>Total de la venta</span>
                        </div>

                        <strong>{formatCurrency(sale.total)}</strong>
                    </div>

                </div>
            ) : null}
        </Modal>
    );
};

export default SaleDetail;
