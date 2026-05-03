import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '../hooks/useToast';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showErrorToast } = useToast();

  const fetchTransactions = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/transactions', { signal });
      // CHANGED: throw Persian error message directly
      if (!res.ok) throw new Error('خطا در ارتباط با سرور');
      const data = await res.json();
      data.reverse();
      setTransactions(data);
      setLoading(false);
    } catch (err) {
      if (err.name !== 'AbortError') {
        // CHANGED: use err.message directly (already Persian)
        setError(err.message);
        setLoading(false);
      }
      // AbortError – do nothing
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    fetchTransactions(abortController.signal);
    return () => abortController.abort();
  }, []);

  const addTransaction = useCallback(
    async (data) => {
      try {
        const res = await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        // CHANGED: Persian error message
        if (!res.ok) throw new Error('خطا در افزودن تراکنش');
        const newTransaction = await res.json();
        setTransactions((prev) => [newTransaction, ...prev]);
        return { success: true };
      } catch (err) {
        // CHANGED: use err.message directly
        showErrorToast(err.message);
        return { success: false, error: err.message };
      }
    },
    [showErrorToast]
  );

  const editTransaction = useCallback(
    async (id, updatedData) => {
      try {
        const res = await fetch(`/api/transactions/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData),
        });
        // CHANGED: Persian error message
        if (!res.ok) throw new Error('خطا در ویرایش تراکنش');
        const updatedTransaction = await res.json();
        setTransactions((prev) =>
          prev.map((t) => (t.id === id ? { ...t, ...updatedTransaction } : t))
        );
        return { success: true };
      } catch (err) {
        // CHANGED: use err.message directly
        showErrorToast(err.message);
        return { success: false, error: err.message };
      }
    },
    [showErrorToast]
  );

  const deleteTransaction = useCallback(
    async (id) => {
      try {
        const res = await fetch(`/api/transactions/${id}`, {
          method: 'DELETE',
        });
        // CHANGED: Persian error message
        if (!res.ok) throw new Error('خطا در حذف تراکنش');
        setTransactions((prev) => prev.filter((t) => t.id !== id));
        return { success: true };
      } catch (err) {
        // CHANGED: use err.message directly
        showErrorToast(err.message);
        return { success: false, error: err.message };
      }
    },
    [showErrorToast]
  );

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
