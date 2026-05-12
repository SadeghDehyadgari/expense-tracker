// NEW: Extracted toolbar component to avoid code duplication
import DatePicker from '@amir04lm26/react-modern-calendar-date-picker';
import '@amir04lm26/react-modern-calendar-date-picker/lib/DatePicker.css';
import CalendarIcon from '../../assets/Outline/Calendar.svg';
import ArrowDownIcon from '../../assets/Outline/Arrow - Down 2.svg';

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
                  value={fromDate}
                  readOnly
                  placeholder="انتخاب کنید"
                  className="tx-filter-input"
                  ref={ref}
                />
                <img src={CalendarIcon} alt="calendar" className="tx-filter-icon" />
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
                  value={toDate}
                  readOnly
                  placeholder="انتخاب کنید"
                  className="tx-filter-input"
                  ref={ref}
                />
                <img src={CalendarIcon} alt="calendar" className="tx-filter-icon" />
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
