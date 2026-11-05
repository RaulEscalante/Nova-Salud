
import { useEffect, useState } from "react";
import { Plus, Search, Eye } from "lucide-react";

import { getPurchases, getPurchaseById, createPurchase } from "../../services/purchaseService";
import Modal from "../../components/common/Modal";
import PurchaseDetail from "../../components/purchases/PurchaseDetail";
import { useToast } from "../../context/ToastContext";
import PurchaseForm from "../../components/purchases/PurchaseForm";

import DataTable from "../../components/common/DataTable";

import "./Purchases.css";

const Purchases = () => {
  const { showToast } = useToast();

  const [purchases, setPurchases] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Cargar compras
  const loadPurchases = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getPurchases();

      setPurchases(response.compras || []);
    } catch (err) {
      const message = err.message || "No se pudieron cargar las compras.";

      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Consultar detalle de una compra
  const handleViewDetail = async (id) => {
    try {
      setDetailLoading(true);

      const response = await getPurchaseById(id);

      setSelectedPurchase(response.compra);
    } catch (err) {
      showToast(
        err.message || "No se pudo consultar el detalle de la compra.",
        "error"
      );
    } finally {
      setDetailLoading(false);
    }
  };

  // Cerrar detalle
  const handleCloseDetail = () => {
    setSelectedPurchase(null);
  };

  useEffect(() => {
    loadPurchases();
  }, []);

  // Filtrar compras
  const filteredPurchases = purchases.filter((purchase) => {
    const searchText = search.toLowerCase().trim();

    const purchaseNumber = String(purchase.id);
    const supplierName = purchase.supplierName || "Sin proveedor";

    return (
      purchaseNumber.includes(searchText) ||
      supplierName.toLowerCase().includes(searchText)
    );
  });

  const handleCreatePurchase = async (purchaseData) => {
    try {
      setSaving(true);

      const response = await createPurchase(purchaseData);

      showToast(
        response.mensaje || "Compra registrada correctamente.",
        "success"
      );

      setShowForm(false);
      await loadPurchases();
    } catch (err) {
      showToast(
        err.message || "No se pudo registrar la compra.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // Formatear fecha
  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  // Formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN"
    }).format(Number(amount || 0));
  };

  // Columnas de la tabla
  const columns = [
    {
      key: "id",
      label: "N.º compra",
      render: (value) => `COMP-${String(value).padStart(4, "0")}`
    },
    {
      key: "supplierName",
      label: "Proveedor",
      render: (value) => value || "Sin proveedor"
    },
    {
      key: "createdAt",
      label: "Fecha",
      render: (value) => formatDate(value)
    },
    {
      key: "details",
      label: "Productos",
      render: (value) => value?.length || 0
    },
    {
      key: "total",
      label: "Total",
      render: (value) => formatCurrency(value)
    },
    {
      key: "actions",
      label: "Acciones",
      render: (_, purchase) => (
        <button
          type="button"
          className="purchase-action-button"
          title="Ver detalle"
          onClick={() => handleViewDetail(purchase.id)}
        >
          <Eye size={17} />
        </button>
      )
    }
  ];

  return (
    <div className="purchases-page">
      <div className="purchases-header">
        <div>
          <h1>Compras a proveedores</h1>
          <p>Registra y consulta las compras realizadas para abastecer el inventario.</p>
        </div>

        <button
          type="button"
          className="purchases-create-button"
          onClick={() => setShowForm(true)}
        >
          <Plus size={18} />
          Nueva compra
        </button>
      </div>

      <div className="purchases-toolbar">
        <div className="purchases-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Buscar por número de compra o proveedor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <span className="purchases-count">
          {filteredPurchases.length} compras registradas
        </span>
      </div>

      {error && (
        <div className="purchases-error">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={filteredPurchases}
        loading={loading}
        emptyMessage="No se encontraron compras registradas."
        rowKey="id"
      />
      {detailLoading && (
        <Modal
          title="Detalle de compra"
          onClose={handleCloseDetail}
        >
          <p>Consultando información de la compra...</p>
        </Modal>
      )}

      {showForm && (
        <Modal
          title="Registrar nueva compra"
          onClose={() => !saving && setShowForm(false)}
          className="purchase-form-modal"
        >
          <PurchaseForm
            onSubmit={handleCreatePurchase}
            onCancel={() => setShowForm(false)}
            saving={saving}
          />
        </Modal>
      )}

      {selectedPurchase && (
        <Modal
          title={`Detalle de compra - COMP-${String(selectedPurchase.id).padStart(4, "0")}`}
          onClose={handleCloseDetail}
          className="purchase-detail-modal"
        >
          <PurchaseDetail purchase={selectedPurchase} />
        </Modal>
      )}
    </div>
  );
};

export default Purchases;
