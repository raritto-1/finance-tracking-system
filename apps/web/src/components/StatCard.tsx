import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  variant?: 'default' | 'income' | 'expense' | 'savings';
}

const variantStyles = {
  default: 'from-indigo-500/10 to-transparent border-indigo-500/20',
  income: 'from-emerald-500/10 to-transparent border-emerald-500/20',
  expense: 'from-rose-500/10 to-transparent border-rose-500/20',
  savings: 'from-violet-500/10 to-transparent border-violet-500/20',
};

const iconStyles = {
  default: 'bg-indigo-500/20 text-indigo-400',
  income: 'bg-emerald-500/20 text-emerald-400',
  expense: 'bg-rose-500/20 text-rose-400',
  savings: 'bg-violet-500/20 text-violet-400',
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  variant = 'default',
}: StatCardProps) {
  return (
    <div
      className={`card bg-gradient-to-br ${variantStyles[variant]} transition hover:border-slate-600/60`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-white md:text-3xl">{value}</p>
          {trend && <p className="mt-1 text-xs text-slate-500">{trend}</p>}
        </div>
        <div className={`rounded-xl p-3 ${iconStyles[variant]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
