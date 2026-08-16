import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { fromInputDate } from '@finance/core';
import type { Category } from '@finance/core';
import { useTransactions } from '../context/TransactionContext';

export default function AddTransaction() {
  const navigate = useNavigate();
  const { addTransaction } = useTransactions();

  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Expense');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const err = addTransaction({
      date: fromInputDate(date),
      amount: parseFloat(amount),
      category,
      description: description.trim(),
    });

    if (err) {
      setError(err);
      return;
    }

    setSuccess(true);
    setAmount('');
    setDescription('');
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white md:text-3xl">Add Transaction</h2>
        <p className="mt-1 text-slate-400">Record a new income or expense</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        {/* Category toggle */}
        <div>
          <label className="label">Category</label>
          <div className="grid grid-cols-2 gap-3">
            {(['Income', 'Expense'] as Category[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`rounded-xl border py-3 text-sm font-semibold transition ${
                  category === cat
                    ? cat === 'Income'
                      ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-400'
                      : 'border-rose-500/50 bg-rose-500/15 text-rose-400'
                    : 'border-slate-600/50 text-slate-400 hover:border-slate-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="date" className="label">
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-field"
            required
          />
        </div>

        <div>
          <label htmlFor="amount" className="label">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
            <input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="input-field pl-8"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="label">
            Description <span className="text-slate-600">(optional)</span>
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Groceries, Salary, Coffee..."
            className="input-field"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            Transaction added successfully!
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primary flex-1">
            Save Transaction
          </button>
          <button type="button" onClick={() => navigate('/')} className="btn-ghost">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
