import { useState, useContext, useRef, useEffect } from 'react'; // ADDED: useRef, useEffect for focus management
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

  const { dispatch } = useContext(TransactionContext);

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

  const handleConfirmDelete = () => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: deleteConfirmation.transactionId });
    setDeleteConfirmation({ show: false, transactionId: null });
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

      {/* ADDED: delete confirmation modal with className and auto-focus */}
      {deleteConfirmation.show && (
        <Modal title="" onClose={handleCancelDelete} className="delete-confirmation-modal">
          <p>آیا از حذف تراکنش اطمینان دارید؟</p>
          <div className="delete-actions">
            <button className="cancel-button" onClick={handleCancelDelete}>
              انصراف
            </button>
            <button
              className="delete-confirm-button"
              onClick={handleConfirmDelete}
              ref={deleteButtonRef}
            >
              حذف
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Expenses;
