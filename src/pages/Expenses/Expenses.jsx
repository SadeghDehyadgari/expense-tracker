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

  // ADDED: local loading & error states for delete operation
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // CHANGED: use deleteTransaction async function from context instead of dispatch
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
    // Reset delete error whenever a new confirmation is shown
    setDeleteError(null);
    setDeleteConfirmation({ show: true, transactionId });
  };

  // REWORKED: now uses async deleteTransaction with local loading/error handling
  const handleConfirmDelete = async () => {
    setDeleting(true);
    setDeleteError(null);

    try {
      await deleteTransaction(deleteConfirmation.transactionId);
      // Success: close modal and reset confirmation
      setDeleteConfirmation({ show: false, transactionId: null });
    } catch (error) {
      // Handle error – display message to user
      setDeleteError(error.message || 'خطا در حذف تراکنش. لطفاً دوباره تلاش کنید.');
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({ show: false, transactionId: null });
    setDeleteError(null);
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

      {/* ADDED: delete confirmation modal with className, auto-focus, loading & error display */}
      {deleteConfirmation.show && (
        <Modal title="" onClose={handleCancelDelete} className="delete-confirmation-modal">
          <p>آیا از حذف تراکنش اطمینان دارید؟</p>

          {/* ADDED: inline error message */}
          {deleteError && (
            <p className="delete-error-message" role="alert">
              {deleteError}
            </p>
          )}

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
