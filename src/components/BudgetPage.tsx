import React, { useState } from 'react';
import { Target, Check, AlertCircle, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { CATEGORIES, CATEGORY_LIST } from '../data/categories';
import { CategoryType } from '../types';

export const BudgetPage: React.FC = () => {
  const {
    monthlyBudget,
    setMonthlyBudget,
    totalSpent,
    budgetLeft,
    budgetUsedPct,
    dailyAverage,
    spendingByCategory,
    settings,
  } = useExpenses();

  const [inputBudget, setInputBudget] = useState(monthlyBudget.toString());
  const [isEditing, setIsEditing] = useState(false);
  const [showCategoryBudgets, setShowCategoryBudgets] = useState(false);
  const [categoryLimits, setCategoryLimits] = useState<Partial<Record<CategoryType, number>>>({
    Food: 6000,
    Shopping: 4000,
    Transport: 2500,
    Bills: 3500,
  });

  const handleSaveBudget = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = parseFloat(inputBudget);
    if (!isNaN(val) && val > 0) {
      setMonthlyBudget(val);
      setIsEditing(false);
    }
  };

  // Projected month-end spend
  const projectedTotal = dailyAverage * 30;

  // Status indicator
  const getStatusBadge = () => {
    if (budgetUsedPct < 75) {
      return {
        icon: '🟢',
        text: "You're doing well.",
        color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
      };
    }
    if (budgetUsedPct <= 95) {
      return {
        icon: '🟡',
        text: "You're getting close to your budget.",
        color: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
      };
    }
    return {
      icon: '🔴',
      text: "You've crossed your budget.",
      color: 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
    };
  };

  const status = getStatusBadge();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-8 animate-in fade-in duration-200">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Set Your Monthly Budget
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Decide how much you want to spend each month and track your progress in real time.
        </p>
      </div>

      {/* Main Budget Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Monthly Target
            </span>
            {isEditing ? (
              <form onSubmit={handleSaveBudget} className="flex items-center gap-2 mt-1">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                    {settings.currency}
                  </span>
                  <input
                    type="number"
                    value={inputBudget}
                    onChange={(e) => setInputBudget(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xl font-bold bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-300 dark:border-slate-600 focus:outline-none w-44"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-2 text-xs text-slate-500"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-3 mt-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                  {settings.currency}{monthlyBudget.toLocaleString()}
                </span>
                <button
                  onClick={() => {
                    setInputBudget(monthlyBudget.toString());
                    setIsEditing(true);
                  }}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Change
                </button>
              </div>
            )}
          </div>

          {/* Status Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs sm:text-sm font-bold ${status.color}`}
          >
            <span>{status.icon}</span>
            <span>{status.text}</span>
          </div>
        </div>

        {/* 3 Overview Numbers: Your Budget, Spent, Left */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 text-center sm:text-left">
          <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[11px] sm:text-xs text-slate-500 font-medium block">
              Your Budget
            </span>
            <span className="text-base sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">
              {settings.currency}{monthlyBudget.toLocaleString()}
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[11px] sm:text-xs text-slate-500 font-medium block">
              Spent
            </span>
            <span className="text-base sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">
              {settings.currency}{totalSpent.toLocaleString()}
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[11px] sm:text-xs text-slate-500 font-medium block">
              Left
            </span>
            <span
              className={`text-base sm:text-2xl font-extrabold mt-1 block ${
                budgetLeft < 0 ? 'text-rose-600' : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {settings.currency}{Math.max(0, budgetLeft).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Large Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span>Progress</span>
            <span className="font-extrabold text-sm">{budgetUsedPct}% used</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-4 overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                budgetUsedPct > 90
                  ? 'bg-rose-500'
                  : budgetUsedPct > 70
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, budgetUsedPct)}%` }}
            />
          </div>
        </div>

        {/* Projection insight */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <p>
            <strong>Spending pace:</strong> At your current rate of{' '}
            <span className="font-bold text-slate-900 dark:text-white">
              {settings.currency}{dailyAverage}/day
            </span>
            , you'll spend roughly{' '}
            <span className="font-bold text-slate-900 dark:text-white">
              {settings.currency}{projectedTotal.toLocaleString()}
            </span>{' '}
            by the end of this 30-day period.
          </p>
        </div>
      </div>

      {/* Optional Category Budgets */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Category Budgets (Optional)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Set personal limits for specific spending areas if you'd like.
            </p>
          </div>
          <button
            onClick={() => setShowCategoryBudgets(!showCategoryBudgets)}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            {showCategoryBudgets ? 'Hide categories' : 'Show category limits'}
          </button>
        </div>

        {showCategoryBudgets && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {(['Food', 'Shopping', 'Transport', 'Bills'] as CategoryType[]).map((cat) => {
              const meta = CATEGORIES[cat];
              const spent = spendingByCategory[cat] || 0;
              const limit = categoryLimits[cat] || 4000;
              const pct = Math.round((spent / limit) * 100);

              return (
                <div
                  key={cat}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{meta.emoji}</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {cat}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {settings.currency}{spent.toLocaleString()} / {settings.currency}{limit.toLocaleString()}
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        pct > 90 ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>{pct}% used</span>
                    <span>{settings.currency}{Math.max(0, limit - spent).toLocaleString()} left</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
