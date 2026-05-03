import { createContext, useState, useEffect, useCallback, useMemo } from 'react';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ----- Initial fetch -----
  useEffect(() => {
    const abortController = new AbortController();

    const loadTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:3000/transactions', {
          signal: abortController.signal,
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        // reverse to make newest-first
        data.reverse();
        setTransactions(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
    return () => abortController.abort();
  }, []);

  // ----- Async actions (no reducer, functional setState) -----
  const addTransaction = useCallback(async (data) => {
    setError(null);
    try {
      const res = await fetch('http://localhost:3000/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Could not add transaction');
      const newTransaction = await res.json();
      setTransactions((prev) => [newTransaction, ...prev]);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const editTransaction = useCallback(async (id, updatedData) => {
    setError(null);
    try {
      const res = await fetch(`http://localhost:3000/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error('Could not edit transaction');
      const updatedTransaction = await res.json();
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updatedTransaction } : t))
      );
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const deleteTransaction = useCallback(async (id) => {
    setError(null);
    try {
      const res = await fetch(`http://localhost:3000/transactions/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Could not delete transaction');
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
      throw err; // re‑throw so that callers (e.g., Expenses) can display the error
    }
  }, []);

  // ----- Memoised context value -----
  const contextValue = useMemo(
    () => ({
      transactions,
      loading,
      error,
      addTransaction,
      editTransaction,
      deleteTransaction,
    }),
    [transactions, loading, error, addTransaction, editTransaction, deleteTransaction]
  );

  return <TransactionContext.Provider value={contextValue}>{children}</TransactionContext.Provider>;
};

export default TransactionContext;
