import { useEffect, useState } from "react";
import {
    Package,
    Boxes,
    PackageX,
    Bell,
    AlertTriangle,
    CalendarClock
} from "lucide-react";

import { getInventories, getAlerts } from "../../services/api";

import "./Dashboard.css";

const Dashboard = () => {
    const [inventories, setInventories] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const [inventoryData, alertData] = await Promise.all([
                    getInventories(),
                    getAlerts()
                ]);

                setInventories(inventoryData.inventarios || []);
                setAlerts(alertData.alertas || []);
                setSummary(alertData.resumen || {});
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const totalProducts = inventories.length;

    const totalUnits = inventories.reduce(
        (total, inventory) => total + inventory.quantity,
        0
    );

    const exhaustedProducts = inventories.filter(
        (inventory) => inventory.stockStatus === "AGOTADO"
    ).length;

    const cards = [
        {
            title: "Productos registrados",
            value: totalProducts,
            icon: Package,
            color: "blue",
            description: "Productos en el catálogo"
        },
        {
            title: "Unidades disponibles",
            value: totalUnits,
            icon: Boxes,
            color: "green",
            description: "Existencias generales"
        },
        {
            title: "Productos agotados",
            value: exhaustedProducts,
            icon: PackageX,
            color: "red",
            description: "Requieren reposición"
        },
        {
            title: "Alertas pendientes",
            value: summary.total ?? 0,
            icon: Bell,
            color: "orange",
            description: "Avisos que requieren atención"
        }
    ];

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("es-PE");
    };

    if (loading) {
        return (
            <div className="dashboard-message">
                Cargando información del dashboard...
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-error">
                <AlertTriangle size={22} />
                <div>
                    <strong>No se pudo cargar el dashboard</strong>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">

            <section className="dashboard-welcome">
                <div>
                    <h2>Bienvenido a Nova Salud</h2>
                    <p>
                        Aquí puedes consultar el estado general de tu botica.
                    </p>
                </div>
            </section>

            <section className="dashboard-stats">
                {cards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <article className="dashboard-card" key={card.title}>
                            <div className={`dashboard-card-icon ${card.color}`}>
                                <Icon size={22} />
                            </div>

                            <div className="dashboard-card-info">
                                <span>{card.title}</span>
                                <h3>{card.value}</h3>
                                <p>{card.description}</p>
                            </div>
                        </article>
                    );
                })}
            </section>

            <section className="dashboard-details">

                <div className="dashboard-panel">
                    <div className="dashboard-panel-header">
                        <div>
                            <h3>Alertas recientes</h3>
                            <p>Avisos que requieren tu atención</p>
                        </div>

                        <Bell size={20} />
                    </div>

                    {alerts.length === 0 ? (
                        <div className="dashboard-empty">
                            No hay alertas pendientes.
                        </div>
                    ) : (
                        <div className="dashboard-alert-list">
                            {alerts.slice(0, 5).map((alert, index) => (
                                <div
                                    className="dashboard-alert-item"
                                    key={`${alert.type}-${alert.batchId || alert.productId}-${index}`}
                                >
                                    <div className={`dashboard-alert-icon ${
                                        alert.status === "VENCIDO" ||
                                        alert.status === "AGOTADO"
                                            ? "danger"
                                            : "warning"
                                    }`}>
                                        {alert.type === "VENCIMIENTO"
                                            ? <CalendarClock size={19} />
                                            : <PackageX size={19} />
                                        }
                                    </div>

                                    <div className="dashboard-alert-content">
                                        <strong>{alert.productName}</strong>
                                        <p>{alert.message}</p>
                                    </div>

                                    <span className={`dashboard-alert-status ${
                                        alert.status === "VENCIDO" ||
                                        alert.status === "AGOTADO"
                                            ? "danger"
                                            : "warning"
                                    }`}>
                                        {alert.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="dashboard-panel dashboard-summary">
                    <div className="dashboard-panel-header">
                        <div>
                            <h3>Resumen de alertas</h3>
                            <p>Estado actual del inventario</p>
                        </div>

                        <AlertTriangle size={20} />
                    </div>

                    <div className="dashboard-summary-item">
                        <span>Productos agotados</span>
                        <strong>{summary.agotados ?? 0}</strong>
                    </div>

                    <div className="dashboard-summary-item">
                        <span>Stock crítico</span>
                        <strong>{summary.stockCritico ?? 0}</strong>
                    </div>

                    <div className="dashboard-summary-item">
                        <span>Lotes vencidos</span>
                        <strong>{summary.vencidos ?? 0}</strong>
                    </div>

                    <div className="dashboard-summary-item">
                        <span>Lotes por vencer</span>
                        <strong>{summary.porVencer ?? 0}</strong>
                    </div>

                    <div className="dashboard-summary-total">
                        <span>Total de alertas</span>
                        <strong>{summary.total ?? 0}</strong>
                    </div>
                </div>

            </section>

            <p className="dashboard-footer">
                Información obtenida del inventario de Nova Salud.
            </p>

        </div>
    );
};

export default Dashboard;