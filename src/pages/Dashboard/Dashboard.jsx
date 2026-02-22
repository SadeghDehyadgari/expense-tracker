import { useCallback, useContext } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import TransactionContext from '../../context/TransactionContext';
import useDashboard from '../../hooks/useDashboard';
import { formatNumber, formatPercentage, toPersianDigits } from '../../utils/formatters';
import './Dashboard.css';

const COLORS = {
  green: '#3ebd93',
  red: '#ef4e4e',
};

const Dashboard = () => {
  const { state } = useContext(TransactionContext);
  const transactions = state.transactions;
  const { totalIncome, totalExpense, balance, monthlyData, pieData } = useDashboard(transactions);

  const renderPieLabel = useCallback(({ cx, cy, midAngle, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radiusOffset = 50;
    const radius = outerRadius + radiusOffset;
    const baseX = cx + radius * Math.cos(-midAngle * RADIAN);
    const baseY = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={baseX}
        y={baseY}
        fill="var(--neutrals-dark-2)"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="12"
        fontFamily="var(--font-family)"
      >
        {`${name} ${formatPercentage(percent * 100)}%`}
      </text>
    );
  }, []);

  if (transactions.length === 0) {
    return (
      <div className="dashboard-page">
        <div className="empty-state">
          <h2>داشبورد</h2>
          <p>هیچ تراکنشی یافت نشد. برای مشاهده آمار، تراکنش اضافه کنید.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-content">
        <div className="summary-cards">
          <div className="summary-card income">
            <span className="card-label">کل درآمد</span>
            <span className="card-value">{formatNumber(totalIncome)} تومان</span>
          </div>
          <div className="summary-card expense">
            <span className="card-label">کل هزینه</span>
            <span className="card-value">{formatNumber(totalExpense)} تومان</span>
          </div>
          <div className="summary-card balance">
            <span className="card-label">تراز</span>
            <span className="card-value">
              <span dir="ltr">{formatNumber(balance)}</span> تومان
            </span>
          </div>
        </div>

        <div className="charts-container">
          <div className="chart-card">
            <h3>نسبت درآمد به هزینه</h3>
            <ResponsiveContainer width="100%" height={350} className="chart-wrapper">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  label={renderPieLabel}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${formatNumber(value)} تومان`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {monthlyData.length > 0 && (
            <div className="chart-card">
              <h3>روند ماهانه درآمد و هزینه</h3>
              <ResponsiveContainer width="100%" height={350} className="chart-wrapper">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    height={70}
                    tick={{ fontSize: 12, fontFamily: 'var(--font-family)' }}
                    tickMargin={15}
                    tickFormatter={toPersianDigits}
                  />
                  <YAxis
                    tickFormatter={formatNumber}
                    tick={{ fontSize: 12, fontFamily: 'var(--font-family)' }}
                    tickMargin={60}
                  />
                  <Tooltip
                    formatter={(value) => `${formatNumber(value)} تومان`}
                    labelFormatter={toPersianDigits}
                  />
                  <Legend wrapperStyle={{ paddingTop: 20 }} />
                  <Bar dataKey="income" fill={COLORS.green} name="درآمد" barSize={40} />
                  <Bar dataKey="expense" fill={COLORS.red} name="هزینه" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
