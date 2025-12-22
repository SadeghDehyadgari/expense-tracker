import React, { useState } from 'react';
import TransactionTable from './components/TransactionTable/TransactionTable';
import mockTransactions from './data/mockTransactions';
import Modal from './components/Modal/Modal';
import AddTransactionForm from './components/AddTransactionForm/AddTransactionForm';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [isModalOpen, setIsModalOpen] = useState(true);

  if (isModalOpen) {
    document.body.classList.add('no-overflow');
  } else {
    document.body.classList.remove('no-overflow');
  }

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

  return (
    <div className="app">
      <main>
        <div className="main-container">
          <TransactionTable transactions={transactions} onAddTransactionClick={handleOpenModal} />
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
