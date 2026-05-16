import { useState, useMemo } from 'react';
import { formatJalaliDate } from '../utils/jalaliDateUtils'; // NEW: import date utils

/**
 * Custom hook for filtering and sorting transactions.
 * Command-Query Separation: setters = commands, filteredTransactions = query.
 *
 * @param {Array} transactions - raw transactions array from context
 * @returns {Object} - filteredTransactions, filter states, and setter functions
 */
const useTransactionFilters = (transactions) => {
  const [fromDate, setFromDate] = useState(''); // CHANGED: rename to avoid conflict
  const [toDate, setToDate] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'oldest', 'highest', 'lowest'
  // NEW: object states for date picker
  const [fromDateObj, setFromDateObjState] = useState(null);
  const [toDateObj, setToDateObjState] = useState(null);

  // NEW: setFromDateObj – for direct use by date picker
  const setFromDateObj = (dateObj) => {
    setFromDateObjState(dateObj);
    const formatted = formatJalaliDate(dateObj);
    setFromDate(formatted);
  };

  // NEW: setToDateObj – for direct use by date picker
  const setToDateObj = (dateObj) => {
    setToDateObjState(dateObj);
    const formatted = formatJalaliDate(dateObj);
    setToDate(formatted);
  };

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Filter by date range (strings in format YYYY/MM/DD)
    if (fromDate) {
      filtered = filtered.filter((t) => t.date >= fromDate);
    }
    if (toDate) {
      filtered = filtered.filter((t) => t.date <= toDate);
    }

    // Sort only if a valid sortOrder is selected
    if (sortOrder === 'newest') {
      filtered.sort((a, b) => b.date.localeCompare(a.date));
    } else if (sortOrder === 'oldest') {
      filtered.sort((a, b) => a.date.localeCompare(b.date));
    } else if (sortOrder === 'highest') {
      filtered.sort((a, b) => b.income + b.expense - (a.income + a.expense));
    } else if (sortOrder === 'lowest') {
      filtered.sort((a, b) => a.income + a.expense - (b.income + b.expense));
    }

    return filtered;
  }, [transactions, fromDate, toDate, sortOrder]);

  return {
    filteredTransactions,
    sortOrder,
    setSortOrder,
    // NEW: exports for date picker
    fromDateObj,
    toDateObj,
    setFromDateObj,
    setToDateObj,
  };
};

export default useTransactionFilters;
