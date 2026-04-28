import { toEnglishDigits } from './formatters';

const getYear = (dateStr) => {
  const normalized = dateStr.replace(/\//g, '-');
  return normalized.substring(0, 4);
};

const getYearMonth = (dateStr) => {
  const normalized = dateStr.replace(/\//g, '-');
  return normalized.substring(0, 7);
};

const getDay = (dateStr) => {
  const normalized = dateStr.replace(/\//g, '-');
  return parseInt(normalized.substring(8, 10), 10);
};

const getCurrentJalaliInfo = () => {
  const formatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    year: 'numeric',
    month: '2-digit',
  });
  const parts = formatter.formatToParts(new Date());
  let year = '',
    month = '';
  parts.forEach((part) => {
    if (part.type === 'year') year = part.value;
    if (part.type === 'month') month = part.value;
  });
  year = toEnglishDigits(year);
  month = toEnglishDigits(month);
  month = month.padStart(2, '0');
  return {
    year,
    month,
    yearMonth: `${year}-${month}`,
  };
};

const last12MonthsList = () => {
  const { year: currentYearStr, month: currentMonthStr } = getCurrentJalaliInfo();
  const currentYear = parseInt(currentYearStr, 10);
  const currentMonth = parseInt(currentMonthStr, 10);
  const months = [];

  for (let i = 11; i >= 0; i--) {
    let monthNum = currentMonth - i;
    let yearNum = currentYear;
    while (monthNum <= 0) {
      monthNum += 12;
      yearNum -= 1;
    }
    const mStr = monthNum.toString().padStart(2, '0');
    months.push(`${yearNum}-${mStr}`);
  }
  return months;
};

/**
 * Parse a Jalali date string 'YYYY/MM/DD' into an object { year, month, day }.
 * Returns null if the string is invalid or empty.
 */
const parseDateString = (dateString) => {
  if (!dateString) return null;
  const parts = dateString.split('/');
  if (parts.length !== 3) return null;
  return {
    year: parseInt(parts[0], 10),
    month: parseInt(parts[1], 10),
    day: parseInt(parts[2], 10),
  };
};

export {
  getYear,
  getYearMonth,
  getDay,
  getCurrentJalaliInfo,
  last12MonthsList,
  parseDateString, // Added for reuse (AddTransactionForm, etc.)
};
