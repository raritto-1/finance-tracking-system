export type Category = 'Income' | 'Expense';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: Category;
  description: string;
}

export interface Summary {
  income: number;
  expense: number;
  netSavings: number;
}

export interface ChartDataPoint {
  date: string;
  income: number;
  expense: number;
}

export interface DateRange {
  start: string;
  end: string;
}
