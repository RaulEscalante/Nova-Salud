
import { useEffect, useState } from "react";
import { Search, Boxes } from "lucide-react";

import { getInventories } from "../../services/api";
import DataTable from "../../components/common/DataTable";

import "./Inventory.css";

const Inventory = () => {
  const [inventories, setInventories] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cargar inventario
  const loadInventories = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getInventories();
      setInventories(data.inventarios || []);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventories();
  }, []);

  // Buscar y filtrar inventario
  const filteredInventories = inventories.filter((inventory) => {
    const product = inventory.product;

    const searchText = search.toLowerCase();

    const matchesSearch =
      product.name.toLowerCase().includes(searchText) ||
      product.sku.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "TODOS" ||
      inventory.stockStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Formatear fecha
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("es-PE");
  };

  // Configurar apariencia del estado
  const getStatusInfo = (status) => {
    const statuses = {
      AGOTADO: {
        label: "Agotado",
        className: "out"
      },
      CRITICO: {
        label: "Crítico",
        className: "critical"
      },
      NORMAL: {
        label: "Normal",
        className: "normal"
      },
      SOBRESTOCK: {
        label: "Sobrestock",
        className: "overstock"
      }
    };

    return statuses[status] || {
      label: status || "Sin estado",
      className: "unknown"
    };
  };

  // Columnas de la tabla
  const columns = [
    {
      key: "product",
      label: "Producto",
      render: (product) => (
        <div className="inventory-product">
          <span className="inventory-product-icon">
            <Boxes size={18} />
          </span>

          <div>
            <strong>{product.name}</strong>
            <span>{product.sku}</span>
          </div>
        </div>
      )
    },
    {
      key: "product",
      label: "Categoría",
      render: (product) => (
        <span className="inventory-category">
          {product.category?.name || "Sin categoría"}
        </span>
      )
    },
    {
      key: "quantity",
      label: "Stock actual",
      render: (quantity) => (
        <span className="inventory-quantity">
          {quantity} unidades
        </span>
      )
    },
    {
      key: "product",
      label: "Stock mínimo",
      render: (product) => product.minStock
    },
    {
      key: "product",
      label: "Stock máximo",
      render: (product) => product.maxStock
    },
    {
      key: "stockStatus",
      label: "Estado",
      render: (status) => {
        const statusInfo = getStatusInfo(status);

        return (
          <span className={`inventory-status ${statusInfo.className}`}>
            {statusInfo.label}
          </span>
        );
      }
    },
    {
      key: "updatedAt",
      label: "Última actualización",
      render: (date) => formatDate(date)
    }
  ];

  return (
    <div className="inventory-page">

      <div className="inventory-toolbar">

        <div className="inventory-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Buscar por nombre o código SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

      </div>

      <div className="inventory-filters">

        <div>
          <Boxes size={18} />

          <span>
            {filteredInventories.length} productos encontrados
          </span>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="TODOS">Todos los estados</option>
          <option value="NORMAL">Normal</option>
          <option value="CRITICO">Crítico</option>
          <option value="AGOTADO">Agotado</option>
          <option value="SOBRESTOCK">Sobrestock</option>
        </select>

      </div>

      {error && (
        <div className="inventory-message inventory-error">
          <span>{error}</span>

          <button type="button" onClick={loadInventories}>
            Reintentar
          </button>
        </div>
      )}

      <DataTable
        columns={columns}
        data={filteredInventories}
        loading={loading}
        emptyMessage="No se encontraron productos en el inventario."
      />

    </div>
  );
};

export default Inventory;
