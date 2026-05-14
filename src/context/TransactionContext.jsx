// TransactionContext.jsx
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
