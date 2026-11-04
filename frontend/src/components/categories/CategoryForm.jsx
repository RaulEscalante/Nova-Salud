
import { useState } from "react";
import { Save, X } from "lucide-react";

import Modal from "../common/Modal";
import { createCategory, updateCategory } from "../../services/categoryService";
import { useToast } from "../../context/ToastContext";

import "./CategoryForm.css";

const CategoryForm = ({ category, onClose, onSuccess }) => {
  const isEditing = Boolean(category);

  const [name, setName] = useState(category?.name || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();


  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("El nombre de la categoría es obligatorio.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const categoryData = {
        name: trimmedName
      };

      if (isEditing) {
        await updateCategory(category.id, categoryData);
        showToast(
          `La categoría "${trimmedName}" fue actualizada correctamente.`,
          "success"
        );
      } else {
        await createCategory(categoryData);
        showToast(
          `La categoría "${trimmedName}" fue registrada correctamente.`,
          "success"
        );
      }

      onSuccess();
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Modal
      title={isEditing ? "Editar categoría" : "Nueva categoría"}
      onClose={onClose}
    >
      <form className="category-form" onSubmit={handleSubmit}>

        <div className="category-form-group">
          <label htmlFor="category-name">
            Nombre de la categoría
          </label>

          <input
            id="category-name"
            type="text"
            placeholder="Ej. Medicamentos generales"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            autoFocus
          />

          <span className="category-form-hint">
            Ingresa un nombre de hasta 80 caracteres.
          </span>
        </div>

        {error && (
          <div className="category-form-error">
            {error}
          </div>
        )}

        <div className="category-form-actions">
          <button
            type="button"
            className="category-form-cancel"
            onClick={onClose}
            disabled={loading}
          >
            <X size={17} />
            Cancelar
          </button>

          <button
            type="submit"
            className="category-form-save"
            disabled={loading}
          >
            <Save size={17} />
            {loading
              ? "Guardando..."
              : isEditing
                ? "Guardar cambios"
                : "Registrar categoría"
            }
          </button>
        </div>

      </form>
    </Modal>
  );
};

export default CategoryForm;
