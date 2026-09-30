import React, { useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  BarChart2,
  Calendar,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useExpenses } from '../context/ExpenseContext';
import { CATEGORIES } from '../data/categories';
import { LAST_MONTH_COMPARISON } from '../data/demoData';
import { CategoryType } from '../types';

export const SpendingPage: React.FC = () => {
  const { expenses, totalSpent, spendingByCategory, settings } = useExpenses();

  // Category array sorted
  const sortedCategories = useMemo(() => {
    return Object.entries(spendingByCategory)
      .filter(([_, amount]) => amount > 0)
      .map(([cat, amount]) => ({
        category: cat as CategoryType,
        amount,
        meta: CATEGORIES[cat as CategoryType] || CATEGORIES.Other,
        percentage: Math.round((amount / (totalSpent || 1)) * 100),
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [spendingByCategory, totalSpent]);

  // Payment method breakdown
  const paymentBreakdown = useMemo(() => {
    const acc: Record<string, number> = { UPI: 0, Card: 0, Cash: 0, Other: 0 };
    expenses.forEach((e) => {
      acc[e.paymentMethod] = (acc[e.paymentMethod] || 0) + e.amount;
    });
    return Object.entries(acc).map(([method, amount]) => ({
      method,
      amount,
      percentage: Math.round((amount / (totalSpent || 1)) * 100),
    }));
  }, [expenses, totalSpent]);

  // Bar chart data for top categories
  const barData = sortedCategories.map((c) => ({
    name: c.category,
    amount: c.amount,
    color: c.meta.colorHex,
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-8 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Where is my money going?
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Simple breakdown of your spending this month and how it compares to last month.
        </p>
      </div>

      {/* Main 2-column: Category Breakdown Cards + Visual Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown List */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              This Month
            </h2>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total: {settings.currency}{totalSpent.toLocaleString()}
            </span>
          </div>

          <div className="space-y-4">
            {sortedCategories.map((item) => (
              <div key={item.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.meta.emoji}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {settings.currency}{item.amount.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({item.percentage}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700/60 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.meta.colorHex,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Category Comparison
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Visual scale of what took the most money
            </p>
          </div>

          <div className="h-64 sm:h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip
                  formatter={(val: any) => [`${settings.currency}${Number(val).toLocaleString()}`, 'Money Spent']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="amount" radius={[0, 8, 8, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Compared With Last Month Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Compared with last month
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Plain language changes in your monthly habits
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Food comparison */}
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                🍔 Food
              </span>
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                18%
              </span>
            </div>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white">
              More than last month
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Spent ₹4,500 vs ₹3,800 last month (approx. ₹700 extra)
            </p>
          </div>

          {/* Transport comparison */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                🚕 Transport
              </span>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5">
                <TrendingDown className="w-3.5 h-3.5" />
                10%
              </span>
            </div>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white">
              Less than last month
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Good work! Saved ₹180 on cabs and fuel this cycle.
            </p>
          </div>

          {/* Shopping comparison */}
          <div className="p-4 rounded-2xl bg-pink-50/70 dark:bg-pink-950/30 border border-pink-200/60 dark:border-pink-900/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                🛍️ Shopping
              </span>
              <span className="text-xs font-bold text-pink-700 dark:text-pink-400 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                5%
              </span>
            </div>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white">
              More than last month
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Roughly on track, with 1 extra purchase on electronics.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Methods Breakdown */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            How do you pay?
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            UPI, Card, and Cash proportions
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {paymentBreakdown.map((item) => (
            <div
              key={item.method}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span>{item.method}</span>
                <span className="font-semibold">{item.percentage}%</span>
              </div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                {settings.currency}{item.amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
