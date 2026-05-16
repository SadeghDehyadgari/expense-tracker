import { useRef } from 'react';
import DatePicker from '@amir04lm26/react-modern-calendar-date-picker';
import '@amir04lm26/react-modern-calendar-date-picker/lib/DatePicker.css';
import CalendarIcon from '../../assets/Outline/Calendar.svg';
import ArrowDownIcon from '../../assets/Outline/Arrow - Down 2.svg';
import { toPersianDigits } from '../../utils/formatters';
import { formatJalaliDate } from '../../utils/jalaliDateUtils'; // NEW: import for formatting

// CHANGED: Props now receive object and change handlers directly (string is derived internally)
const TransactionToolbar = ({
  fromDateObj,
  toDateObj,
  sortOrder,
  onFromDateChange,
  onToDateChange,
  onSortOrderChange,
}) => {
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);

  // NEW: compute display strings from objects
  const fromDisplay = fromDateObj ? toPersianDigits(formatJalaliDate(fromDateObj)) : '';
  const toDisplay = toDateObj ? toPersianDigits(formatJalaliDate(toDateObj)) : '';

  const handleClearFromDate = (e) => {
    e.stopPropagation();
    onFromDateChange(null);
    if (fromInputRef.current) {
      fromInputRef.current.focus();
    }
  };

  const handleClearToDate = (e) => {
    e.stopPropagation();
    onToDateChange(null);
    if (toInputRef.current) {
      toInputRef.current.focus();
    }
  };

  return (
    <div className="tx-filter-toolbar">
      <div className="tx-filter-group">
        <label className="tx-filter-label">از تاریخ</label>
        <div className="tx-filter-input-wrapper">
          <DatePicker
            value={fromDateObj}
            onChange={onFromDateChange}
            locale="fa"
            calendar="persian"
            minimumDate={{ year: 1300, month: 1, day: 1 }}
            maximumDate={{ year: 1450, month: 12, day: 29 }}
            shouldHighlightWeekends
            calendarClassName="compact-calendar"
            renderInput={({ ref }) => (
              <>
                <input
                  type="text"
                  value={fromDisplay}
                  readOnly
                  placeholder="انتخاب کنید"
                  className="tx-filter-input"
                  ref={(el) => {
                    fromInputRef.current = el;
                    ref.current = el;
                  }}
                />
                {fromDateObj ? (
                  <button
                    type="button"
                    className="tx-filter-clear-icon"
                    onClick={handleClearFromDate}
                    aria-label="پاک کردن تاریخ"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M12 4L4 12M4 4L12 12"
                        stroke="#9ba1a8"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                ) : (
                  <img src={CalendarIcon} alt="calendar" className="tx-filter-icon" />
                )}
              </>
            )}
          />
        </div>
      </div>
      <div className="tx-filter-group">
        <label className="tx-filter-label">تا تاریخ</label>
        <div className="tx-filter-input-wrapper">
          <DatePicker
            value={toDateObj}
            onChange={onToDateChange}
            locale="fa"
            calendar="persian"
            minimumDate={{ year: 1300, month: 1, day: 1 }}
            maximumDate={{ year: 1450, month: 12, day: 29 }}
            shouldHighlightWeekends
            calendarClassName="compact-calendar"
            renderInput={({ ref }) => (
              <>
                <input
                  type="text"
                  value={toDisplay}
                  readOnly
                  placeholder="انتخاب کنید"
                  className="tx-filter-input"
                  ref={(el) => {
                    toInputRef.current = el;
                    ref.current = el;
                  }}
                />
                {toDateObj ? (
                  <button
                    type="button"
                    className="tx-filter-clear-icon"
                    onClick={handleClearToDate}
                    aria-label="پاک کردن تاریخ"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M12 4L4 12M4 4L12 12"
                        stroke="#9ba1a8"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                ) : (
                  <img src={CalendarIcon} alt="calendar" className="tx-filter-icon" />
                )}
              </>
            )}
          />
        </div>
      </div>
      <div className="tx-filter-group">
        <label className="tx-filter-label">ترتیب نمایش</label>
        <div className="tx-filter-select-wrapper">
          <select
            className="tx-filter-select"
            value={sortOrder}
            onChange={(e) => onSortOrderChange(e.target.value)}
          >
            <option value="newest">جدیدترین</option>
            <option value="oldest">قدیمی‌ترین</option>
            <option value="highest">بیشترین مبلغ</option>
            <option value="lowest">کمترین مبلغ</option>
          </select>
          <img src={ArrowDownIcon} alt="dropdown" className="tx-filter-select-icon" />
        </div>
      </div>
    </div>
  );
};

export default TransactionToolbar;
