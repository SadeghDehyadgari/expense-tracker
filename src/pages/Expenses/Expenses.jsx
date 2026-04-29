import { useState } from 'react';
import TransactionTable from '../../components/TransactionTable/TransactionTable';
import Modal from '../../components/Modal/Modal';
import AddTransactionForm from '../../components/AddTransactionForm/AddTransactionForm';
import './Expenses.css';

function Expenses() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // NEW: state to hold the transaction being edited (null when adding)
  const [editingTransaction, setEditingTransaction] = useState(null);

  // NEW: handler to open modal in edit mode
  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleOpenModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  // MODIFIED: close modal and clear editing transaction
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  return (
    <div className="expenses-page">
      {/* NEW: pass onEditTransaction prop to TransactionTable */}
      <TransactionTable
        onAddTransactionClick={handleOpenModal}
        onEditTransaction={handleEditTransaction}
      />

      {isModalOpen && (
        <Modal
          // MODIFIED: title changes based on mode
          title={editingTransaction ? 'ویرایش تراکنش' : 'افزودن تراکنش'}
          onClose={handleCloseModal}
        >
          <AddTransactionForm
            // NEW: pass mode and initialData for editing, otherwise default 'add'
            mode={editingTransaction ? 'edit' : 'add'}
            initialData={editingTransaction}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
}

export default Expenses;
