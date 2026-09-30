export type CategoryType =
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Bills'
  | 'Entertainment'
  | 'Health'
  | 'Education'
  | 'Other';

export type PaymentMethod = 'UPI' | 'Cash' | 'Card' | 'Other';

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: CategoryType;
  date: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  notes?: string;
  aiConfidence?: number;
  createdAt: string;
}

export interface BudgetConfig {
  monthlyTotal: number;
  categoryLimits?: Partial<Record<CategoryType, number>>;
}

export interface UserSettings {
  name: string;
  email: string;
  currency: string;
  darkMode: boolean;
  notifications: boolean;
}

export type InsightType = 'good_to_know' | 'watch_this' | 'doing_well';

export interface InsightItem {
  id: string;
  type: InsightType;
  badge: 'Good to Know' | 'Watch This' | "You're Doing Well";
  title: string;
  message: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: 'gemini' | 'rule-nlp';
}
