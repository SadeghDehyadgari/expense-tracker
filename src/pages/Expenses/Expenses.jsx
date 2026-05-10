import { useState, useContext, useRef, useEffect } from 'react';
import TransactionTable from '../../components/TransactionTable/TransactionTable';
import Modal from '../../components/Modal/Modal';
import AddTransactionForm from '../../components/AddTransactionForm/AddTransactionForm';
import TransactionContext from '../../context/TransactionContext';
// NEW: import toast hook for delete error handling
import { useToast } from '../../hooks/useToast';
import './Expenses.css';

function Expenses() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    transactionId: null,
  });

  const [deleting, setDeleting] = useState(false);

  // NEW: useToast instance
  const { showErrorToast } = useToast();

  const { deleteTransaction } = useContext(TransactionContext);

  const deleteButtonRef = useRef(null);

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

  // NEW: use try/catch, deleteTransaction now throws on failure
  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteTransaction(deleteConfirmation.transactionId);
      // success: close the confirmation modal
      setDeleteConfirmation({ show: false, transactionId: null });
    } catch {
      // NEW: show toast error and leave confirmation open
      showErrorToast('خطا در حذف تراکنش');
    } finally {
      setDeleting(false);
    }
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
