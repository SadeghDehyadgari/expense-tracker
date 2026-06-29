import { createContext, useCallback, useMemo } from 'react';
import { useToast } from '../hooks/useToast';
// [NEW] Import buildApiUrl to construct full URLs for mutations
import useFetch, { buildApiUrl } from '../hooks/useFetch';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const { showErrorToast } = useToast();
  const { data, loading, error, refetch } = useFetch('/api/transactions');

  const transactions = useMemo(() => data ?? [], [data]);

  const addTransaction = useCallback(
    async (data) => {
      // [NEW] Use buildApiUrl for MockAPI deployment
      const res = await fetch(buildApiUrl('/api/transactions'), {
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
      // [NEW] Use buildApiUrl for MockAPI deployment
      const res = await fetch(buildApiUrl(`/api/transactions/${id}`), {
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
      // [NEW] Use buildApiUrl for MockAPI deployment
      const res = await fetch(buildApiUrl(`/api/transactions/${id}`), {
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
