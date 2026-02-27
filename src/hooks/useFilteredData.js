import { useState, useMemo } from 'react';

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

const useFilteredData = (allTransactions) => {
  const [timeRange, setTimeRange] = useState('overall');
  const [rawYear, setRawYear] = useState('');
  const [rawMonth, setRawMonth] = useState('');

  const { availableYears, availableMonths } = useMemo(() => {
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

  const effectiveYear = useMemo(() => {
    if (rawYear && availableYears.includes(rawYear)) return rawYear;
    return availableYears[0] || '';
  }, [rawYear, availableYears]);

  const effectiveMonth = useMemo(() => {
    if (rawMonth && availableMonths.includes(rawMonth)) return rawMonth;
    return availableMonths[0] || '';
  }, [rawMonth, availableMonths]);

  const filteredTransactions = useMemo(() => {
    if (timeRange === 'overall') return allTransactions;
    if (timeRange === 'year' && effectiveYear) {
      return allTransactions.filter((t) => t.date && getYear(t.date) === effectiveYear);
    }
    if (timeRange === 'month' && effectiveMonth) {
      return allTransactions.filter((t) => t.date && getYearMonth(t.date) === effectiveMonth);
    }
    return [];
  }, [allTransactions, timeRange, effectiveYear, effectiveMonth]);

  const totals = useMemo(() => {
    let income = 0,
      expense = 0;
    filteredTransactions.forEach((t) => {
      if (t.income) income += t.income;
      if (t.expense) expense += t.expense;
    });
    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
    };
  }, [filteredTransactions]);

  const pieData = useMemo(() => {
    const data = [];
    if (totals.totalIncome > 0)
      data.push({ name: 'درآمد', value: totals.totalIncome, color: '#3ebd93' });
    if (totals.totalExpense > 0)
      data.push({ name: 'هزینه', value: totals.totalExpense, color: '#ef4e4e' });
    return data;
  }, [totals]);

  const chartData = useMemo(() => {
    if (filteredTransactions.length === 0) return [];

    if (timeRange === 'month' && effectiveMonth) {
      const dailyMap = new Map();
      filteredTransactions.forEach((t) => {
        if (!t.date) return;
        const day = getDay(t.date);
        if (!dailyMap.has(day)) {
          dailyMap.set(day, { day, income: 0, expense: 0 });
        }
        const entry = dailyMap.get(day);
        if (t.income) entry.income += t.income;
        if (t.expense) entry.expense += t.expense;
      });
      return Array.from(dailyMap.values()).sort((a, b) => a.day - b.day);
    } else {
      const monthlyMap = new Map();
      filteredTransactions.forEach((t) => {
        if (!t.date) return;
        const yearMonth = getYearMonth(t.date);
        if (!monthlyMap.has(yearMonth)) {
          monthlyMap.set(yearMonth, { month: yearMonth, income: 0, expense: 0 });
        }
        const entry = monthlyMap.get(yearMonth);
        if (t.income) entry.income += t.income;
        if (t.expense) entry.expense += t.expense;
      });
      return Array.from(monthlyMap.values()).sort((a, b) => a.month.localeCompare(b.month));
    }
  }, [filteredTransactions, timeRange, effectiveMonth]);

  const handleRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  const handleYearChange = (value) => {
    setRawYear(value);
  };

  const handleMonthChange = (value) => {
    setRawMonth(value);
  };

  return {
    timeRange,
    effectiveYear,
    effectiveMonth,
    availableYears,
    availableMonths,
    handlers: {
      handleRangeChange,
      handleYearChange,
      handleMonthChange,
    },
    totals,
    pieData,
    chartData,
  };
};

export default useFilteredData;
