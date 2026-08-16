import type { Category, Transaction } from './types';
import { generateId } from './utils';

export function parseCSV(csvText: string): Transaction[] {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  return lines.slice(1).flatMap((line) => {
    if (!line.trim()) return [];
    const parts = line.split(',');
    if (parts.length < 4) return [];

    const [date, amountStr, category, ...descParts] = parts;
    const description = descParts.join(',').trim();
    const amount = parseFloat(amountStr);
    const normalizedCategory = category.trim() as Category;

    if (Number.isNaN(amount)) return [];
    if (normalizedCategory !== 'Income' && normalizedCategory !== 'Expense') return [];

    return [
      {
        id: generateId(),
        date: date.trim(),
        amount,
        category: normalizedCategory,
        description,
      },
    ];
  });
}

export function exportCSV(transactions: Transaction[]): string {
  const header = 'date,amount,category,description';
  const rows = transactions.map(
    (t) => `${t.date},${t.amount},${t.category},"${t.description.replace(/"/g, '""')}"`
  );
  return [header, ...rows].join('\n');
}
