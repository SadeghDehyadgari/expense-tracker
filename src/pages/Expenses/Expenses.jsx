import { useState, useContext, useRef, useEffect } from 'react';
import TransactionTable from '../../components/TransactionTable/TransactionTable';
import Modal from '../../components/Modal/Modal';
import AddTransactionForm from '../../components/AddTransactionForm/AddTransactionForm';
import TransactionContext from '../../context/TransactionContext';
import './Expenses.css';

function Expenses() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // ADDED: delete confirmation state
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    transactionId: null,
  });

  // ADDED: local loading state for delete operation
  const [deleting, setDeleting] = useState(false);
  // REMOVED: deleteError state - errors now shown via toast

  // CHANGED: use deleteTransaction (now returns { success, error })
  const { deleteTransaction } = useContext(TransactionContext);

  // ADDED: ref for auto-focus on delete button
  const deleteButtonRef = useRef(null);

  // ADDED: focus the delete button when delete confirmation opens
  useEffect(() => {
    if (deleteConfirmation.show && deleteButtonRef.current) {
      deleteButtonRef.current.focus();
    }
  }, [deleteConfirmation.show]);

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleOpenModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleDeleteClick = (transactionId) => {
    setDeleteConfirmation({ show: true, transactionId });
  };

  // CHANGED: handle returned result instead of try/catch
  const handleConfirmDelete = async () => {
    setDeleting(true);
    const result = await deleteTransaction(deleteConfirmation.transactionId);
    if (result.success) {
      // Success: close modal and reset confirmation
      setDeleteConfirmation({ show: false, transactionId: null });
    }
    // On error, toast already shown, just stop loading indicator
    setDeleting(false);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({ show: false, transactionId: null });
  };

  return (
    <div className="expenses-page">
      <TransactionTable
        onAddTransactionClick={handleOpenModal}
        onEditTransaction={handleEditTransaction}
        onDeleteTransaction={handleDeleteClick}
      />

      {isModalOpen && (
        <Modal
          title={editingTransaction ? 'ویرایش تراکنش' : 'افزودن تراکنش'}
          onClose={handleCloseModal}
        >
          <AddTransactionForm
            mode={editingTransaction ? 'edit' : 'add'}
            initialData={editingTransaction}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}

      {deleteConfirmation.show && (
        <Modal title="" onClose={handleCancelDelete} className="delete-confirmation-modal">
          <p>آیا از حذف تراکنش اطمینان دارید؟</p>
          {/* REMOVED: inline error message, now handled by global toast */}
          <div className="delete-actions">
            <button className="cancel-button" onClick={handleCancelDelete} disabled={deleting}>
              انصراف
            </button>
            <button
              className="delete-confirm-button"
              onClick={handleConfirmDelete}
              ref={deleteButtonRef}
              disabled={deleting}
            >
              {deleting ? 'در حال حذف...' : 'حذف'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Expenses;
