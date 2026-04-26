import { useState, useContext } from 'react';
import TransactionContext from '../../context/TransactionContext';
import DatePicker from '@amir04lm26/react-modern-calendar-date-picker';
import '@amir04lm26/react-modern-calendar-date-picker/lib/DatePicker.css';
import CalendarIcon from '../../assets/Outline/Calendar.svg';
import { toEnglishDigits } from '../../utils/formatters';
import './AddTransactionForm.css';

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
  const [selectedDayObj, setSelectedDayObj] = useState(null);

  const minDate = { year: 1300, month: 1, day: 1 };
  const maxDate = { year: 1450, month: 12, day: 29 };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'amount') {
      const processedValue = toEnglishDigits(value);
      setFormData((prev) => ({ ...prev, amount: processedValue }));

      const numValue = Number(processedValue);
      if (processedValue && (numValue <= 0 || isNaN(numValue))) {
        setAmountError('مبلغ باید بزرگتر از صفر باشد');
      } else {
        setAmountError('');
      }
      return;
    }

    if (name === 'description') {
      setFormData((prev) => ({ ...prev, description: value }));
    }
  };

  const handleDateChange = (selectedDay) => {
    if (selectedDay) {
      const formatted = `${selectedDay.year}/${String(selectedDay.month).padStart(2, '0')}/${String(selectedDay.day).padStart(2, '0')}`;
      setFormData((prev) => ({ ...prev, date: formatted }));
      setSelectedDayObj(selectedDay);
      setDateError('');
    } else {
      setFormData((prev) => ({ ...prev, date: '' }));
      setSelectedDayObj(null);
    }
  };

  const handleRadioChange = (e) => {
    setFormData((prev) => ({ ...prev, type: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prevent submission without a selected date
    if (!formData.date) {
      setDateError('لطفاً تاریخ را انتخاب کنید');
      return;
    }

    if (!/^\d{4}\/\d{2}\/\d{2}$/.test(formData.date)) {
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
          <DatePicker
            value={selectedDayObj}
            onChange={handleDateChange}
            locale="fa"
            calendar="persian"
            minimumDate={minDate}
            maximumDate={maxDate}
            shouldHighlightWeekends
            calendarClassName="compact-calendar"
            style={{ width: '100%' }}
            renderInput={({ ref }) => (
              <>
                <input
                  type="text"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={() => {}}
                  required
                  className={`form-input pointer ${dateError ? 'error-input' : ''}`}
                  dir="rtl"
                  autoComplete="off"
                  readOnly
                  ref={ref}
                  placeholder="برای انتخاب تاریخ کلیک کنید"
                />
                <img
                  src={CalendarIcon}
                  alt="calendar"
                  className="calendar-svg"
                  onClick={() => ref.current.focus()}
                  style={{ cursor: 'pointer' }}
                  title="انتخاب تاریخ"
                />
                {dateError && <div className="error-message">{dateError}</div>}
              </>
            )}
          />
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
