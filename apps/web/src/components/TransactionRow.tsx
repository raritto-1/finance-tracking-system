import { ArrowDownLeft, ArrowUpRight, Trash2 } from 'lucide-react';
import type { Transaction } from '@finance/core';
import { formatCurrency } from '@finance/core';

interface TransactionRowProps {
  transaction: Transaction;
  onDelete?: (id: string) => void;
  showDelete?: boolean;
}

export default function TransactionRow({
  transaction,
  onDelete,
  showDelete = false,
}: TransactionRowProps) {
  const isIncome = transaction.category === 'Income';

  return (
    <div className="group flex items-center gap-4 rounded-xl border border-transparent px-4 py-3 transition hover:border-slate-700/40 hover:bg-surface-overlay/50">
      <div
        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
          isIncome ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
        }`}
      >
        {isIncome ? (
          <ArrowDownLeft className="h-5 w-5" />
        ) : (
          <ArrowUpRight className="h-5 w-5" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-white">
          {transaction.description || 'No description'}
        </p>
        <p className="text-xs text-slate-500">
          {transaction.date} · {transaction.category}
        </p>
      </div>

      <p
        className={`flex-shrink-0 font-semibold tabular-nums ${
          isIncome ? 'text-emerald-400' : 'text-rose-400'
        }`}
      >
        {isIncome ? '+' : '-'}
        {formatCurrency(transaction.amount)}
      </p>

      {showDelete && onDelete && (
        <button
          onClick={() => onDelete(transaction.id)}
          className="flex-shrink-0 rounded-lg p-2 text-slate-600 opacity-0 transition hover:bg-rose-500/10 hover:text-rose-400 group-hover:opacity-100"
          aria-label="Delete transaction"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
