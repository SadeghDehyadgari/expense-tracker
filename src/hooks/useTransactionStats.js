import { useMemo } from 'react';
import {
  getDay,
  getYearMonth,
  getCurrentJalaliInfo,
  last12MonthsList,
} from '../utils/jalaliDateUtils';

const useTransactionStats = (filteredTransactions, timeRange, effectiveMonth, chartRange) => {
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

  const baseChartData = useMemo(() => {
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

  const chartData = useMemo(() => {
    if (timeRange !== 'overall') {
      return baseChartData;
    }
    if (chartRange === 'all') {
      return baseChartData;
    }
    const { year: currentYear } = getCurrentJalaliInfo();
    if (chartRange === 'currentYear') {
      return baseChartData.filter((item) => item.month && getYearMonth(item.month) === currentYear);
    }
    if (chartRange === 'last12Months') {
      const last12 = last12MonthsList();
      return baseChartData.filter((item) => item.month && last12.includes(item.month));
    }
    return baseChartData;
  }, [baseChartData, chartRange, timeRange]);

  return { totals, pieData, chartData };
};

export default useTransactionStats;
