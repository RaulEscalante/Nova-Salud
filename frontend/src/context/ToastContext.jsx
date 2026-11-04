
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import Toast from "../components/common/Toast";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success", duration = 3500) => {
    setToast({
      id: Date.now(),
      message,
      type,
      duration
    });
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div className="toast-container">
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={closeToast}
          />
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast debe utilizarse dentro de ToastProvider");
  }

  return context;
};
