import React, { useState } from 'react';
import TransactionTable from './components/TransactionTable/TransactionTable';
import mockTransactions from './data/mockTransactions';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [_isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const _handleAddTransaction = (newTransaction) => {
    const newId = transactions.length > 0 ? Math.max(...transactions.map((t) => t.id)) + 1 : 1;
    setTransactions((prevTransactions) => [{ ...newTransaction, id: newId }, ...prevTransactions]);

    handleCloseModal();
  };

  return (
    <div className="app">
      <main>
        <div className="main-container">
          <TransactionTable transactions={transactions} onAddTransactionClick={handleOpenModal} />

          {/* The modal will be implemented later */}
          {/* {isModalOpen && (
            <Modal onClose={handleCloseModal}>
              <AddTransactionForm 
                onAddTransaction={handleAddTransaction}
                onCancel={handleCloseModal}
              />
            </Modal>
          )} */}
        </div>
      </main>
    </div>
  );
}

export default App;
