import { useState, useCallback } from 'react';

/**
 * Custom hook for managing delete confirmation modal state.
 * @param {Function} deleteTransaction - The delete function from TransactionContext (async)
 * @param {Function} showErrorToast - Toast function for showing errors
 * Returns:
 *   - show: boolean - whether confirmation modal is visible
 *   - transactionId: string | null - id of transaction to delete
 *   - deleting: boolean - loading state during delete operation
 *   - confirmDelete: function(transactionId) - opens modal with given id
 *   - cancelDelete: function - closes modal and resets
 *   - handleConfirmDelete: async function - calls deleteTransaction and closes modal on success
 */
const useDeleteConfirmation = (deleteTransaction, showErrorToast) => {
  const [show, setShow] = useState(false);
  const [transactionId, setTransactionId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = useCallback((id) => {
    setShow(true);
    setTransactionId(id);
    setDeleting(false);
  }, []);

  const cancelDelete = useCallback(() => {
    setShow(false);
    setTransactionId(null);
    setDeleting(false);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!transactionId) return;
    setDeleting(true);
    try {
      await deleteTransaction(transactionId);
      cancelDelete();
    } catch {
      showErrorToast('خطا در حذف تراکنش');
    } finally {
      setDeleting(false);
    }
  }, [deleteTransaction, showErrorToast, transactionId, cancelDelete]);

  return {
    show,
    transactionId,
    deleting,
    confirmDelete,
    cancelDelete,
    handleConfirmDelete,
  };
};

export default useDeleteConfirmation;
