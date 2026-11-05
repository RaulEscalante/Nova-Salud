
import { useEffect, useState } from "react";
import {
  Package,
  AlertTriangle,
  CalendarClock,
  Search
} from "lucide-react";

import { getBatches } from "../../services/batchService";
import DataTable from "../../components/common/DataTable";
import { useToast } from "../../context/ToastContext";

import "./Batches.css";

const Batches = () => {
  const { showToast } = useToast();

  const [batches, setBatches] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBatches = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getBatches();
      setBatches(response.lotes || []);
    } catch (err) {
      const message = err.message || "No se pudieron cargar los lotes.";

      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBatches();
  }, []);

  // Formato de fechas
  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC"
    });
  };

  // Indicadores
  const totalBatches = batches.length;

  const expiringBatches = batches.filter(
    (batch) => batch.expirationStatus === "POR VENCER"
  ).length;

  const expiredBatches = batches.filter(
    (batch) => batch.expirationStatus === "VENCIDO"
  ).length;

  // Búsqueda y filtros
  const filteredBatches = batches.filter((batch) => {
    const searchText = search.toLowerCase().trim();

    const productName = batch.product?.name || "";
    const sku = batch.product?.sku || "";
    const batchCode = batch.batchCode || "";

    const matchesSearch =
      productName.toLowerCase().includes(searchText) ||
      sku.toLowerCase().includes(searchText) ||
      batchCode.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "TODOS" ||
      batch.expirationStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Columnas
  const columns = [
    {
      key: "product",
      label: "Producto",
      render: (_, batch) => (
        <div className="batch-product-cell">
          <strong>{batch.product?.name || "Producto no disponible"}</strong>
          <span>{batch.product?.sku || "Sin SKU"}</span>
        </div>
      )
    },
    {
      key: "category",
      label: "Categoría",
      render: (_, batch) =>
        batch.product?.category?.name || "Sin categoría"
    },
    {
      key: "batchCode",
      label: "Código de lote"
    },
    {
      key: "quantity",
      label: "Cantidad",
      render: (value) => (
        <span className="batch-quantity">{value} unidades</span>
      )
    },
    {
      key: "expirationDate",
      label: "Vencimiento",
      render: (value) => formatDate(value)
    },
    {
      key: "expirationStatus",
      label: "Estado",
      render: (value) => {
        const statusConfig = {
          VIGENTE: {
            label: "Vigente",
            className: "vigente"
          },
          "POR VENCER": {
            label: "Por vencer",
            className: "por-vencer"
          },
          VENCIDO: {
            label: "Vencido",
            className: "vencido"
          }
        };

        const status = statusConfig[value] || {
          label: value || "Sin estado",
          className: ""
        };

        return (
          <span className={`batch-status ${status.className}`}>
            {status.label}
          </span>
        );
      }
    }
  ];

  return (
    <div className="batches-page">

      {/* Indicadores */}
      <div className="batches-summary">
        <div className="batch-summary-card">
          <div className="batch-summary-icon total">
            <Package size={21} />
          </div>
          <div>
            <span>Total de lotes</span>
            <strong>{totalBatches}</strong>
          </div>
        </div>

        <div className="batch-summary-card">
          <div className="batch-summary-icon expiring">
            <CalendarClock size={21} />
          </div>
          <div>
            <span>Por vencer</span>
            <strong>{expiringBatches}</strong>
          </div>
        </div>

        <div className="batch-summary-card">
          <div className="batch-summary-icon expired">
            <AlertTriangle size={21} />
          </div>
          <div>
            <span>Vencidos</span>
            <strong>{expiredBatches}</strong>
          </div>
        </div>
      </div>

      {/* Herramientas */}
      <div className="batches-toolbar">
        <div className="batches-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por producto, SKU o código de lote..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="batches-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="TODOS">Todos los estados</option>
          <option value="VIGENTE">Vigentes</option>
          <option value="POR VENCER">Por vencer</option>
          <option value="VENCIDO">Vencidos</option>
        </select>
      </div>

      {error && (
        <div className="batches-error">
          {error}
        </div>
      )}

      {/* Tabla */}
      <DataTable
        columns={columns}
        data={filteredBatches}
        loading={loading}
        emptyMessage="No se encontraron lotes registrados."
        rowKey="id"
      />

      <div className="batches-count">
        Mostrando {filteredBatches.length} de {totalBatches} lotes
      </div>
    </div>
  );
};

export default Batches;
