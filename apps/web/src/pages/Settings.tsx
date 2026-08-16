import { useRef, useState } from 'react';
import { Download, Upload, Trash2, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';

export default function Settings() {
  const { transactions, importCSV, exportToCSV, clearAll } = useTransactions();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const showMsg = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const count = importCSV(text, false);
      showMsg('success', `Imported ${count} transactions successfully.`);
    };
    reader.onerror = () => showMsg('error', 'Failed to read file.');
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExport = () => {
    const csv = exportToCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance_data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showMsg('success', 'CSV exported successfully.');
  };

  const handleLoadSample = async () => {
    try {
      const res = await fetch('/sample-data.csv');
      const text = await res.text();
      const count = importCSV(text, false);
      showMsg('success', `Loaded ${count} sample transactions.`);
    } catch {
      showMsg('error', 'Failed to load sample data.');
    }
  };

  const handleClear = () => {
    clearAll();
    setShowClearConfirm(false);
    showMsg('success', 'All transactions cleared.');
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white md:text-3xl">Settings</h2>
        <p className="mt-1 text-slate-400">Manage your data locally</p>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
            message.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-rose-500/10 text-rose-400'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          {message.text}
        </div>
      )}

      <div className="card space-y-4">
        <div className="flex items-center gap-3">
          <Database className="h-5 w-5 text-indigo-400" />
          <div>
            <p className="font-medium text-white">Storage</p>
            <p className="text-sm text-slate-500">
              {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} saved locally
            </p>
          </div>
        </div>
      </div>

      <div className="card space-y-3">
        <h3 className="font-semibold text-white">Import / Export</h3>
        <p className="text-sm text-slate-500">
          Import from CSV (supports legacy format with &quot;discription&quot; column) or export
          your data.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleImport}
          className="hidden"
        />

        <button onClick={() => fileInputRef.current?.click()} className="btn-primary w-full">
          <Upload className="h-4 w-4" />
          Import CSV
        </button>

        <button onClick={handleExport} className="btn-ghost w-full border border-slate-600/50">
          <Download className="h-4 w-4" />
          Export CSV
        </button>

        <button onClick={handleLoadSample} className="btn-ghost w-full border border-slate-600/50">
          <Database className="h-4 w-4" />
          Load Sample Data
        </button>
      </div>

      <div className="card space-y-3 border-rose-500/20">
        <h3 className="font-semibold text-rose-400">Danger Zone</h3>
        {!showClearConfirm ? (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/30 px-4 py-2.5 text-sm font-medium text-rose-400 transition hover:bg-rose-500/10"
          >
            <Trash2 className="h-4 w-4" />
            Clear All Data
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-slate-400">
              This will permanently delete all {transactions.length} transactions. Are you sure?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleClear}
                className="flex-1 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-600"
              >
                Yes, delete all
              </button>
              <button onClick={() => setShowClearConfirm(false)} className="btn-ghost flex-1">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
