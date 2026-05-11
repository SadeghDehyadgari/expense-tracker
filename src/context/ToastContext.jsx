// UPDATED: Re-added useCallback + useMemo to prevent unnecessary consumer re-renders
import { createContext, useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import './Toast.css';

export const ToastContext = createContext();

let toastCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // useCallback applied – stable reference as long as deps are unchanged
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // useCallback applied – depends on stable removeToast
  const showToast = useCallback(
    (message, type = 'error') => {
      const id = ++toastCounter;
      const newToast = { id, message, type };
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => removeToast(id), 5000);
    },
    [removeToast]
  );

  // useCallback applied – depends on stable showToast
  const showErrorToast = useCallback(
    (message) => {
      showToast(message, 'error');
    },
    [showToast]
  );

  // CHANGED: useMemo wraps value object; changes only when showErrorToast changes
  const value = useMemo(() => ({ showErrorToast }), [showErrorToast]);

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
