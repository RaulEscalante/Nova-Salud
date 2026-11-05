
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Package,
  CalendarClock,
  XCircle,
  Search
} from "lucide-react";

import { getAlerts } from "../../services/alertService";
import DataTable from "../../components/common/DataTable";
import { useToast } from "../../context/ToastContext";

import "./Alerts.css";

const Alerts = () => {
  const { showToast } = useToast();

  const [summary, setSummary] = useState({
    total: 0,
    agotados: 0,
    stockCritico: 0,
    vencidos: 0,
    porVencer: 0
  });

  const [alerts, setAlerts] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("TODOS");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAlerts();

      setSummary(response.resumen || {});
      setAlerts(response.alertas || []);
    } catch (err) {
      const message = err.message || "No se pudieron cargar las alertas.";

      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const filteredAlerts = alerts.filter((alert) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      (alert.productName || "").toLowerCase().includes(searchText) ||
      (alert.sku || "").toLowerCase().includes(searchText) ||
      (alert.batchCode || "").toLowerCase().includes(searchText);

    const matchesType =
      typeFilter === "TODOS" || alert.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC"
    });
  };

  const columns = [
    {
      key: "productName",
      label: "Producto",
      render: (_, alert) => (
        <div className="alert-product-cell">
          <strong>{alert.productName}</strong>
          <span>{alert.sku}</span>
        </div>
      )
    },
    {
      key: "type",
      label: "Tipo",
      render: (value) => (
        <span className={`alert-type ${value.toLowerCase()}`}>
          {value === "STOCK" ? "Stock" : "Vencimiento"}
        </span>
      )
    },
    {
      key: "detail",
      label: "Detalle",
      render: (_, alert) => {
        if (alert.type === "STOCK") {
          return (
            <span>
              Stock actual: {alert.quantity} / Mínimo: {alert.minStock}
            </span>
          );
        }

        return (
          <div className="alert-detail-cell">
            <strong>{alert.batchCode}</strong>
            <span>Vence: {formatDate(alert.expirationDate)}</span>
          </div>
        );
      }
    },
    {
      key: "quantity",
      label: "Cantidad",
      render: (value) => `${value} unidades`
    },
    {
      key: "status",
      label: "Estado",
      render: (value) => {
        const statusConfig = {
          AGOTADO: { label: "Agotado", className: "agotado" },
          CRITICO: { label: "Stock crítico", className: "critico" },
          VENCIDO: { label: "Vencido", className: "vencido" },
          "POR VENCER": { label: "Por vencer", className: "por-vencer" }
        };

        const status = statusConfig[value] || {
          label: value || "Sin estado",
          className: ""
        };

        return (
          <span className={`alert-status ${status.className}`}>
            {status.label}
          </span>
        );
      }
    },
    {
      key: "message",
      label: "Mensaje",
      render: (value) => (
        <span className="alert-message">{value}</span>
      )
    }
  ];

  return (
    <div className="alerts-page">
      

      <div className="alerts-summary">
        <div className="alert-summary-card">
          <div className="alert-summary-icon total">
            <AlertTriangle size={21} />
          </div>
          <div>
            <span>Total de alertas</span>
            <strong>{summary.total}</strong>
          </div>
        </div>

        <div className="alert-summary-card">
          <div className="alert-summary-icon stock">
            <Package size={21} />
          </div>
          <div>
            <span>Productos agotados</span>
            <strong>{summary.agotados}</strong>
          </div>
        </div>

        <div className="alert-summary-card">
          <div className="alert-summary-icon critical">
            <XCircle size={21} />
          </div>
          <div>
            <span>Stock crítico</span>
            <strong>{summary.stockCritico}</strong>
          </div>
        </div>

        <div className="alert-summary-card">
          <div className="alert-summary-icon expired">
            <CalendarClock size={21} />
          </div>
          <div>
            <span>Lotes vencidos</span>
            <strong>{summary.vencidos}</strong>
          </div>
        </div>

        <div className="alert-summary-card">
          <div className="alert-summary-icon expiring">
            <CalendarClock size={21} />
          </div>
          <div>
            <span>Por vencer</span>
            <strong>{summary.porVencer}</strong>
          </div>
        </div>
      </div>

      <div className="alerts-toolbar">
        <div className="alerts-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por producto, SKU o lote..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="alerts-filter"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="TODOS">Todas las alertas</option>
          <option value="STOCK">Stock</option>
          <option value="VENCIMIENTO">Vencimientos</option>
        </select>
      </div>

      {error && <div className="alerts-error">{error}</div>}

      <DataTable
        columns={columns}
        data={filteredAlerts}
        loading={loading}
        emptyMessage="No se encontraron alertas."
        rowKey={(alert) =>
          alert.type === "STOCK"
            ? `STOCK-${alert.productId}`
            : `VENCIMIENTO-${alert.batchId}`
        }
      />

      <div className="alerts-count">
        Mostrando {filteredAlerts.length} de {alerts.length} alertas
      </div>
    </div>
  );
};

export default Alerts;
