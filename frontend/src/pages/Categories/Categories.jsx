
import { useEffect, useState } from "react";
import { Search, Plus, Tags, Pencil, Power } from "lucide-react";

import { getCategories, updateCategoryStatus } from "../../services/categoryService";
import CategoryForm from "../../components/categories/CategoryForm";
import DataTable from "../../components/common/DataTable";
import { useToast } from "../../context/ToastContext";

import "./Categories.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODAS");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [updatingCategoryId, setUpdatingCategoryId] = useState(null);
  const { showToast } = useToast();

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCategories();
      setCategories(data.categorias || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleNewCategory = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };


  const handleToggleCategoryStatus = async (category) => {
    const action = category.active ? "desactivar" : "activar";
    const confirmed = window.confirm(
      `¿Estás seguro de que deseas ${action} la categoría "${category.name}"?`
    );

    if (!confirmed) return;

    try {
      setUpdatingCategoryId(category.id);
      setError("");
      await updateCategoryStatus(category.id, !category.active);
      showToast(
        `La categoría "${category.name}" fue ${category.active ? "desactivada" : "activada"} correctamente.`,
        "success"
      );

      await loadCategories();
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setUpdatingCategoryId(null);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleFormSuccess = async () => {
    handleCloseForm();
    await loadCategories();
  };

  const filteredCategories = categories.filter((category) => {
    const matchesSearch = category.name.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "TODAS" ||
      (statusFilter === "ACTIVAS" && category.active) ||
      (statusFilter === "INACTIVAS" && !category.active);

    return matchesSearch && matchesStatus;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-PE");
  };
  const columns = [
    {
      key: "name",
      label: "Nombre",
      render: (_, category) => (
        <div className="category-name">
          <Tags size={18} />
          <span>{category.name}</span>
        </div>
      )
    },
    {
      key: "createdAt",
      label: "Fecha de creación",
      render: (date) => formatDate(date)
    },
    {
      key: "updatedAt",
      label: "Última actualización",
      render: (date) => formatDate(date)
    },
    {
      key: "active",
      label: "Estado",
      render: (active) => (
        <span className={`category-status ${active ? "active" : "inactive"}`}>
          {active ? "Activa" : "Inactiva"}
        </span>
      )
    },
    {
      key: "actions",
      label: "Acciones",
      render: (_, category) => (
        <div className="category-actions">
          <button type="button" className="category-action edit"
            onClick={() => handleEditCategory(category)} title="Editar categoría">
            <Pencil size={17} />
          </button>

          <button type="button" className="category-action status"
            onClick={() => handleToggleCategoryStatus(category)}
            disabled={updatingCategoryId === category.id}
            title={category.active ? "Desactivar categoría" : "Activar categoría"}
          >
            <Power size={17} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="categories-page">

      <div className="categories-toolbar">
        <div className="categories-search">
          <Search size={18} />
          <input type="text" placeholder="Buscar categoría..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <button className="categories-add-button" onClick={handleNewCategory}>
          <Plus size={18} />
          Nueva categoría
        </button>
      </div>

      <div className="categories-filters">
        <div>
          <Tags size={18} />
          <span>
            {filteredCategories.length} categorías encontradas
          </span>
        </div>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="TODAS">Todos los estados</option>
          <option value="ACTIVAS">Activas</option>
          <option value="INACTIVAS">Inactivas</option>
        </select>
      </div>

      {error && (
        <div className="categories-message categories-error">
          <span>{error}</span>
          <button type="button" onClick={loadCategories}>
            Reintentar
          </button>
        </div>
      )}

      <DataTable
        columns={columns}
        data={filteredCategories}
        loading={loading}
        emptyMessage="No se encontraron categorías."
      />

      {showForm && (
        <CategoryForm category={editingCategory} onClose={handleCloseForm} onSuccess={handleFormSuccess} />
      )}
    </div>
  );
};

export default Categories;
