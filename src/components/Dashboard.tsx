import React from 'react';
import {
  PlusCircle,
  TrendingDown,
  TrendingUp,
  Sparkles,
  ArrowRight,
  CreditCard,
  Target,
  Bot,
  PieChart as PieIcon,
  HelpCircle,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useExpenses } from '../context/ExpenseContext';
import { CATEGORIES } from '../data/categories';
import { CategoryType } from '../types';

export const Dashboard: React.FC = () => {
  const {
    expenses,
    monthlyBudget,
    totalSpent,
    budgetLeft,
    budgetUsedPct,
    dailyAverage,
    spendingByCategory,
    insights,
    settings,
    setIsAddModalOpen,
    setActiveTab,
    loadDemoData,
  } = useExpenses();

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning 👋';
    if (hour < 17) return 'Good afternoon 👋';
    return 'Good evening 👋';
  };

  // Prepare chart data
  const chartData = Object.entries(spendingByCategory)
    .filter(([_, val]) => val > 0)
    .map(([cat, val]) => ({
      name: cat,
      value: val,
      color: CATEGORIES[cat as CategoryType]?.colorHex || '#64748b',
      emoji: CATEGORIES[cat as CategoryType]?.emoji || '🏷️',
    }))
    .sort((a, b) => b.value - a.value);

  // If no expenses, show empty state
  if (expenses.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6 animate-in fade-in duration-200">
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-4xl mx-auto shadow-sm">
          😊
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Your spending story starts here 😊
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Add your first expense and we'll automatically organize it and coach
            you with simple insights.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add My First Expense</span>
          </button>

          <button
            onClick={loadDemoData}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Load Demo Data</span>
          </button>
        </div>
      </div>
    );
  }

  // Top 2 AI Coach alerts
  const topInsights = insights.slice(0, 2);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {getGreeting()}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here's how your money is doing this month.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-2.5 px-5 rounded-2xl shadow-sm hover:shadow transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add Expense</span>
          </button>
        </div>
      </div>

      {/* 4 Answers To The Core Questions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-5">
        {/* 1. How much did I spend? */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            <span>💰 Money Spent</span>
            <span className="text-[11px] font-normal text-slate-400">1. Total</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {settings.currency}{totalSpent.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5">
            <span className="font-semibold text-slate-700 dark:text-slate-300">This Month</span>
            <span>·</span>
            <span>{expenses.length} expenses</span>
          </div>
        </div>

        {/* 2. How much money is left? */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            <span>🎯 Budget Left</span>
            <span className="text-[11px] font-normal text-slate-400">2. Balance</span>
          </div>
          <div
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              budgetLeft < 0
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {settings.currency}{Math.max(0, budgetLeft).toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5">
            <span>Budget: {settings.currency}{monthlyBudget.toLocaleString()}</span>
          </div>
        </div>

        {/* 3. Daily Average */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            <span>📅 Daily Average</span>
            <span className="text-[11px] font-normal text-slate-400">Pace</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {settings.currency}{dailyAverage.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
            <span>Estimated per day</span>
          </div>
        </div>

        {/* 4. Budget Used */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            <span>⚠️ Budget Used</span>
            <span className="text-[11px] font-normal text-slate-400">Status</span>
          </div>
          <div
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              budgetUsedPct > 90
                ? 'text-rose-600 dark:text-rose-400'
                : budgetUsedPct > 70
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            {budgetUsedPct}%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {budgetUsedPct <= 70
              ? '🟢 You are doing well'
              : budgetUsedPct <= 90
              ? '🟡 Getting close to budget'
              : '🔴 Crossed budget limit'}
          </div>
        </div>
      </div>

      {/* Question 4: Should I be careful about anything? (Money Coach Alerts) */}
      {topInsights.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Should I be careful about anything? · Your Money Coach</span>
            </h2>
            <button
              onClick={() => setActiveTab('insights')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              See all observations
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {topInsights.map((insight) => {
              const isWarning = insight.type === 'watch_this';
              const isGood = insight.type === 'doing_well';
              return (
                <div
                  key={insight.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isWarning
                      ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60'
                      : isGood
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60'
                      : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">
                      {isWarning ? '⚠️' : isGood ? '👍' : '💡'}
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[11px] font-bold uppercase tracking-wider ${
                            isWarning
                              ? 'text-amber-800 dark:text-amber-400'
                              : isGood
                              ? 'text-emerald-800 dark:text-emerald-400'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {insight.badge}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {insight.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {insight.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Question 3: Where did my money go? (Category Breakdown) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Chart & List */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Where did my money go?
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Simple breakdown by category this month
              </p>
            </div>
            <button
              onClick={() => setActiveTab('spending')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              Detailed view
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Donut Chart */}
            <div className="h-56 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    formatter={(value: any) => [`${settings.currency}${Number(value).toLocaleString()}`, 'Spent']}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '12px',
                    }}
                  />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[11px] text-slate-400">Total Spent</span>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {settings.currency}{totalSpent.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Category Progress Bars */}
            <div className="space-y-3">
              {chartData.slice(0, 5).map((item) => {
                const pct = Math.round((item.value / (totalSpent || 1)) * 100);
                return (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                        <span>{item.emoji}</span>
                        <span>{item.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {settings.currency}{item.value.toLocaleString()}
                        </span>
                        <span className="text-slate-400 ml-1.5 text-[11px]">
                          ({pct}%)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700/60 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions & AI Chat Teaser */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-emerald-600 text-white shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">
                Ask ExpenseIQ 🤖
              </span>
              <Bot className="w-5 h-5 text-emerald-200" />
            </div>
            <h3 className="text-base font-bold leading-snug">
              Have a question about where your money went?
            </h3>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Ask in plain words like "Where did I spend the most?" or "How much
              did I spend on food?"
            </p>
            <button
              onClick={() => setActiveTab('chat')}
              className="w-full py-2.5 px-4 rounded-xl bg-white text-emerald-800 font-bold text-xs hover:bg-emerald-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Ask a Question</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Quick Spending Facts
            </h3>
            <div className="text-xs space-y-2 text-slate-700 dark:text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span>Top Category</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {chartData[0]?.name || 'None'} ({settings.currency}{chartData[0]?.value.toLocaleString() || '0'})
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span>Transactions</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {expenses.length} logged
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span>Days remaining</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  ~12 days left
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Expenses List */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Expenses
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your latest logged transactions
            </p>
          </div>
          <button
            onClick={() => setActiveTab('expenses')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            View all ({expenses.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/70">
          {expenses.slice(0, 5).map((expense) => {
            const meta = CATEGORIES[expense.category] || CATEGORIES.Other;
            return (
              <div
                key={expense.id}
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 rounded-xl px-2 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg shrink-0">
                    {meta.emoji}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {expense.description}
                    </h4>
                    {/* Clean unboxed metadata with separators (anti-slop discipline) */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      <span>{expense.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{expense.date}</span>
                      <span aria-hidden="true">·</span>
                      <span>{expense.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                    {settings.currency}{expense.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
