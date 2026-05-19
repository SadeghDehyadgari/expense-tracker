import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { TransactionProvider } from './context/TransactionContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext'; // NEW: Auth context
// NEW: Self-hosted Vazirmatn font faces (replaces Google Fonts link)
import './styles/fonts.css';
import './styles/globals.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <TransactionProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </TransactionProvider>
    </ToastProvider>
  </StrictMode>
);
