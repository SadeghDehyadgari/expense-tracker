import React from 'react';
import TransactionTable from './components/TransactionTable/TransactionTable';
import mockTransactions from './data/mockTransactions';
import './App.css';

function App() {
  return (
    <div className="app">
      <main>
        <div className="main-container">
          <TransactionTable transactions={mockTransactions} />
        </div>
      </main>
    </div>
  );
}

export default App;
