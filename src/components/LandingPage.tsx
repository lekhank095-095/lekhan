import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Bot,
  PieChart,
  PlusCircle,
  TrendingDown,
  CheckCircle2,
} from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';

export const LandingPage: React.FC = () => {
  const { setActiveTab, loadDemoData, setIsAddModalOpen, settings, totalSpent, budgetLeft, budgetUsedPct } = useExpenses();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-16 space-y-16 animate-in fade-in duration-300">
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Automated Expense Analysis & Classification</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Track Your Money.{' '}
          <span className="text-emerald-600 dark:text-emerald-400">
            Let AI Do the Work.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed">
          Add your expenses, and ExpenseIQ automatically organizes and explains
          your spending.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => {
              loadDemoData();
              setActiveTab('dashboard');
            }}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 active:scale-[0.98] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-base transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Try Demo</span>
          </button>
        </div>

        {/* Anti-jargon badge */}
        <p className="text-xs text-slate-400 dark:text-slate-500">
          No complicated financial terms · Works in under 10 seconds · 100% private
        </p>
      </div>

      {/* Visual Dashboard Preview */}
      <div className="relative mx-auto max-w-4xl rounded-3xl p-3 md:p-6 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 shadow-2xl">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 md:p-8 space-y-6 border border-slate-200/80 dark:border-slate-800">
          {/* Mock Dashboard Topbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Good morning 👋
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Here's how your money is doing this month.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Add Expense</span>
              </button>
            </div>
          </div>

          {/* 4 Preview Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                💰 Money Spent
              </span>
              <span className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">
                {settings.currency}{totalSpent ? totalSpent.toLocaleString() : '12,850'}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-1">
                This Month
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                🎯 Budget Left
              </span>
              <span className="text-xl md:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {settings.currency}{budgetLeft !== undefined ? Math.max(0, budgetLeft).toLocaleString() : '7,150'}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-1">
                From {settings.currency}20,000
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                📅 Daily Average
              </span>
              <span className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">
                {settings.currency}428
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-1">
                30 days pace
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                ⚠️ Budget Used
              </span>
              <span className="text-xl md:text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                {budgetUsedPct || 64}%
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-1">
                Safe pace
              </span>
            </div>
          </div>

          {/* Quick AI Coach Preview Alert */}
          <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/60 flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300">
                Money Coach Insight: You spent more on food this month
              </h4>
              <p className="text-xs text-amber-800/90 dark:text-amber-400/90 mt-0.5">
                You spent {settings.currency}4,500 on food, which is {settings.currency}700 more than last month.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Simple Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-base">
            1
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Add in Plain English
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Just type "Dinner at Swiggy ₹450" or "Uber to office ₹180". No
            confusing accounting categories.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-base">
            2
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            AI Categorizes Instantly
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            ExpenseIQ automatically detects Food, Transport, Bills, Shopping and
            confirms it in 1 second.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-base">
            3
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Friendly Money Coach
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Get simple alerts: "Watch This", "Good to Know", and "You're Doing
            Well" with zero financial jargon.
          </p>
        </div>
      </div>
    </div>
  );
};
