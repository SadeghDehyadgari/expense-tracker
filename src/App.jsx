import React, { useState } from 'react';
import TransactionTable from './components/TransactionTable/TransactionTable';
import Modal from './components/Modal/Modal';
import AddTransactionForm from './components/AddTransactionForm/AddTransactionForm';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddTransaction = (newTransaction) => {
    const newId = transactions.length > 0 ? Math.max(...transactions.map((t) => t.id)) + 1 : 1;
    setTransactions((prevTransactions) => [{ ...newTransaction, id: newId }, ...prevTransactions]);

    handleCloseModal();
  };

  const handleDeleteTransaction = (id) => {
    setTransactions((prevTransactions) =>
      prevTransactions.filter((transaction) => transaction.id !== id)
    );
  };

  return (
    <div className="app">
      <main>
        <div className="main-container">
          <TransactionTable
            transactions={transactions}
            onAddTransactionClick={handleOpenModal}
            onDeleteTransaction={handleDeleteTransaction}
          />
          {isModalOpen && (
            <Modal title="افزودن تراکنش" onClose={handleCloseModal}>
              <AddTransactionForm
                onAddTransaction={handleAddTransaction}
                onCancel={handleCloseModal}
              />
            </Modal>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
