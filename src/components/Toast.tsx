import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';

export const Toast: React.FC = () => {
  const { toast } = useExpenses();

  if (!toast) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-800 dark:border-slate-200">
        {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-600 shrink-0" />}
        {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 dark:text-rose-600 shrink-0" />}
        {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400 dark:text-sky-600 shrink-0" />}
        <p className="text-xs md:text-sm font-medium leading-snug">{toast.message}</p>
      </div>
    </div>
  );
};
