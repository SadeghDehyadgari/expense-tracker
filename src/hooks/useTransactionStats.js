import { useMemo } from 'react';
import {
  getDay,
  getYear,
  getYearMonth,
  getCurrentJalaliInfo,
  last12MonthsList,
} from '../utils/jalaliDateUtils';

const useTransactionStats = (filteredTransactions, timeRange, effectiveMonth, chartRange) => {
  // 🔽 NEW: Filter transactions based on chartRange when timeRange is 'overall'.
  // This ensures totals, pieData, and bar chart all reflect the same subset.
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
  // 🔼 END NEW

  // 🔽 PERFORMANCE OPTIMIZATION: Compute totals and chart data in a single pass
  // Previously totals and baseChartData were computed in separate useMemos,
  // causing two iterations over effectiveTransactions. Now merged into one.
  const { totals, chartData } = useMemo(() => {
    let income = 0;
    let expense = 0;

    // For daily/monthly grouping
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

    // Build chart data from map
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
  // 🔼 END PERFORMANCE OPTIMIZATION

  // pieData derived from totals (unchanged)
  const pieData = useMemo(() => {
    const data = [];
    if (totals.totalIncome > 0)
      data.push({ name: 'درآمد', value: totals.totalIncome, color: '#3ebd93' });
    if (totals.totalExpense > 0)
      data.push({ name: 'هزینه', value: totals.totalExpense, color: '#ef4e4e' });
    return data;
  }, [totals]);

  return { totals, pieData, chartData };
};

export default useTransactionStats;
