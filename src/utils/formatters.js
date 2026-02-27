export const toPersianDigits = (value) => {
  if (!value && value !== 0) return '';
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return value.toString().replace(/\d/g, (digit) => persianDigits[digit]);
};

export const formatNumber = (value) => {
  if (value === undefined || value === null) return '';
  return value.toLocaleString('fa-IR');
};

export const formatPercentage = (value) => {
  if (value === undefined || value === null) return '';
  return toPersianDigits(value.toFixed(0));
};

const persianMonths = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

export const getPersianMonthName = (monthNum) => persianMonths[monthNum - 1];

// Helper to extract year and month from a string
const parseYearMonth = (str) => {
  // Replace any slash with hyphen to normalize
  const normalized = str.replace(/\//g, '-');
  const parts = normalized.split('-');
  if (parts.length >= 2) {
    return { year: parts[0], month: parts[1] };
  }
  return { year: '', month: '' };
};

export const formatMonthLabel = (yearMonth) => {
  const { year, month } = parseYearMonth(yearMonth);
  if (!year || !month) return yearMonth;
  const monthNum = parseInt(month, 10);
  return `${getPersianMonthName(monthNum)} ${toPersianDigits(year)}`;
};

export const formatMonthNumeric = (yearMonth) => {
  const { year, month } = parseYearMonth(yearMonth);
  if (!year || !month) return yearMonth;
  return `${toPersianDigits(year)}/${toPersianDigits(month)}`;
};

export const formatDayLabel = (day) => toPersianDigits(day);
