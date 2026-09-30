import React from 'react';
import {
  Bot,
  RefreshCw,
  Sparkles,
  ArrowRight,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';

export const AIInsightsPage: React.FC = () => {
  const {
    insights,
    isLoadingInsights,
    refreshInsights,
    setActiveTab,
    sendChatMessage,
    settings,
    totalSpent,
    budgetLeft,
  } = useExpenses();

  const handleAskCoach = (topic: string) => {
    sendChatMessage(`Can you tell me more about: "${topic}"? What should I do?`);
    setActiveTab('chat');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-2">
            <Bot className="w-3.5 h-3.5" />
            <span>AI Automated Coach</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Your Money Coach 🤖
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Simple observations based on your actual spending, without financial jargon.
          </p>
        </div>

        <button
          onClick={refreshInsights}
          disabled={isLoadingInsights}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingInsights ? 'animate-spin' : ''}`} />
          <span>{isLoadingInsights ? 'Thinking...' : 'Refresh Coach'}</span>
        </button>
      </div>

      {/* 3 Categories Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Good to Know
            </h3>
            <p className="text-[11px] text-slate-500">Neutral spending facts</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="text-xs font-bold text-amber-900 dark:text-amber-300">
              Watch This
            </h3>
            <p className="text-[11px] text-amber-700/80 dark:text-amber-400">Gentle warnings to pace yourself</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-3">
          <span className="text-2xl">👍</span>
          <div>
            <h3 className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
              You're Doing Well
            </h3>
            <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400">Positive habits & savings</p>
          </div>
        </div>
      </div>

      {/* Insights Cards List */}
      <div className="space-y-4">
        {insights.map((insight) => {
          const isWatch = insight.type === 'watch_this';
          const isDoingWell = insight.type === 'doing_well';
          const emoji = isWatch ? '⚠️' : isDoingWell ? '👍' : '💡';

          return (
            <div
              key={insight.id}
              className={`p-6 rounded-3xl border transition-all ${
                isWatch
                  ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-900/60'
                  : isDoingWell
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/60'
                  : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/80'
              } shadow-sm space-y-3`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-xl shrink-0">
                    {emoji}
                  </div>
                  <div className="space-y-1">
                    <span
                      className={`text-[11px] font-extrabold uppercase tracking-wider ${
                        isWatch
                          ? 'text-amber-800 dark:text-amber-400'
                          : isDoingWell
                          ? 'text-emerald-800 dark:text-emerald-400'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {insight.badge}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      {insight.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                      {insight.message}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleAskCoach(insight.title)}
                  className="shrink-0 p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl hover:bg-white/80 dark:hover:bg-slate-800 transition-colors"
                  title="Ask AI Coach about this"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Friendly Disclaimer (as required by prompt) */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>
          💡 <strong>Friendly Note:</strong> AI suggestions are observations
          designed to help you stay aware of your spending patterns, not
          guaranteed financial advice.
        </p>
      </div>
    </div>
  );
};
