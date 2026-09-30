import React from 'react';
import {
  Home,
  PlusCircle,
  CreditCard,
  PieChart,
  Bot,
  Target,
  Settings,
  Sparkles,
  Moon,
  Sun,
  MessageSquare,
} from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';

export const Navigation: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsAddModalOpen,
    loadDemoData,
    settings,
    updateSettings,
  } = useExpenses();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: PieChart },
    { id: 'expenses', label: 'My Expenses', icon: CreditCard },
    { id: 'spending', label: 'My Spending', icon: PieChart },
    { id: 'insights', label: 'AI Insights', icon: Bot },
    { id: 'chat', label: 'Ask AI', icon: MessageSquare },
    { id: 'budget', label: 'My Budget', icon: Target },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-screen sticky top-0 px-4 py-6 justify-between select-none z-30">
        <div>
          {/* Brand */}
          <div className="flex items-center justify-between px-3 mb-6">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-emerald-700 transition-colors">
                ₹
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  ExpenseIQ
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                    AI
                  </span>
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                  Smart Money Tracker
                </p>
              </div>
            </button>
          </div>

          {/* Quick Add Expense Action */}
          <div className="px-1 mb-5">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-semibold text-sm py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Expense</span>
            </button>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom utility: Try Demo & Theme toggle */}
        <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              loadDemoData();
              setActiveTab('dashboard');
            }}
            className="w-full flex items-center justify-center gap-2 text-xs font-semibold py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Try Demo Data</span>
          </button>

          <div className="flex items-center justify-between px-2 pt-2 text-xs text-slate-500 dark:text-slate-400">
            <span>Theme</span>
            <button
              onClick={() => updateSettings({ darkMode: !settings.darkMode })}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title={settings.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {settings.darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2"
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
            ₹
          </div>
          <span className="font-extrabold text-base text-slate-900 dark:text-white">
            ExpenseIQ
          </span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              loadDemoData();
              setActiveTab('dashboard');
            }}
            className="flex items-center gap-1 text-[11px] font-semibold py-1 px-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900"
          >
            <Sparkles className="w-3 h-3" />
            <span>Demo</span>
          </button>
          <button
            onClick={() => updateSettings({ darkMode: !settings.darkMode })}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300"
          >
            {settings.darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar: Home | Add | Expenses | Insights */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around safe-area-bottom shadow-lg">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium transition-colors ${
            activeTab === 'dashboard' || activeTab === 'home'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-bold text-emerald-600 dark:text-emerald-400"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
            <PlusCircle className="w-5 h-5" />
          </div>
          <span className="text-[10px] text-slate-700 dark:text-slate-300 font-semibold">Add</span>
        </button>

        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium transition-colors ${
            activeTab === 'expenses'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <CreditCard className="w-5 h-5" />
          <span>Expenses</span>
        </button>

        <button
          onClick={() => setActiveTab('insights')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium transition-colors ${
            activeTab === 'insights'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Bot className="w-5 h-5" />
          <span>Insights</span>
        </button>

        <button
          onClick={() => setActiveTab('spending')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium transition-colors ${
            activeTab === 'spending' || activeTab === 'budget' || activeTab === 'chat' || activeTab === 'settings'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <PieChart className="w-5 h-5" />
          <span>More</span>
        </button>
      </nav>
    </>
  );
};
