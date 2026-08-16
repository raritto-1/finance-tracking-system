import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, PiggyBank, Plus } from 'lucide-react';
import { getSummary, formatCurrency } from '@finance/core';
import { useTransactions } from '../context/TransactionContext';
import StatCard from '../components/StatCard';
import TransactionRow from '../components/TransactionRow';

export default function Dashboard() {
  const { transactions } = useTransactions();
  const summary = getSummary(transactions);
  const recent = transactions.slice(0, 8);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white md:text-3xl">Dashboard</h2>
          <p className="mt-1 text-slate-400">Overview of your finances</p>
        </div>
        <Link to="/add" className="btn-primary">
          <Plus className="h-4 w-4" />
          Add Transaction
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Income"
          value={formatCurrency(summary.income)}
          icon={TrendingUp}
          variant="income"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(summary.expense)}
          icon={TrendingDown}
          variant="expense"
        />
        <StatCard
          title="Net Savings"
          value={formatCurrency(summary.netSavings)}
          icon={PiggyBank}
          variant="savings"
          trend={summary.netSavings >= 0 ? 'You are saving money' : 'Spending exceeds income'}
        />
      </div>

      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
          <Link to="/transactions" className="text-sm text-indigo-400 hover:text-indigo-300">
            View all →
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-slate-500">No transactions yet.</p>
            <Link to="/add" className="mt-3 inline-block text-sm text-indigo-400 hover:text-indigo-300">
              Add your first transaction →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-700/30">
            {recent.map((tx) => (
              <TransactionRow key={tx.id} transaction={tx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
