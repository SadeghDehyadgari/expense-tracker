// TransactionToolbar.jsx
// NEW: Extracted toolbar component to avoid code duplication
import { useRef } from 'react'; // NEW: Added useRef for input focus management
import DatePicker from '@amir04lm26/react-modern-calendar-date-picker';
import '@amir04lm26/react-modern-calendar-date-picker/lib/DatePicker.css';
import CalendarIcon from '../../assets/Outline/Calendar.svg';
import ArrowDownIcon from '../../assets/Outline/Arrow - Down 2.svg';
// NEW: Import Persian digits converter
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
  // NEW: Refs to programmatically focus inputs after clearing date
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);

  // NEW: Helper to clear from date and remove focus to allow calendar to close
  const handleClearFromDate = (e) => {
    e.stopPropagation(); // Prevent date picker from opening
    onFromDateChange(null);
    // Focus the input to release focus, so calendar can close on outside click
    if (fromInputRef.current) {
      fromInputRef.current.focus();
    }
  };

  // NEW: Helper to clear to date and remove focus
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
                  // CHANGED: Display Persian digits for the date value
                  value={toPersianDigits(fromDate)}
                  readOnly
                  placeholder="انتخاب کنید"
                  className="tx-filter-input"
                  ref={(el) => {
                    // CHANGED: Store ref locally and also pass to DatePicker internal ref
                    fromInputRef.current = el;
                    // Handle both function ref and object ref to avoid "ref is not a function" error
                    ref.current = el;
                  }}
                />
                {/* CHANGED: Conditional icon - calendar or clear (X) */}
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
                  // CHANGED: Display Persian digits for the date value
                  value={toPersianDigits(toDate)}
                  readOnly
                  placeholder="انتخاب کنید"
                  className="tx-filter-input"
                  ref={(el) => {
                    toInputRef.current = el;
                    ref.current = el;
                  }}
                />
                {/* CHANGED: Conditional icon - calendar or clear (X) */}
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
            {/* NEW: Disabled placeholder option as default */}
            <option value="" disabled>
              انتخاب کنید
            </option>
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
