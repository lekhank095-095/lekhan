import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Check,
  ChevronDown,
  Calendar,
  Wallet,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { CategoryType, PaymentMethod } from '../types';
import { CATEGORIES, CATEGORY_LIST } from '../data/categories';
import { quickParseExpenseText, classifyExpense } from '../services/aiService';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialText?: string;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  initialText = '',
}) => {
  const { addExpense, settings } = useExpenses();

  const [description, setDescription] = useState(initialText);
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [category, setCategory] = useState<CategoryType>('Food');
  const [confidence, setConfidence] = useState<number>(94);
  const [isClassifying, setIsClassifying] = useState<boolean>(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState<boolean>(false);
  const [aiSource, setAiSource] = useState<'gemini' | 'rule-engine'>('rule-engine');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Quick preset shortcuts for instant test in hackathon
  const quickDemos = [
    { label: 'Dinner at Swiggy ₹450', text: 'Dinner at Swiggy', amount: 450 },
    { label: 'Uber to college ₹180', text: 'Uber to college', amount: 180 },
    { label: 'Amazon shopping ₹899', text: 'Amazon shopping', amount: 899 },
    { label: 'Electricity bill ₹1,200', text: 'Electricity bill', amount: 1200 },
    { label: 'Netflix subscription ₹649', text: 'Netflix subscription', amount: 649 },
  ];

  // Auto classify as description changes
  useEffect(() => {
    if (!description.trim()) {
      return;
    }

    // Check if user pasted/typed composite like "Dinner at Pizza Hut ₹650"
    const parsed = quickParseExpenseText(description);
    if (parsed.amount && !amount) {
      setAmount(parsed.amount.toString());
    }

    const timer = setTimeout(async () => {
      setIsClassifying(true);
      try {
        const result = await classifyExpense(
          parsed.cleanDescription || description,
          parsed.amount || Number(amount) || undefined
        );
        setCategory(result.category);
        setConfidence(result.confidence);
        setAiSource(result.source);
      } catch (err) {
        console.error('Classification error:', err);
      } finally {
        setIsClassifying(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [description]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMsg('Please enter how much you spent (e.g. 450).');
      return;
    }

    if (!description.trim()) {
      setErrorMsg('Please tell us what you spent it on (e.g. Dinner at Swiggy).');
      return;
    }

    setErrorMsg('');
    addExpense({
      amount: numericAmount,
      description: description.trim(),
      category,
      date,
      paymentMethod,
      aiConfidence: confidence,
    });

    // Reset and close
    setDescription('');
    setAmount('');
    onClose();
  };

  const handleQuickDemo = (item: typeof quickDemos[0]) => {
    setDescription(item.text);
    setAmount(item.amount.toString());
    setErrorMsg('');
  };

  const selectedCategoryMeta = CATEGORIES[category] || CATEGORIES.Other;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Add Expense
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Takes less than 10 seconds. AI handles the rest.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Quick Demo Chips */}
          <div>
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 block mb-2">
              Quick examples (click to test):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickDemos.map((demo, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickDemo(demo)}
                  className="text-xs py-1 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-400 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  {demo.label}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              How much did you spend?
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400 dark:text-slate-500">
                {settings.currency}
              </span>
              <input
                type="number"
                step="any"
                inputMode="decimal"
                autoFocus
                placeholder="0"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full pl-10 pr-4 py-3 text-2xl font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              What did you spend it on?
            </label>
            <input
              type="text"
              placeholder="e.g. Dinner at Swiggy, Uber to office, Zara jeans"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrorMsg('');
              }}
              className="w-full px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          {/* AI Category Prediction Box */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/60 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl" role="img" aria-label={selectedCategoryMeta.label}>
                  {selectedCategoryMeta.emoji}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Looks like {selectedCategoryMeta.type}
                    </span>
                    <span className="text-[11px] font-medium text-emerald-700/80 dark:text-emerald-400/80">
                      {isClassifying ? 'Checking...' : `${confidence}% sure`}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-600/90 dark:text-emerald-400/70 mt-0.5">
                    {selectedCategoryMeta.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCategoryPicker(!showCategoryPicker)}
                className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 underline flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-emerald-100/50 dark:hover:bg-emerald-900/40"
              >
                Change category
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showCategoryPicker ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Expandable Category Picker */}
            {showCategoryPicker && (
              <div className="mt-3 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60 grid grid-cols-2 gap-1.5 animate-in fade-in duration-100">
                {CATEGORY_LIST.map((cat) => (
                  <button
                    key={cat.type}
                    type="button"
                    onClick={() => {
                      setCategory(cat.type);
                      setConfidence(100);
                      setShowCategoryPicker(false);
                    }}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors ${
                      category === cat.type
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white/80 dark:bg-slate-800 hover:bg-emerald-100/50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    <span className="truncate">{cat.type}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Date
              </label>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setDate(new Date().toISOString().split('T')[0])}
                  className={`text-xs py-1.5 px-3 rounded-lg font-medium border ${
                    date === new Date().toISOString().split('T')[0]
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Today
                </button>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-slate-400" />
                Payment Method
              </label>
              <div className="grid grid-cols-4 gap-1">
                {(['UPI', 'Card', 'Cash', 'Other'] as PaymentMethod[]).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-1.5 px-1 text-center rounded-lg text-xs font-medium transition-colors ${
                      paymentMethod === method
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Friendly Error */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Add Expense</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
