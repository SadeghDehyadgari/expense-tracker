import { useState, useMemo } from 'react';
import {
  getDay,
  getYear,
  getYearMonth,
  getCurrentJalaliInfo,
  last12MonthsList,
} from '../utils/jalaliDateUtils';

/**
 * REFACTOR: Single hook consolidating:
 *   useAvailableDates, useTransactionFilters,
 *   useFilteredTransactions, useTransactionStats
 * Takes the full transaction list and returns all dashboard data.
 */
const useDashboardData = (allTransactions) => {
  // ---- Available dates (originally useAvailableDates) ----
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

  // ---- Filter state (originally useTransactionFilters) ----
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

  // ---- Filtered transactions (originally useFilteredTransactions) ----
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

  // ---- Effective transactions for chart (originally useTransactionStats) ----
  const effectiveTransactions = useMemo(() => {
    if (timeRange !== 'overall' || chartRange === 'all') {
      return filteredTransactions;
    }
    const { year: currentYear } = getCurrentJalaliInfo();
    if (chartRange === 'currentYear') {
      return filteredTransactions.filter((t) => t.date && getYear(t.date) === currentYear);
    }
    if (chartRange === 'last12Months') {
      const last12 = last12MonthsList();
      return filteredTransactions.filter((t) => t.date && last12.includes(getYearMonth(t.date)));
    }
    return filteredTransactions;
  }, [filteredTransactions, timeRange, chartRange]);

  // ---- Totals & chart data (merged calculation) ----
  const { totals, chartData } = useMemo(() => {
    let income = 0;
    let expense = 0;
    const dataMap = new Map();

    effectiveTransactions.forEach((t) => {
      if (!t.date) return;

      // Totals accumulation
      if (t.income) income += t.income;
      if (t.expense) expense += t.expense;

      // Chart data accumulation
      if (timeRange === 'month' && effectiveMonth) {
        const day = getDay(t.date);
        if (!dataMap.has(day)) {
          dataMap.set(day, { day, income: 0, expense: 0 });
        }
        const entry = dataMap.get(day);
        if (t.income) entry.income += t.income;
        if (t.expense) entry.expense += t.expense;
      } else {
        const yearMonth = getYearMonth(t.date);
        if (!dataMap.has(yearMonth)) {
          dataMap.set(yearMonth, { month: yearMonth, income: 0, expense: 0 });
        }
        const entry = dataMap.get(yearMonth);
        if (t.income) entry.income += t.income;
        if (t.expense) entry.expense += t.expense;
      }
    });

    const totalsResult = {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
    };

    let chartDataResult = [];
    if (effectiveTransactions.length > 0) {
      if (timeRange === 'month' && effectiveMonth) {
        chartDataResult = Array.from(dataMap.values()).sort((a, b) => a.day - b.day);
      } else {
        chartDataResult = Array.from(dataMap.values()).sort((a, b) =>
          a.month.localeCompare(b.month)
        );
      }
    }

    return { totals: totalsResult, chartData: chartDataResult };
  }, [effectiveTransactions, timeRange, effectiveMonth]);

  // ---- Pie data derived from totals ----
  const pieData = useMemo(() => {
    const data = [];
    if (totals.totalIncome > 0)
      data.push({ name: 'درآمد', value: totals.totalIncome, color: '#3ebd93' });
    if (totals.totalExpense > 0)
      data.push({ name: 'هزینه', value: totals.totalExpense, color: '#ef4e4e' });
    return data;
  }, [totals]);

  return {
    // available dates
    availableYears,
    availableMonths,
    // filter state & handlers
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
    // aggregated stats
    totals,
    pieData,
    chartData,
  };
};

export default useDashboardData;
