import { createContext, useCallback, useMemo } from 'react';
import { useToast } from '../hooks/useToast';
import useFetch from '../hooks/useFetch';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const { showErrorToast } = useToast();

  const { data, loading, error, refetch } = useFetch('/api/transactions');

  // FIX: stabilize the transactions reference – always return the same empty array when data is null
  const transactions = useMemo(() => data ?? [], [data]);

  const addTransaction = useCallback(
    async (data) => {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('خطا در افزودن تراکنش');
      try {
        await refetch();
      } catch {
        showErrorToast('خطا در به‌روزرسانی لیست تراکنش‌ها');
      }
    },
    [refetch, showErrorToast]
  );

  const editTransaction = useCallback(
    async (id, updatedData) => {
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error('خطا در ویرایش تراکنش');
      try {
        await refetch();
      } catch {
        showErrorToast('خطا در به‌روزرسانی لیست تراکنش‌ها');
      }
    },
    [refetch, showErrorToast]
  );

  const deleteTransaction = useCallback(
    async (id) => {
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('خطا در حذف تراکنش');
      try {
        await refetch();
      } catch {
        showErrorToast('خطا در به‌روزرسانی لیست تراکنش‌ها');
      }
    },
    [refetch, showErrorToast]
  );

  // NEW: expose refetch as fetchTransactions to fix "Retry" button in Dashboard and TransactionTable
  const fetchTransactions = useCallback(async () => {
    try {
      await refetch();
    } catch (err) {
      console.error(err);
    }
  }, [refetch]);

  const contextValue = useMemo(
    () => ({
      transactions,
      loading,
      error,
      addTransaction,
      editTransaction,
      deleteTransaction,
      fetchTransactions, // NEW: added to context for manual retry
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
