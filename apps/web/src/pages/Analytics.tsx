import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { getChartData, getSummary, formatCurrency, toInputDate } from '@finance/core';
import { useTransactions } from '../context/TransactionContext';

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-600/50 bg-surface-raised px-4 py-3 shadow-card">
      <p className="mb-2 text-sm font-medium text-slate-300">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
}

export default function Analytics() {
  const { transactions } = useTransactions();
  const chartData = useMemo(() => getChartData(transactions), [transactions]);
  const summary = getSummary(transactions);

  const formattedChartData = chartData.map((d) => ({
    ...d,
    label: toInputDate(d.date),
  }));

  const categoryBreakdown = useMemo(() => {
    const expenses = transactions.filter((t) => t.category === 'Expense');
    const byDesc = new Map<string, number>();
    for (const t of expenses) {
      const key = t.description || 'Other';
      byDesc.set(key, (byDesc.get(key) ?? 0) + t.amount);
    }
    return Array.from(byDesc.entries())
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8);
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="mx-auto max-w-4xl">
        <h2 className="text-2xl font-bold text-white md:text-3xl">Analytics</h2>
        <p className="mt-8 text-center text-slate-500">
          Add transactions to see charts and insights.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white md:text-3xl">Analytics</h2>
        <p className="mt-1 text-slate-400">Income vs expenses over time</p>
      </div>

      {/* Summary pills */}
      <div className="flex flex-wrap gap-3">
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400">
          Income: {formatCurrency(summary.income)}
        </span>
        <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 text-sm text-rose-400">
          Expenses: {formatCurrency(summary.expense)}
        </span>
        <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-400">
          Net: {formatCurrency(summary.netSavings)}
        </span>
      </div>

      {/* Area chart */}
      <div className="card">
        <h3 className="mb-6 text-lg font-semibold text-white">Income & Expenses Over Time</h3>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={formattedChartData}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="label" stroke="#64748b" fontSize={12} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#10b981"
              fill="url(#incomeGrad)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="expense"
              name="Expense"
              stroke="#f43f5e"
              fill="url(#expenseGrad)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Expense breakdown bar chart */}
      {categoryBreakdown.length > 0 && (
        <div className="card">
          <h3 className="mb-6 text-lg font-semibold text-white">Top Expenses</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryBreakdown} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
              <XAxis type="number" stroke="#64748b" fontSize={12} tickFormatter={(v) => `$${v}`} />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#64748b"
                fontSize={12}
                width={100}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                formatter={(value: number) => [formatCurrency(value), 'Amount']}
              />
              <Bar dataKey="amount" name="Amount" fill="#f43f5e" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
