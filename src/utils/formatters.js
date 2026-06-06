export const toEnglishDigits = (str) => {
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

const parseYearMonth = (str) => {
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

// NEW: Truncates a string to a maximum number of words, appending an ellipsis if needed.
export const truncateWords = (text, maxWords) => {
  if (!text) return '';
  const words = text.split(' ');
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + '...';
};
