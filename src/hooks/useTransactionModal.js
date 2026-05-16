import { useState } from 'react';

/**
 * Custom hook for managing Add/Edit transaction modal state.
 * Returns:
 *   - isOpen: boolean - whether modal is open
 *   - editingTransaction: object | null - transaction being edited (null for add mode)
 *   - openAddModal: function - opens modal for adding new transaction
 *   - openEditModal: function(transaction) - opens modal for editing given transaction
 *   - closeModal: function - closes modal and resets editingTransaction to null
 */
const useTransactionModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const openAddModal = () => {
    setIsOpen(true);
    setEditingTransaction(null);
  };

  const openEditModal = (transaction) => {
    setIsOpen(true);
    setEditingTransaction(transaction);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditingTransaction(null);
  };

  return {
    isOpen,
    editingTransaction,
    openAddModal,
    openEditModal,
    closeModal,
  };
};

export default useTransactionModal;
