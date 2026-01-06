import { useState, useEffect } from 'react';
import TransactionTable from '../../components/TransactionTable/TransactionTable';
import Modal from '../../components/Modal/Modal';
import AddTransactionForm from '../../components/AddTransactionForm/AddTransactionForm';
import {
  loadTransactionsFromStorage,
  saveTransactionsToStorage,
} from '../../utils/localStorageHelpers';
import './Expenses.css';

function Expenses() {
  const [transactions, setTransactions] = useState(() => loadTransactionsFromStorage());
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    saveTransactionsToStorage(transactions);
  }, [transactions]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddTransaction = (newTransaction) => {
    const newId = Date.now();
    setTransactions((prevTransactions) => [{ ...newTransaction, id: newId }, ...prevTransactions]);
    handleCloseModal();
  };

  const handleDeleteTransaction = (id) => {
    setTransactions((prevTransactions) =>
      prevTransactions.filter((transaction) => transaction.id !== id)
    );
  };

  return (
    <div className="expenses-page">
      <TransactionTable
        transactions={transactions}
        onAddTransactionClick={handleOpenModal}
        onDeleteTransaction={handleDeleteTransaction}
      />
      {isModalOpen && (
        <Modal title="افزودن تراکنش" onClose={handleCloseModal}>
          <AddTransactionForm onAddTransaction={handleAddTransaction} onCancel={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
}

export default Expenses;
