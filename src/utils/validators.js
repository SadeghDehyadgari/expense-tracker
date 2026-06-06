/**
 * Returns an error message if the given value is a non-empty string
 * that does not represent a positive number; otherwise returns empty string.
 *
 * @param {string} value - The amount string (English digits expected).
 * @returns {string} Error message or empty string.
 */
export function getAmountError(value) {
  if (!value) return '';
  const num = Number(value);
  if (isNaN(num) || num <= 0) {
    return 'مبلغ باید بزرگتر از صفر باشد';
  }
  return '';
}
