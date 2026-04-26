import { useMemo } from 'react';
import { getYear, getYearMonth } from '../utils/jalaliDateUtils';

const useAvailableDates = (allTransactions) => {
  return useMemo(() => {
    const years = new Set();
    const months = new Set();
    allTransactions.forEach((t) => {
      if (t.date) {
        years.add(getYear(t.date));
        months.add(getYearMonth(t.date));
      }
    });
    const sortedYears = Array.from(years).sort((a, b) => b.localeCompare(a));
    const sortedMonths = Array.from(months).sort((a, b) => b.localeCompare(a));
    return {
      availableYears: sortedYears,
      availableMonths: sortedMonths,
    };
  }, [allTransactions]);
};

export default useAvailableDates;
