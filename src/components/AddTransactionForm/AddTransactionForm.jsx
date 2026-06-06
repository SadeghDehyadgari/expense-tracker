import { useState, useContext } from 'react';
import TransactionContext from '../../context/TransactionContext';
import DatePicker from '@amir04lm26/react-modern-calendar-date-picker';
import '@amir04lm26/react-modern-calendar-date-picker/lib/DatePicker.css';
import CalendarIcon from '../../assets/Outline/Calendar.svg';
import { toEnglishDigits } from '../../utils/formatters';
// CHANGED: import formatJalaliDate from jalaliDateUtils
import { parseDateString, formatJalaliDate } from '../../utils/jalaliDateUtils';
import { getAmountError } from '../../utils/validators';
// NEW: import toast hook to show errors caught from context commands
import { useToast } from '../../hooks/useToast';
// NEW: Import Persian digits converter
import { toPersianDigits } from '../../utils/formatters';
import './AddTransactionForm.css';

const AddTransactionForm = ({ onCancel, mode = 'add', initialData = null }) => {
  const { addTransaction, editTransaction } = useContext(TransactionContext);
  // NEW: useToast for displaying errors in the catch block
  const { showErrorToast } = useToast();

  // --- Initialize form data based on mode and initialData ---
  const getInitialFormData = () => {
    if (mode === 'edit' && initialData) {
      const type = initialData.income > 0 ? 'income' : 'expense';
      const amount = initialData.income > 0 ? initialData.income : initialData.expense;
      return {
        date: initialData.date || '',
        amount: amount ? amount.toString() : '',
        type,
        description: initialData.description || '',
      };
    }
    return { date: '', amount: '', type: 'income', description: '' };
  };

  const [formData, setFormData] = useState(getInitialFormData);
  const [dateError, setDateError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [selectedDayObj, setSelectedDayObj] = useState(() => {
    if (mode === 'edit' && initialData?.date) {
      return parseDateString(initialData.date);
    }
    return null;
  });

  const minDate = { year: 1300, month: 1, day: 1 };
  const maxDate = { year: 1450, month: 12, day: 29 };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'amount') {
      const processedValue = toEnglishDigits(value);
      setFormData((prev) => ({ ...prev, amount: processedValue }));
      setAmountError(getAmountError(processedValue));
      return;
    }

    if (name === 'description') {
      setFormData((prev) => ({ ...prev, description: value }));
    }
  };

  const handleDateChange = (selectedDay) => {
    if (selectedDay) {
      // CHANGED: use shared helper to format date
      const formatted = formatJalaliDate(selectedDay);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    if (!formData.date) {
      setDateError('لطفاً تاریخ را انتخاب کنید');
      return;
    }

    setAmountError('');
    if (!formData.amount) {
      setAmountError('مبلغ باید بزرگتر از صفر باشد');
      return;
    }

    const amountErrorMsg = getAmountError(formData.amount);
    if (amountErrorMsg) {
      setAmountError(amountErrorMsg);
      return;
    }

    const amountNum = Number(formData.amount);
    const transactionData = {
      date: formData.date,
      description: formData.description,
      income: formData.type === 'income' ? amountNum : 0,
      expense: formData.type === 'expense' ? amountNum : 0,
    };

    setSubmitting(true);

    // NEW: try/catch – context functions now throw on failure
    try {
      if (mode === 'edit' && initialData?.id) {
        await editTransaction(initialData.id, transactionData);
      } else {
        await addTransaction(transactionData);
      }
      // NEW: success – close modal
      onCancel();
    } catch {
      // NEW: show toast error and keep form open
      showErrorToast('خطا در انجام عملیات');
      setSubmitting(false);
    }
  };

  const submitLabel = mode === 'edit' ? 'ویرایش' : 'ثبت';

  return (
    <form className="transaction-form" onSubmit={handleSubmit} noValidate>
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
                  value={toPersianDigits(formData.date)}
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
                {dateError && <div className="form-error-message">{dateError}</div>}
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
          {amountError && <div className="form-error-message">{amountError}</div>}
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
        <button type="submit" className="submit-button" disabled={submitting}>
          {submitting ? 'در حال ارسال...' : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default AddTransactionForm;
