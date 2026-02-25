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
import useFilteredData from '../../hooks/useFilteredData';
import {
  formatNumber,
  toPersianDigits,
  formatMonthLabel,
  formatMonthNumeric,
  formatDayLabel,
} from '../../utils/formatters';
import './Dashboard.css';

const COLORS = {
  green: '#3ebd93',
  red: '#ef4e4e',
};

const Dashboard = () => {
  const { state } = useContext(TransactionContext);
  const allTransactions = state.transactions;

  const {
    timeRange,
    effectiveYear,
    effectiveMonth,
    availableYears,
    availableMonths,
    handlers,
    totals,
    pieData,
    chartData,
  } = useFilteredData(allTransactions);

  const { totalIncome, totalExpense, balance } = totals;

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
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  }, []);

  if (allTransactions.length === 0) {
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
        <div className="filter-bar">
          <div className="filter-group">
            <label htmlFor="timeRange">بازه زمانی</label>
            <select
              id="timeRange"
              className="filter-select"
              value={timeRange}
              onChange={handlers.handleRangeChange}
            >
              <option value="overall">کلی</option>
              <option value="year">سالانه</option>
              <option value="month">ماهانه</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="yearSelect">سال</label>
            <select
              id="yearSelect"
              className="filter-select"
              value={effectiveYear}
              onChange={(e) => handlers.handleYearChange(e.target.value)}
              disabled={timeRange !== 'year'}
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {toPersianDigits(year)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="monthSelect">ماه</label>
            <select
              id="monthSelect"
              className="filter-select"
              value={effectiveMonth}
              onChange={(e) => handlers.handleMonthChange(e.target.value)}
              disabled={timeRange !== 'month'}
            >
              {availableMonths.map((ym) => (
                <option key={ym} value={ym}>
                  {formatMonthLabel(ym)}
                </option>
              ))}
            </select>
          </div>
        </div>

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

          {chartData.length > 0 && (
            <div className="chart-card">
              <h3>
                {timeRange === 'month' && 'روند روزانه درآمد و هزینه'}
                {timeRange === 'year' && 'روند ماهانه درآمد و هزینه'}
                {timeRange === 'overall' && 'روند ماهانه درآمد و هزینه'}
              </h3>
              <ResponsiveContainer width="100%" height={350} className="chart-wrapper">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey={timeRange === 'month' ? 'day' : 'month'}
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    height={70}
                    tick={{ fontSize: 12, fontFamily: 'var(--font-family)' }}
                    tickMargin={15}
                    tickFormatter={(value) => {
                      if (timeRange === 'month') {
                        return formatDayLabel(value);
                      } else {
                        return formatMonthNumeric(value);
                      }
                    }}
                  />
                  <YAxis
                    tickFormatter={formatNumber}
                    tick={{ fontSize: 12, fontFamily: 'var(--font-family)' }}
                    tickMargin={60}
                  />
                  <Tooltip
                    formatter={(value) => `${formatNumber(value)} تومان`}
                    labelFormatter={(label) => {
                      if (timeRange === 'month') {
                        return `روز ${formatDayLabel(label)}`;
                      } else {
                        return formatMonthNumeric(label);
                      }
                    }}
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
