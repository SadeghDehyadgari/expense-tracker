import { useMemo } from 'react';
import { getYear, getYearMonth } from '../utils/jalaliDateUtils';

const useFilteredTransactions = (allTransactions, timeRange, effectiveYear, effectiveMonth) => {
  return useMemo(() => {
    if (timeRange === 'overall') return allTransactions;
    if (timeRange === 'year' && effectiveYear) {
      return allTransactions.filter((t) => t.date && getYear(t.date) === effectiveYear);
    }
    if (timeRange === 'month' && effectiveMonth) {
      return allTransactions.filter((t) => t.date && getYearMonth(t.date) === effectiveMonth);
    }
    return [];
  }, [allTransactions, timeRange, effectiveYear, effectiveMonth]);
};

export default useFilteredTransactions;
