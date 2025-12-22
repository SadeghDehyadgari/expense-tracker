import React from 'react';
import './TransactionTable.css';
import PlusIcon from '../../assets/Outline/Plus.svg';

const TransactionTable = ({ transactions, onAddTransactionClick }) => {
  const transactionList = transactions.map((transaction) => (
    <tr key={transaction.id}>
      <td className="cell-date">{transaction.date}</td>
      <td className="cell-income">
        {transaction.income > 0 ? (
          <>
            {transaction.income.toLocaleString('fa-IR')}+
            <span className="currency-label"> تومان</span>
          </>
        ) : null}
      </td>
      <td className="cell-expense">
        {transaction.expense > 0 ? (
          <>
            {transaction.expense.toLocaleString('fa-IR')}-
            <span className="currency-label"> تومان</span>
          </>
        ) : null}
      </td>
      <td className="cell-description">{transaction.description}</td>
    </tr>
  ));

  return (
    <div className="table-container">
      <div className="table-header">
        <h2 className="table-title">تراکنش‌ها</h2>
        <button className="add-transaction-button" onClick={onAddTransactionClick}>
          <img src={PlusIcon} alt="Plus" className="button-icon" />
          افزودن تراکنش
        </button>
      </div>
      <table className="transaction-table">
        <thead>
          <tr>
            <th className="header-date">تاریخ</th>
            <th className="header-income">درآمد (تومان)</th>
            <th className="header-expense">هزینه (تومان)</th>
            <th className="header-description">شرح</th>
          </tr>
        </thead>
        <tbody>{transactionList}</tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
