import { useState, useContext } from 'react';
import TransactionContext from '../../context/TransactionContext';
import './AddTransactionForm.css';
import CalendarIcon from '../../assets/Outline/Calendar.svg';

// ADDED: Convert Persian and Arabic digits to English
const toEnglishDigits = (str) => {
  if (!str) return '';

  const digitMap = {
    '۰': '0',
    '٠': '0',
    '۱': '1',
    '١': '1',
    '۲': '2',
    '٢': '2',
    '۳': '3',
    '٣': '3',
    '۴': '4',
    '٤': '4',
    '۵': '5',
    '٥': '5',
    '۶': '6',
    '٦': '6',
    '۷': '7',
    '٧': '7',
    '۸': '8',
    '٨': '8',
    '۹': '9',
    '٩': '9',
  };

  return str.replace(/[۰-۹٠-٩]/g, (char) => digitMap[char]);
};

const AddTransactionForm = ({ onCancel }) => {
  const { dispatch } = useContext(TransactionContext);

  const [formData, setFormData] = useState({
    date: '',
    amount: '',
    type: 'income',
    description: '',
  });
  const [dateError, setDateError] = useState('');
  const [amountError, setAmountError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Convert Persian digits to English for date and amount fields
    let processedValue = value;
    if (name === 'date' || name === 'amount') {
      processedValue = toEnglishDigits(value);
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }));

    if (name === 'date') {
      if (processedValue && !/^\d{4}\/\d{2}\/\d{2}$/.test(processedValue)) {
        setDateError('فرمت تاریخ باید به صورت YYYY/MM/DD باشد');
      } else {
        setDateError('');
      }
    }

    if (name === 'amount') {
      const numValue = Number(processedValue);
      if (processedValue && (numValue <= 0 || isNaN(numValue))) {
        setAmountError('مبلغ باید بزرگتر از صفر باشد');
      } else {
        setAmountError('');
      }
    }
  };

  const handleRadioChange = (e) => {
    setFormData((prev) => ({ ...prev, type: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Date validation
    if (formData.date && !/^\d{4}\/\d{2}\/\d{2}$/.test(formData.date)) {
      setDateError('فرمت تاریخ باید به صورت YYYY/MM/DD باشد');
      return;
    }

    const amountNum = Number(formData.amount);
    if (!formData.amount || amountNum <= 0 || isNaN(amountNum)) {
      setAmountError('مبلغ باید بزرگتر از صفر باشد');
      return;
    }

    const newTransaction = {
      date: formData.date,
      description: formData.description,
      income: formData.type === 'income' ? amountNum : 0,
      expense: formData.type === 'expense' ? amountNum : 0,
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
            autoComplete="off"
          />
          <img src={CalendarIcon} alt="calendar" className="calendar-svg" />
          {dateError && <div className="error-message">{dateError}</div>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="amount" className="form-label">
          مبلغ (تومان)
        </label>
        <div className="input-with-icon">
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            required
            className={`form-input ${amountError ? 'error-input' : ''}`}
            dir="rtl"
            min="0"
          />
          {amountError && <div className="error-message">{amountError}</div>}
        </div>
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
          autoComplete="off"
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
