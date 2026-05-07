import { createContext, useCallback, useMemo } from 'react';
import { useToast } from '../hooks/useToast';
// NEW: import useFetch hook to replace manual useState/useEffect fetching
import useFetch from '../hooks/useFetch';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const { showErrorToast } = useToast();

  // REFACTORED: all data fetching and state (loading, error, transactions) now handled by useFetch
  const {
    data: transactionsRaw,
    loading,
    error,
    refetch: fetchTransactions,
  } = useFetch('/api/transactions');

  // FIX: Ensure transactions is always an array (useFetch initially returns null).
  // Memoize the fallback to prevent a new array reference on every render,
  // which would otherwise cause the useMemo for contextValue to see a changed dependency each time.
  const transactions = useMemo(() => transactionsRaw ?? [], [transactionsRaw]);

  const addTransaction = useCallback(
    async (data) => {
      try {
        const res = await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        // CHANGED: Persian error message (preserved)
        if (!res.ok) throw new Error('خطا در افزودن تراکنش');
        // NEW: after successful addition, silently refetch the whole list instead of manually updating state
        await fetchTransactions();
        return { success: true };
      } catch (err) {
        // CHANGED: Always show the Persian error message for add operation, even for network failures
        showErrorToast('خطا در افزودن تراکنش');
        return { success: false, error: err.message };
      }
    },
    // NEW: fetchTransactions added to dependency array
    [showErrorToast, fetchTransactions]
  );

  const editTransaction = useCallback(
    async (id, updatedData) => {
      try {
        const res = await fetch(`/api/transactions/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData),
        });
        // CHANGED: Persian error message (preserved)
        if (!res.ok) throw new Error('خطا در ویرایش تراکنش');
        // NEW: silently refetch after successful edit
        await fetchTransactions();
        return { success: true };
      } catch (err) {
        // CHANGED: Always show Persian error message for edit operation.
        showErrorToast('خطا در ویرایش تراکنش');
        return { success: false, error: err.message };
      }
    },
    [showErrorToast, fetchTransactions]
  );

  const deleteTransaction = useCallback(
    async (id) => {
      try {
        const res = await fetch(`/api/transactions/${id}`, {
          method: 'DELETE',
        });
        // CHANGED: Persian error message (preserved)
        if (!res.ok) throw new Error('خطا در حذف تراکنش');
        // NEW: silently refetch after successful delete
        await fetchTransactions();
        return { success: true };
      } catch (err) {
        // CHANGED: Always show Persian error message for delete operation.
        showErrorToast('خطا در حذف تراکنش');
        return { success: false, error: err.message };
      }
    },
    [showErrorToast, fetchTransactions]
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
