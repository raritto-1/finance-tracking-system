import { useMemo, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import {
  filterByDateRange,
  getSummary,
  formatCurrency,
  fromInputDate,
  toInputDate,
} from '@finance/core';
import { useTransactions } from '../context/TransactionContext';
import TransactionRow from '../components/TransactionRow';

export default function Transactions() {
  const { transactions, deleteTransaction } = useTransactions();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Income' | 'Expense'>('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...transactions];

    if (startDate && endDate) {
      result = filterByDateRange(result, fromInputDate(startDate), fromInputDate(endDate));
    }

    if (categoryFilter !== 'All') {
      result = result.filter((t) => t.category === categoryFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.date.includes(q)
      );
    }

    return result.sort(
      (a, b) =>
        new Date(toInputDate(b.date)).getTime() - new Date(toInputDate(a.date)).getTime()
    );
  }, [transactions, search, categoryFilter, startDate, endDate]);

  const summary = getSummary(filtered);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white md:text-3xl">Transactions</h2>
        <p className="mt-1 text-slate-400">
          {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Search & filters */}
      <div className="card space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by description, category, date..."
              className="input-field pl-10"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-ghost ${showFilters ? 'bg-surface-overlay text-white' : ''}`}
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid gap-4 border-t border-slate-700/40 pt-4 sm:grid-cols-3">
            <div>
              <label className="label">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as typeof categoryFilter)}
                className="input-field"
              >
                <option value="All">All</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
            </div>
            <div>
              <label className="label">From</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">To</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        )}
      </div>

      {/* Summary bar */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-center">
            <p className="text-xs text-slate-500">Income</p>
            <p className="font-semibold text-emerald-400">{formatCurrency(summary.income)}</p>
          </div>
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-center">
            <p className="text-xs text-slate-500">Expense</p>
            <p className="font-semibold text-rose-400">{formatCurrency(summary.expense)}</p>
          </div>
          <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 px-4 py-3 text-center">
            <p className="text-xs text-slate-500">Net</p>
            <p className="font-semibold text-violet-400">{formatCurrency(summary.netSavings)}</p>
          </div>
        </div>
      )}

      {/* List */}
      <div className="card">
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-slate-500">No transactions match your filters.</p>
        ) : (
          <div className="divide-y divide-slate-700/30">
            {filtered.map((tx) => (
              <TransactionRow
                key={tx.id}
                transaction={tx}
                showDelete
                onDelete={deleteTransaction}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
