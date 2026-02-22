import { useMemo } from 'react';

const COLORS = {
  green: '#3ebd93',
  red: '#ef4e4e',
};

const useDashboard = (transactions) => {
  const { totalIncome, totalExpense, balance, monthlyData, pieData } = useMemo(() => {
    let income = 0;
    let expense = 0;
    const monthlyMap = new Map();

    transactions.forEach((t) => {
      if (t.income) income += t.income;
      if (t.expense) expense += t.expense;

      if (t.date) {
        const monthKey = t.date.substring(0, 7);
        if (!monthlyMap.has(monthKey)) {
          monthlyMap.set(monthKey, { month: monthKey, income: 0, expense: 0 });
        }
        const monthData = monthlyMap.get(monthKey);
        if (t.income) monthData.income += t.income;
        if (t.expense) monthData.expense += t.expense;
      }
    });

    const monthly = Array.from(monthlyMap.values()).sort((a, b) => a.month.localeCompare(b.month));

    const pie = [
      { name: 'درآمد', value: income, color: COLORS.green },
      { name: 'هزینه', value: expense, color: COLORS.red },
    ].filter((item) => item.value > 0);

    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
      monthlyData: monthly,
      pieData: pie,
    };
  }, [transactions]);

  return { totalIncome, totalExpense, balance, monthlyData, pieData };
};

export default useDashboard;
