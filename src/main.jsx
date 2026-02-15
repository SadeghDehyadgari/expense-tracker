import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { TransactionProvider } from './context/TransactionContext';
import './styles/globals.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TransactionProvider>
      <App />
    </TransactionProvider>
  </StrictMode>
);
