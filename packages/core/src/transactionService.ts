import type { ChartDataPoint, Summary, Transaction } from './types';
import { parseDisplayDate } from './utils';

export function getSummary(transactions: Transaction[]): Summary {
  const income = transactions
    .filter((t) => t.category === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter((t) => t.category === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);
  return { income, expense, netSavings: income - expense };
}

export function filterByDateRange(
  transactions: Transaction[],
  startDate: string,
  endDate: string
): Transaction[] {
  const start = parseDisplayDate(startDate);
  const end = parseDisplayDate(endDate);
  end.setHours(23, 59, 59, 999);

  return transactions
    .filter((t) => {
      const date = parseDisplayDate(t.date);
      return date >= start && date <= end;
    })
    .sort((a, b) => parseDisplayDate(b.date).getTime() - parseDisplayDate(a.date).getTime());
}

export function getChartData(transactions: Transaction[]): ChartDataPoint[] {
  const byDate = new Map<string, ChartDataPoint>();

  for (const t of transactions) {
    const existing = byDate.get(t.date) ?? { date: t.date, income: 0, expense: 0 };
    if (t.category === 'Income') existing.income += t.amount;
    else existing.expense += t.amount;
    byDate.set(t.date, existing);
  }

  return Array.from(byDate.values()).sort(
    (a, b) => parseDisplayDate(a.date).getTime() - parseDisplayDate(b.date).getTime()
  );
}

export function validateTransaction(input: {
  date: string;
  amount: number;
  category: string;
}): string | null {
  if (!input.date) return 'Date is required.';
  try {
    parseDisplayDate(input.date);
  } catch {
    return 'Date must be in dd-mm-yyyy format.';
  }
  if (Number.isNaN(input.amount) || input.amount < 0) return 'Amount must be a non-negative number.';
  if (input.category !== 'Income' && input.category !== 'Expense') return 'Invalid category.';
  return null;
}
