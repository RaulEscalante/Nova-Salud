
import { useEffect, useState } from "react";
import { Eye, Receipt, LoaderCircle } from "lucide-react";

import { getSales } from "../../../services/saleService";
import DataTable from "../../../components/common/DataTable";

import "./SalesHistory.css";

const SalesHistory = ({ onViewDetail, refreshKey = 0 }) => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadSales = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getSales();
                setSales(response.ventas || []);
            } catch (err) {
                setError(
                    err.message || "No se pudo cargar el historial de ventas."
                );
            } finally {
                setLoading(false);
            }
        };

        loadSales();
    }, [refreshKey]);

    const formatDate = (date) => {
        return new Date(date).toLocaleString("es-PE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("es-PE", {
            style: "currency",
            currency: "PEN"
        }).format(Number(amount));
    };

    const columns = [
        {
            key: "id",
            label: "N.º Venta",
            render: (value) => `V-${String(value).padStart(5, "0")}`
        },
        {
            key: "createdAt",
            label: "Fecha",
            render: (value) => formatDate(value)
        },
        {
            key: "details",
            label: "Productos",
            render: (details) => details.reduce(
                (total, detail) => total + detail.quantity,
                0
            )
        },
        {
            key: "total",
            label: "Total",
            render: (value) => formatCurrency(value)
        },
        {
            key: "actions",
            label: "Acciones",
            render: (_, sale) => (
                <button
                    type="button"
                    className="sale-detail-button"
                    onClick={() => onViewDetail(sale.id)}
                    title="Ver detalle"
                >
                    <Eye size={17} />
                    <span>Ver detalle</span>
                </button>
            )
        }
    ];

    if (error) {
        return (
            <div className="sales-history-state sales-history-error">
                {error}
            </div>
        );
    }

    return (
        <section className="sales-history">
            <div className="sales-history-header">
                <div className="sales-history-title">
                    <Receipt size={20} />
                    <h2>Historial de ventas</h2>
                </div>

                <span className="sales-history-count">
                    {sales.length} {sales.length === 1
                        ? "venta registrada"
                        : "ventas registradas"}
                </span>
            </div>

            {loading ? (
                <div className="sales-history-state">
                    <LoaderCircle size={22} className="loading-spinner" />
                    <span>Cargando historial de ventas...</span>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={sales}
                    emptyMessage="Todavía no hay ventas registradas."
                />
            )}
        </section>
    );
};

export default SalesHistory;
