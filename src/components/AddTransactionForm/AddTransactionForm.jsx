import { useState, useContext } from 'react';
import TransactionContext from '../../context/TransactionContext';
import './AddTransactionForm.css';
import CalendarIcon from '../../assets/Outline/Calendar.svg';

const AddTransactionForm = ({ onCancel }) => {
  const { dispatch } = useContext(TransactionContext);

  const [formData, setFormData] = useState({
    date: '',
    amount: '',
    type: 'income',
    description: '',
  });
  const [dateError, setDateError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'date') {
      if (value && !/^\d{4}\/\d{2}\/\d{2}$/.test(value)) {
        setDateError('فرمت تاریخ باید به صورت YYYY/MM/DD باشد');
      } else {
        setDateError('');
      }
    }
  };

  const handleRadioChange = (e) => {
    setFormData((prev) => ({ ...prev, type: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.date && !/^\d{4}\/\d{2}\/\d{2}$/.test(formData.date)) {
      setDateError('فرمت تاریخ باید به صورت YYYY/MM/DD باشد');
      return;
    }

    const newTransaction = {
      date: formData.date,
      description: formData.description,
      income: formData.type === 'income' ? parseInt(formData.amount) || 0 : 0,
      expense: formData.type === 'expense' ? parseInt(formData.amount) || 0 : 0,
    };

    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
    onCancel();
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="date" className="form-label">
          تاریخ
        </label>
        <div className="input-with-icon">
          <input
            type="text"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
            className={`form-input ${dateError ? 'error-input' : ''}`}
            dir="rtl"
          />
          <img src={CalendarIcon} alt="calendar" className="calendar-svg" />
          {dateError && <div className="error-message">{dateError}</div>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="amount" className="form-label">
          مبلغ (تومان)
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleInputChange}
          required
          className="form-input"
          dir="rtl"
          min="0"
        />
      </div>

      <div className="form-group">
        <label className="form-label">نوع تراکنش</label>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="type"
              value="income"
              checked={formData.type === 'income'}
              onChange={handleRadioChange}
              className="radio-input"
            />
            <span className="radio-custom"></span>
            <span className="radio-text">درآمد</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="type"
              value="expense"
              checked={formData.type === 'expense'}
              onChange={handleRadioChange}
              className="radio-input"
            />
            <span className="radio-custom"></span>
            <span className="radio-text">هزینه</span>
          </label>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">
          شرح
        </label>
        <input
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
          className="form-input"
          dir="rtl"
        />
      </div>

      <div className="form-actions">
        <button type="button" className="cancel-button" onClick={onCancel}>
          انصراف
        </button>
        <button type="submit" className="submit-button">
          ثبت
        </button>
      </div>
    </form>
  );
};

export default AddTransactionForm;
