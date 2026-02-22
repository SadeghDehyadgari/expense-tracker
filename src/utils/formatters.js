export const toPersianDigits = (value) => {
  if (!value && value !== 0) return '';
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return value.toString().replace(/\d/g, (digit) => persianDigits[digit]);
};

export const formatNumber = (value) => {
  if (value === undefined || value === null) return '';
  // Persian locale
  return value.toLocaleString('fa-IR');
};

export const formatPercentage = (value) => {
  if (value === undefined || value === null) return '';
  // Turn percentage into Persian digits
  return toPersianDigits(value.toFixed(0));
};
