
import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Receipt,
  LoaderCircle,
  Search,
  CalendarDays,
  X
} from "lucide-react";

import { getSales } from "../../../services/saleService";
import DataTable from "../../../components/common/DataTable";
import SaleDetail from "./SaleDetail";

import "./SalesHistory.css";

const SalesHistory = ({ refreshKey = 0 }) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSaleId, setSelectedSaleId] = useState(null);

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadSales = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getSales();

        if (!cancelled) {
          setSales(response.ventas || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message || "No se pudo cargar el historial de ventas."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadSales();

    return () => {
      cancelled = true;
    };
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

  const getLocalDate = (date) => {
    const parsedDate = new Date(date);

    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const filteredSales = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase()
      .replace(/^v-?/i, "");

    return sales.filter((sale) => {
      const saleNumber = String(sale.id).padStart(5, "0");

      const matchesSearch =
        !normalizedSearch ||
        saleNumber.includes(normalizedSearch) ||
        String(sale.id).includes(normalizedSearch);

      const saleDate = getLocalDate(sale.createdAt);

      const matchesStartDate =
        !startDate || saleDate >= startDate;

      const matchesEndDate =
        !endDate || saleDate <= endDate;

      return (
        matchesSearch &&
        matchesStartDate &&
        matchesEndDate
      );
    });
  }, [sales, search, startDate, endDate]);

  const clearFilters = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
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
          onClick={() => setSelectedSaleId(sale.id)}
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
    <>
      <section className="sales-history">
        <div className="sales-history-header">
          <div className="sales-history-title">
            <Receipt size={20} />
            <h2>Historial de ventas</h2>
          </div>

          <span className="sales-history-count">
            {filteredSales.length} de {sales.length}{" "}
            {sales.length === 1
              ? "venta registrada"
              : "ventas registradas"}
          </span>
        </div>

        <div className="sales-history-filters">

          <div className="sales-history-search">
            <Search size={19} />

            <input
              type="text"
              placeholder="Buscar por número de venta..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="sales-history-date-filter">
            <CalendarDays size={18} />

            <label htmlFor="sales-start-date">
              Desde
            </label>

            <input
              id="sales-start-date"
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="sales-history-date-filter">
            <CalendarDays size={18} />

            <label htmlFor="sales-end-date">
              Hasta
            </label>

            <input
              id="sales-end-date"
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {(search || startDate || endDate) && (
            <button
              type="button"
              className="sales-history-clear"
              onClick={clearFilters}
            >
              <X size={16} />
              Limpiar
            </button>
          )}

        </div>

        {loading ? (
          <div className="sales-history-state">
            <LoaderCircle size={22} className="loading-spinner" />
            <span>Cargando historial de ventas...</span>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredSales}
            emptyMessage={
              sales.length === 0
                ? "Todavía no hay ventas registradas."
                : "No se encontraron ventas con los filtros seleccionados."
            }
          />
        )}
      </section>

      {selectedSaleId !== null && (
        <SaleDetail
          saleId={selectedSaleId}
          onClose={() => setSelectedSaleId(null)}
        />
      )}
    </>
  );
};

export default SalesHistory;

