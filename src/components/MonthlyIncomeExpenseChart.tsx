import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Wallet, Calendar } from 'lucide-react';
import { Transaction } from '../types';
import { formatMoney } from '../utils/formatters';

interface MonthlyIncomeExpenseChartProps {
  transactions: Transaction[];
  currency: string;
}

const SOMALI_MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

interface MonthlyDataPoint {
  monthKey: string;
  monthName: string;
  fullLabel: string;
  dakhli: number;
  kharash: number;
  baaqi: number;
}

export const MonthlyIncomeExpenseChart: React.FC<MonthlyIncomeExpenseChartProps> = ({
  transactions,
  currency,
}) => {
  const [showNetLine, setShowNetLine] = useState(true);

  // Compute the last 6 months data chronologically
  const chartData = useMemo<MonthlyDataPoint[]>(() => {
    const now = new Date();
    const months: MonthlyDataPoint[] = [];

    // Generate last 6 months from 5 months ago to current month
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const monthIndex = d.getMonth();
      const monthKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
      const monthName = SOMALI_MONTH_NAMES[monthIndex];
      const fullLabel = `${monthName} ${year}`;

      months.push({
        monthKey,
        monthName,
        fullLabel,
        dakhli: 0,
        kharash: 0,
        baaqi: 0,
      });
    }

    // Accumulate transactions into each month bucket
    transactions.forEach((tx) => {
      if (!tx.date) return;
      const txMonthKey = tx.date.slice(0, 7); // 'YYYY-MM'
      const bucket = months.find((m) => m.monthKey === txMonthKey);

      if (bucket) {
        if (tx.type === 'dakhli') {
          bucket.dakhli += Number(tx.amount) || 0;
        } else if (tx.type === 'kharash') {
          bucket.kharash += Number(tx.amount) || 0;
        }
      }
    });

    // Calculate net balance (baaqi) for each month
    months.forEach((m) => {
      m.baaqi = m.dakhli - m.kharash;
    });

    return months;
  }, [transactions]);

  // Overall 6-month aggregate statistics
  const totals = useMemo(() => {
    const totalIncome = chartData.reduce((acc, m) => acc + m.dakhli, 0);
    const totalExpense = chartData.reduce((acc, m) => acc + m.kharash, 0);
    const totalNet = totalIncome - totalExpense;
    const avgExpense = totalExpense / 6;

    return { totalIncome, totalExpense, totalNet, avgExpense };
  }, [chartData]);

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: MonthlyDataPoint = payload[0].payload;
      return (
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-3.5 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 text-xs min-w-[200px]">
          <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{data.fullLabel}</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                Income:
              </span>
              <strong className="text-emerald-700 dark:text-emerald-400 font-bold">
                {formatMoney(data.dakhli, currency)}
              </strong>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                Expenses:
              </span>
              <strong className="text-rose-600 dark:text-rose-400 font-bold">
                {formatMoney(data.kharash, currency)}
              </strong>
            </div>
            <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Net Balance:</span>
              <strong
                className={`font-bold ${
                  data.baaqi >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {data.baaqi >= 0 ? '+' : ''}
                {formatMoney(data.baaqi, currency)}
              </strong>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section
      id="income-expense-line-chart-section"
      className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-md shadow-slate-950/5 dark:shadow-none"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-800">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Income vs Expenses (Last 6 Months)
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 pl-10">
            6-month trajectory tracking your income, expenses, and net savings
          </p>
        </div>

        {/* Display Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer select-none bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-200/60 dark:border-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={showNetLine}
              onChange={(e) => setShowNetLine(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer"
            />
            <span>Show Net Line</span>
          </label>
        </div>
      </div>

      {/* Aggregate Stats Badges with colorful gradients */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/40 dark:to-teal-950/20 border-2 border-emerald-300/60 dark:border-emerald-800/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">
              6-Month Income
            </span>
            <div className="text-lg font-black text-emerald-700 dark:text-emerald-300 mt-0.5">
              +{formatMoney(totals.totalIncome, currency)}
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30">
            <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-orange-50/50 dark:from-rose-950/40 dark:to-orange-950/20 border-2 border-rose-300/60 dark:border-rose-800/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wide">
              6-Month Expenses
            </span>
            <div className="text-lg font-black text-rose-700 dark:text-rose-300 mt-0.5">
              -{formatMoney(totals.totalExpense, currency)}
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/30">
            <ArrowDownRight className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>

        <div
          className={`p-4 rounded-2xl border-2 flex items-center justify-between ${
            totals.totalNet >= 0
              ? 'bg-gradient-to-br from-indigo-50 to-sky-50/50 dark:from-indigo-950/40 dark:to-sky-950/20 border-indigo-300/60 dark:border-indigo-800/60'
              : 'bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-950/40 dark:to-orange-950/20 border-amber-300/60 dark:border-amber-800/60'
          }`}
        >
          <div>
            <span
              className={`text-[11px] font-bold uppercase tracking-wide ${
                totals.totalNet >= 0 ? 'text-indigo-800 dark:text-indigo-300' : 'text-amber-800 dark:text-amber-300'
              }`}
            >
              6-Month Net Savings
            </span>
            <div
              className={`text-lg font-black mt-0.5 ${
                totals.totalNet >= 0 ? 'text-indigo-700 dark:text-indigo-300' : 'text-amber-700 dark:text-amber-300'
              }`}
            >
              {totals.totalNet >= 0 ? '+' : ''}
              {formatMoney(totals.totalNet, currency)}
            </div>
          </div>
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md ${
              totals.totalNet >= 0
                ? 'bg-indigo-600 shadow-indigo-600/30'
                : 'bg-amber-600 shadow-amber-600/30'
            }`}
          >
            <Wallet className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* Recharts Responsive Line Chart */}
      <div className="w-full h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-100 dark:text-slate-800" vertical={false} />
            <XAxis
              dataKey="monthName"
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#94a3b8', opacity: 0.3 }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${val}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: '16px', fontSize: '12px' }}
              iconType="circle"
              formatter={(value) => {
                if (value === 'dakhli') return <span className="text-slate-700 dark:text-slate-300 font-semibold mr-3">Income</span>;
                if (value === 'kharash') return <span className="text-slate-700 dark:text-slate-300 font-semibold mr-3">Expenses</span>;
                if (value === 'baaqi') return <span className="text-slate-700 dark:text-slate-300 font-semibold">Net Balance</span>;
                return value;
              }}
            />
            <Line
              type="monotone"
              dataKey="dakhli"
              name="dakhli"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4, fill: '#10b981', strokeWidth: 1, stroke: '#ffffff' }}
              activeDot={{ r: 6, fill: '#059669', strokeWidth: 2, stroke: '#ffffff' }}
            />
            <Line
              type="monotone"
              dataKey="kharash"
              name="kharash"
              stroke="#f43f5e"
              strokeWidth={3}
              dot={{ r: 4, fill: '#f43f5e', strokeWidth: 1, stroke: '#ffffff' }}
              activeDot={{ r: 6, fill: '#e11d48', strokeWidth: 2, stroke: '#ffffff' }}
            />
            {showNetLine && (
              <Line
                type="monotone"
                dataKey="baaqi"
                name="baaqi"
                stroke="#0284c7"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#0284c7', strokeWidth: 1, stroke: '#ffffff' }}
                activeDot={{ r: 5, fill: '#0369a1' }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};
