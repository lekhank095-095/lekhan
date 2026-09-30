import { CategoryType } from '../types';

export interface CategoryMeta {
  type: CategoryType;
  label: string;
  emoji: string;
  iconName: string;
  description: string;
  bgLight: string;
  textColor: string;
  borderColor: string;
  colorHex: string;
}

export const CATEGORIES: Record<CategoryType, CategoryMeta> = {
  Food: {
    type: 'Food',
    label: 'Food & Dining',
    emoji: '🍔',
    iconName: 'Utensils',
    description: 'Swiggy, Zomato, groceries, cafes, dining',
    bgLight: 'bg-amber-50 dark:bg-amber-950/40',
    textColor: 'text-amber-700 dark:text-amber-400',
    borderColor: 'border-amber-200 dark:border-amber-900',
    colorHex: '#f59e0b',
  },
  Transport: {
    type: 'Transport',
    label: 'Transport & Travel',
    emoji: '🚕',
    iconName: 'Car',
    description: 'Uber, Ola, metro, fuel, bus, flights',
    bgLight: 'bg-sky-50 dark:bg-sky-950/40',
    textColor: 'text-sky-700 dark:text-sky-400',
    borderColor: 'border-sky-200 dark:border-sky-900',
    colorHex: '#0284c7',
  },
  Shopping: {
    type: 'Shopping',
    label: 'Shopping',
    emoji: '🛍️',
    iconName: 'ShoppingBag',
    description: 'Amazon, clothing, electronics, gadgets',
    bgLight: 'bg-pink-50 dark:bg-pink-950/40',
    textColor: 'text-pink-700 dark:text-pink-400',
    borderColor: 'border-pink-200 dark:border-pink-900',
    colorHex: '#ec4899',
  },
  Bills: {
    type: 'Bills',
    label: 'Bills & Utilities',
    emoji: '💡',
    iconName: 'Zap',
    description: 'Electricity, rent, Wi-Fi, recharge',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/40',
    textColor: 'text-emerald-700 dark:text-emerald-400',
    borderColor: 'border-emerald-200 dark:border-emerald-900',
    colorHex: '#10b981',
  },
  Entertainment: {
    type: 'Entertainment',
    label: 'Entertainment',
    emoji: '🎬',
    iconName: 'Film',
    description: 'Netflix, movies, gaming, Spotify, events',
    bgLight: 'bg-purple-50 dark:bg-purple-950/40',
    textColor: 'text-purple-700 dark:text-purple-400',
    borderColor: 'border-purple-200 dark:border-purple-900',
    colorHex: '#8b5cf6',
  },
  Health: {
    type: 'Health',
    label: 'Health & Pharmacy',
    emoji: '💊',
    iconName: 'HeartPulse',
    description: 'Pharmacy, doctors, clinics, medicines',
    bgLight: 'bg-rose-50 dark:bg-rose-950/40',
    textColor: 'text-rose-700 dark:text-rose-400',
    borderColor: 'border-rose-200 dark:border-rose-900',
    colorHex: '#f43f5e',
  },
  Education: {
    type: 'Education',
    label: 'Education & Books',
    emoji: '📚',
    iconName: 'BookOpen',
    description: 'Books, courses, college, tuition fees',
    bgLight: 'bg-indigo-50 dark:bg-indigo-950/40',
    textColor: 'text-indigo-700 dark:text-indigo-400',
    borderColor: 'border-indigo-200 dark:border-indigo-900',
    colorHex: '#6366f1',
  },
  Other: {
    type: 'Other',
    label: 'Other & General',
    emoji: '📦',
    iconName: 'Package',
    description: 'Miscellaneous expenses',
    bgLight: 'bg-slate-100 dark:bg-slate-800',
    textColor: 'text-slate-700 dark:text-slate-300',
    borderColor: 'border-slate-200 dark:border-slate-700',
    colorHex: '#64748b',
  },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);
