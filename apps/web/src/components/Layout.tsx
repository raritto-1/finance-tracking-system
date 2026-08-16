import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  List,
  BarChart3,
  Settings,
  Wallet,
} from 'lucide-react';
import type { ReactNode } from 'react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/add', icon: PlusCircle, label: 'Add' },
  { to: '/transactions', icon: List, label: 'Transactions' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar — desktop */}
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-slate-700/40 bg-surface-raised lg:flex">
        <div className="flex items-center gap-3 border-b border-slate-700/40 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-primary shadow-glow">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Finance</h1>
            <p className="text-xs text-slate-500">Tracker</p>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-4">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-accent-primary/15 text-indigo-300'
                    : 'text-slate-400 hover:bg-surface-overlay hover:text-white'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-700/40 p-4">
          <p className="text-xs text-slate-600">Local storage only · No API</p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <header className="flex items-center justify-between border-b border-slate-700/40 bg-surface-raised px-4 py-3 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-primary">
              <Wallet className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-white">Finance Tracker</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>

        {/* Mobile bottom nav */}
        <nav className="flex border-t border-slate-700/40 bg-surface-raised lg:hidden">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition ${
                  isActive ? 'text-indigo-400' : 'text-slate-500'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
