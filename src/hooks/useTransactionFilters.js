import { useState, useMemo } from 'react';

const useTransactionFilters = (availableYears, availableMonths) => {
  const [timeRange, setTimeRange] = useState('overall');
  const [rawYear, setRawYear] = useState('');
  const [rawMonth, setRawMonth] = useState('');
  const [chartRange, setChartRange] = useState('all');

  const effectiveYear = useMemo(() => {
    if (rawYear && availableYears.includes(rawYear)) return rawYear;
    return availableYears[0] || '';
  }, [rawYear, availableYears]);

  const effectiveMonth = useMemo(() => {
    if (rawMonth && availableMonths.includes(rawMonth)) return rawMonth;
    return availableMonths[0] || '';
  }, [rawMonth, availableMonths]);

  const handleRangeChange = (e) => setTimeRange(e.target.value);
  const handleYearChange = (value) => setRawYear(value);
  const handleMonthChange = (value) => setRawMonth(value);

  return {
    timeRange,
    effectiveYear,
    effectiveMonth,
    chartRange,
    setChartRange,
    handlers: {
      handleRangeChange,
      handleYearChange,
      handleMonthChange,
    },
  };
};

export default useTransactionFilters;
