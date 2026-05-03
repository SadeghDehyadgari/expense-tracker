// NEW: ToastContext for showing error notifications
import { createContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './Toast.css';

export const ToastContext = createContext();

let toastCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = 'error') => {
      const id = ++toastCounter;
      const newToast = { id, message, type };
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => removeToast(id), 5000);
    },
    [removeToast]
  );

  const showErrorToast = useCallback(
    (message) => {
      showToast(message, 'error');
    },
    [showToast]
  );

  const value = { showErrorToast };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/*
        NEW: Using createPortal to render toasts directly under document.body
        Reasons:
        1. Ensures fixed positioning works correctly (not affected by parent overflow/transform).
        2. Toasts appear above all modals, dialogs, and page content.
        3. Avoids CSS stacking context issues from ancestor elements.
        4. Scoped to viewport center-top regardless of scroll position.
      */}
      {createPortal(
        <div className="toast-container">
          {toasts.map((toast) => (
            <div key={toast.id} className={`toast toast--${toast.type}`}>
              {toast.message}
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};
