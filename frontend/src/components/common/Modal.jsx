
import { X } from "lucide-react";
import "./Modal.css";

const Modal = ({ title, onClose, children, className = "" }) => {
  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className={`modal-container ${className}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{title}</h2>

          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
            title="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
