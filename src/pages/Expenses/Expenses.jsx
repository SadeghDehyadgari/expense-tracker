import { useState } from 'react';
import TransactionTable from '../../components/TransactionTable/TransactionTable';
import Modal from '../../components/Modal/Modal';
import AddTransactionForm from '../../components/AddTransactionForm/AddTransactionForm';
import './Expenses.css';

function Expenses() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="expenses-page">
      <TransactionTable onAddTransactionClick={handleOpenModal} />

      {isModalOpen && (
        <Modal title="افزودن تراکنش" onClose={handleCloseModal}>
          <AddTransactionForm onCancel={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
}

export default Expenses;
