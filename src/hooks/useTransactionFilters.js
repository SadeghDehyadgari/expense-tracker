import { useState, useMemo } from 'react';

/**
 * Custom hook for filtering and sorting transactions.
 * Command-Query Separation: setters = commands, filteredTransactions = query.
 *
 * @param {Array} transactions - raw transactions array from context
 * @returns {Object} - filteredTransactions, filter states, and setter functions
 */
const useTransactionFilters = (transactions) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  // CHANGED: default sortOrder is now empty string (no sorting, placeholder selected)
  const [sortOrder, setSortOrder] = useState(''); // '', 'newest', 'oldest', 'highest', 'lowest'

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Filter by date range (strings in format YYYY/MM/DD)
    if (fromDate) {
      filtered = filtered.filter((t) => t.date >= fromDate);
    }
    if (toDate) {
      filtered = filtered.filter((t) => t.date <= toDate);
    }

    // Sort only if a valid sortOrder is selected (not empty)
    if (sortOrder === 'newest') {
      filtered.sort((a, b) => b.date.localeCompare(a.date));
    } else if (sortOrder === 'oldest') {
      filtered.sort((a, b) => a.date.localeCompare(b.date));
    } else if (sortOrder === 'highest') {
      filtered.sort((a, b) => b.income + b.expense - (a.income + a.expense));
    } else if (sortOrder === 'lowest') {
      filtered.sort((a, b) => a.income + a.expense - (b.income + b.expense));
    }
    // If sortOrder is empty, do not sort (keep original order from context)

    return filtered;
  }, [transactions, fromDate, toDate, sortOrder]);

  return {
    filteredTransactions,
    fromDate,
    toDate,
    sortOrder,
    setFromDate,
    setToDate,
    setSortOrder,
  };
};

export default useTransactionFilters;
