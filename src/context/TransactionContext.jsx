import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '../hooks/useToast';

const TransactionContext = createContext();

// NEW: Helper to convert English error messages to Persian
const getUserFriendlyErrorMessage = (errorMessage) => {
  if (errorMessage === 'Failed to fetch') {
    return 'خطا در ارتباط با سرور';
  }
  return errorMessage;
};

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // CHANGED: now only for initial fetch errors
  const { showErrorToast } = useToast(); // NEW: get toast function

  // NEW: Extract fetch logic into a reusable async function
  const fetchTransactions = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      // OLD: const res = await fetch('http://localhost:3000/transactions', { signal });
      // NEW: Use proxy path /api/transactions so it works on mobile via Vite proxy
      const res = await fetch('/api/transactions', { signal });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      // reverse to make newest-first
      data.reverse();
      setTransactions(data);
    } catch (err) {
      if (err.name !== 'AbortError') {
        const friendlyMessage = getUserFriendlyErrorMessage(err.message); // NEW: convert message
        setError(friendlyMessage);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch (reuses fetchTransactions)
  useEffect(() => {
    const abortController = new AbortController();
    fetchTransactions(abortController.signal);
    return () => abortController.abort();
  }, []);

  // CHANGED: returns { success, error } instead of throwing
  const addTransaction = useCallback(
    async (data) => {
      try {
        // OLD: const res = await fetch('http://localhost:3000/transactions', { ... });
        // NEW: Use proxy path /api/transactions
        const res = await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Could not add transaction');
        const newTransaction = await res.json();
        setTransactions((prev) => [newTransaction, ...prev]);
        return { success: true }; // NEW: return success flag
      } catch (err) {
        const friendlyMessage = getUserFriendlyErrorMessage(err.message); // NEW: convert message
        showErrorToast(friendlyMessage); // NEW: show toast with Persian message
        return { success: false, error: friendlyMessage }; // NEW: return error info, no throw
      }
    },
    [showErrorToast]
  );

  // CHANGED: returns { success, error } instead of throwing
  const editTransaction = useCallback(
    async (id, updatedData) => {
      try {
        // OLD: const res = await fetch(`http://localhost:3000/transactions/${id}`, { ... });
        // NEW: Use proxy path /api/transactions/${id}
        const res = await fetch(`/api/transactions/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData),
        });
        if (!res.ok) throw new Error('Could not edit transaction');
        const updatedTransaction = await res.json();
        setTransactions((prev) =>
          prev.map((t) => (t.id === id ? { ...t, ...updatedTransaction } : t))
        );
        return { success: true };
      } catch (err) {
        const friendlyMessage = getUserFriendlyErrorMessage(err.message);
        showErrorToast(friendlyMessage);
        return { success: false, error: friendlyMessage };
      }
    },
    [showErrorToast]
  );

  // CHANGED: returns { success, error } instead of throwing
  const deleteTransaction = useCallback(
    async (id) => {
      try {
        // OLD: const res = await fetch(`http://localhost:3000/transactions/${id}`, { ... });
        // NEW: Use proxy path /api/transactions/${id}
        const res = await fetch(`/api/transactions/${id}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Could not delete transaction');
        setTransactions((prev) => prev.filter((t) => t.id !== id));
        return { success: true };
      } catch (err) {
        const friendlyMessage = getUserFriendlyErrorMessage(err.message);
        showErrorToast(friendlyMessage);
        return { success: false, error: friendlyMessage };
      }
    },
    [showErrorToast]
  );

  // Memoised context value (NEW: include fetchTransactions)
  const contextValue = useMemo(
    () => ({
      transactions,
      loading,
      error,
      addTransaction,
      editTransaction,
      deleteTransaction,
      fetchTransactions,
    }),
    [
      transactions,
      loading,
      error,
      addTransaction,
      editTransaction,
      deleteTransaction,
      fetchTransactions,
    ]
  );

  return <TransactionContext.Provider value={contextValue}>{children}</TransactionContext.Provider>;
};

export default TransactionContext;
