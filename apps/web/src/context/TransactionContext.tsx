import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  type Category,
  type Transaction,
  generateId,
  loadTransactions,
  saveTransactions,
  parseCSV,
  exportCSV,
  validateTransaction,
} from '@finance/core';

interface TransactionContextValue {
  transactions: Transaction[];
  addTransaction: (input: Omit<Transaction, 'id'>) => string | null;
  deleteTransaction: (id: string) => void;
  importCSV: (csvText: string, merge?: boolean) => number;
  exportToCSV: () => string;
  clearAll: () => void;
  isLoaded: boolean;
}

const TransactionContext = createContext<TransactionContextValue | null>(null);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTransactions(loadTransactions());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) saveTransactions(transactions);
  }, [transactions, isLoaded]);

  const addTransaction = useCallback((input: Omit<Transaction, 'id'>) => {
    const error = validateTransaction(input);
    if (error) return error;
    const tx: Transaction = { ...input, id: generateId() };
    setTransactions((prev) => [tx, ...prev]);
    return null;
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const importCSV = useCallback((csvText: string, merge = false) => {
    const imported = parseCSV(csvText);
    setTransactions((prev) => (merge ? [...imported, ...prev] : imported));
    return imported.length;
  }, []);

  const exportToCSV = useCallback(() => exportCSV(transactions), [transactions]);

  const clearAll = useCallback(() => setTransactions([]), []);

  const value = useMemo(
    () => ({
      transactions,
      addTransaction,
      deleteTransaction,
      importCSV,
      exportToCSV,
      clearAll,
      isLoaded,
    }),
    [transactions, addTransaction, deleteTransaction, importCSV, exportToCSV, clearAll, isLoaded]
  );

  return (
    <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>
  );
}

export function useTransactions() {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error('useTransactions must be used within TransactionProvider');
  return ctx;
}

export type { Category, Transaction };
