const toEnglishDigits = (str) => {
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

export default toEnglishDigits;
