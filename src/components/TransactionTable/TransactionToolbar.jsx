import { useRef } from 'react';
import DatePicker from '@amir04lm26/react-modern-calendar-date-picker';
import '@amir04lm26/react-modern-calendar-date-picker/lib/DatePicker.css';
import CalendarIcon from '../../assets/Outline/Calendar.svg';
import ArrowDownIcon from '../../assets/Outline/Arrow - Down 2.svg';
import { toPersianDigits } from '../../utils/formatters';

const TransactionToolbar = ({
  fromDate,
  toDate,
  sortOrder,
  fromDateObj,
  toDateObj,
  onFromDateChange,
  onToDateChange,
  onSortOrderChange,
}) => {
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);

  // NEW: Helper to clear from date and add focus to allow calendar to close
  const handleClearFromDate = (e) => {
    e.stopPropagation();
    onFromDateChange(null);
    // Focus the input to release focus, so calendar can close on outside click
    if (fromInputRef.current) {
      fromInputRef.current.focus();
    }
  };

  // NEW: Helper to clear to date and add focus
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
                  value={toPersianDigits(fromDate)}
                  readOnly
                  placeholder="انتخاب کنید"
                  className="tx-filter-input"
                  ref={(el) => {
                    fromInputRef.current = el;
                    // Handle both function ref and object ref to avoid "ref is not a function" error
                    ref.current = el;
                  }}
                />
                {fromDate ? (
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
                  value={toPersianDigits(toDate)}
                  readOnly
                  placeholder="انتخاب کنید"
                  className="tx-filter-input"
                  ref={(el) => {
                    toInputRef.current = el;
                    ref.current = el;
                  }}
                />
                {toDate ? (
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
            {/* REMOVED disabled option because default is now 'newest' */}
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
