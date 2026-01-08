import './TransactionTable.css';
import PlusIcon from '../../assets/Outline/Plus.svg';
import DeleteIcon from '../../assets/Outline/Delete.svg';
import DangerCircleIcon from '../../assets/Outline/Danger Circle.svg';

const toPersianDigits = (text) => {
  if (!text) return '';
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return text.toString().replace(/\d/g, (digit) => persianDigits[digit]);
};

const TransactionTable = ({ transactions, onAddTransactionClick, onDeleteTransaction }) => {
  const isEmpty = transactions.length === 0;

  return (
    <div className="table-container">
      <div className="table-header">
        <h2 className="table-title">تراکنش‌ها</h2>
        <button className="add-transaction-button" onClick={onAddTransactionClick}>
          <img src={PlusIcon} alt="Plus" className="button-icon" />
          افزودن تراکنش
        </button>
      </div>

      <div className={`table-content ${!isEmpty ? 'with-transactions' : ''}`}>
        {isEmpty ? (
          <div className="empty-state-content">
            <img src={DangerCircleIcon} alt="No transactions" className="empty-state-icon" />
            <p className="empty-state-text">شما هنوز تراکنشی وارد نکرده‌اید</p>
          </div>
        ) : (
          <table className="transaction-table">
            <thead>
              <tr>
                <th className="header-date">تاریخ</th>
                <th className="header-income">درآمد (تومان)</th>
                <th className="header-expense">هزینه (تومان)</th>
                <th className="header-description">شرح</th>
                <th className="header-actions"></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="cell-date">{toPersianDigits(transaction.date)}</td>
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
                  <td className="cell-actions">
                    <button
                      className="delete-button"
                      onClick={() => onDeleteTransaction(transaction.id)}
                      aria-label="حذف تراکنش"
                    >
                      <img src={DeleteIcon} alt="Delete" className="delete-icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TransactionTable;
