
import { CheckCircle, AlertCircle, AlertTriangle, X, Info } from "lucide-react";
import "./Toast.css";

const toastConfig = {
  success: {
    icon: CheckCircle,
    title: "Operación exitosa"
  },
  error: {
    icon: AlertCircle,
    title: "Ha ocurrido un error"
  },
  warning: {
    icon: AlertTriangle,
    title: "Advertencia"
  },
  info: {
    icon: Info,
    title: "Información"
  }
};

const Toast = ({ message, type = "success", onClose }) => {
  const config = toastConfig[type] || toastConfig.info;
  const Icon = config.icon;

  return (
    <div className={`toast toast-${type}`} role="alert">
      <div className="toast-icon">
        <Icon size={21} />
      </div>

      <div className="toast-content">
        <strong>{config.title}</strong>
        <p>{message}</p>
      </div>

      <button
        type="button"
        className="toast-close"
        onClick={onClose}
        aria-label="Cerrar notificación"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default Toast;
