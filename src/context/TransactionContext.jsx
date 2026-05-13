import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useToast } from '../hooks/useToast';
import useFetch from '../hooks/useFetch';

const TransactionContext = createContext();

// NEW: fetch wrapper with timeout (10 seconds) – solves hanging on network loss
const fetchWithTimeout = (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  return fetch(url, {
    ...options,
    signal: controller.signal,
  }).finally(() => clearTimeout(id));
};

export const TransactionProvider = ({ children }) => {
  const { showErrorToast } = useToast();

  const { data: transactionsRaw, loading, error } = useFetch('/api/transactions');

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (transactionsRaw) {
      // CHANGED: store raw data as-is; sorting is handled by useTransactionFilters
      setTransactions(transactionsRaw);
    }
  }, [transactionsRaw]);

  // NEW: silent refresh after mutations – uses timeout-safe fetch
  const silentRefresh = useCallback(async () => {
    try {
      const res = await fetchWithTimeout('/api/transactions');
      if (!res.ok) throw new Error('خطا در به‌روزرسانی لیست تراکنش‌ها');
      const freshData = await res.json();
      // CHANGED: store fresh data without sorting
      setTransactions(freshData);
    } catch {
      showErrorToast('خطا در به‌روزرسانی لیست تراکنش‌ها');
    }
  }, [showErrorToast]);

  const addTransaction = useCallback(
    async (data) => {
      const res = await fetchWithTimeout('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('خطا در افزودن تراکنش');
      await silentRefresh();
    },
    [silentRefresh]
  );

  const editTransaction = useCallback(
    async (id, updatedData) => {
      const res = await fetchWithTimeout(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error('خطا در ویرایش تراکنش');
      await silentRefresh();
    },
    [silentRefresh]
  );

  const deleteTransaction = useCallback(
    async (id) => {
      const res = await fetchWithTimeout(`/api/transactions/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('خطا در حذف تراکنش');
      await silentRefresh();
    },
    [silentRefresh]
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
