import React, { useState } from 'react';
import './AddTransactionForm.css';
import CalendarIcon from '../../assets/Outline/Calendar.svg';

const AddTransactionForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    date: '',
    amount: '',
    type: 'expense',
    description: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (e) => {
    setFormData((prev) => ({ ...prev, type: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTransaction = {
      date: formData.date,
      description: formData.description,
      income: formData.type === 'income' ? parseInt(formData.amount) || 0 : 0,
      expense: formData.type === 'expense' ? parseInt(formData.amount) || 0 : 0,
    };
    onSubmit(newTransaction);
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      {/* تاریخ */}
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
            className="form-input"
            dir="rtl"
          />
          <img src={CalendarIcon} alt="calendar" className="calendar-svg" />
        </div>
      </div>

      {/* مبلغ */}
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

      {/* نوع تراکنش */}
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

      {/* شرح */}
      <div className="form-group">
        <label htmlFor="description" className="form-label">
          شرح
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
          className="form-textarea"
          dir="rtl"
        />
      </div>

      {/* دکمه‌ها */}
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
