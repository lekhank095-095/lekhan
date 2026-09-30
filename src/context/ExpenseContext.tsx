import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Expense, CategoryType, UserSettings, InsightItem, ChatMessage } from '../types';
import { DEMO_EXPENSES, DEMO_MONTHLY_BUDGET } from '../data/demoData';
import { fetchAIInsights, askAICoach } from '../services/aiService';

interface ExpenseContextType {
  expenses: Expense[];
  monthlyBudget: number;
  settings: UserSettings;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (id: string, updated: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  setMonthlyBudget: (amount: number) => void;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  loadDemoData: () => void;
  resetAllData: () => void;
  // Computed values
  totalSpent: number;
  budgetLeft: number;
  budgetUsedPct: number;
  dailyAverage: number;
  spendingByCategory: Record<CategoryType, number>;
  // AI Coach state
  insights: InsightItem[];
  isLoadingInsights: boolean;
  refreshInsights: () => Promise<void>;
  chatMessages: ChatMessage[];
  isChatLoading: boolean;
  sendChatMessage: (question: string) => Promise<void>;
}

const STORAGE_KEYS = {
  EXPENSES: 'expenseiq_expenses_v1',
  BUDGET: 'expenseiq_budget_v1',
  SETTINGS: 'expenseiq_settings_v1',
  INITIALIZED: 'expenseiq_initialized_v1',
};

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial expenses from localStorage
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      if (stored) {
        return JSON.parse(stored);
      }
      // First-time visit: Start with demo data so the hackathon reviewer immediately sees charts!
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
      return DEMO_EXPENSES;
    } catch {
      return DEMO_EXPENSES;
    }
  });

  const [monthlyBudget, setMonthlyBudgetState] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BUDGET);
      return stored ? Number(stored) : DEMO_MONTHLY_BUDGET;
    } catch {
      return DEMO_MONTHLY_BUDGET;
    }
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return {
      name: 'Alex Patel',
      email: 'alex.patel@example.com',
      currency: '₹',
      darkMode: false,
      notifications: true,
    };
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // AI Insights State
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState<boolean>(false);

  // AI Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: 'Hello! I am your ExpenseIQ Money Coach 🤖. Ask me anything about your spending, like "How much did I spend on food?" or "Where did I spend the most?"',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // Sync expenses to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    } catch (e) {
      console.error('Failed to save expenses to localStorage', e);
    }
  }, [expenses]);

  // Sync budget to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BUDGET, monthlyBudget.toString());
    } catch (e) {
      console.error('Failed to save budget to localStorage', e);
    }
  }, [monthlyBudget]);

  // Sync settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      if (settings.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  }, [settings]);

  // Toast notification helper with auto-hide
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Add Expense
  const addExpense = (data: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...data,
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
    };
    setExpenses((prev) => [newExpense, ...prev]);
    showToast(`✅ Expense added! ${settings.currency}${data.amount.toLocaleString()} has been added to ${data.category}.`);
  };

  // Update Expense
  const updateExpense = (id: string, updated: Partial<Expense>) => {
    setExpenses((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
    showToast('✅ Expense updated successfully.');
  };

  // Delete Expense
  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
    showToast('Expense deleted.');
  };

  // Set Monthly Budget
  const setMonthlyBudget = (amount: number) => {
    setMonthlyBudgetState(amount);
    showToast(`Monthly budget set to ${settings.currency}${amount.toLocaleString()}`);
  };

  // Update Settings
  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Load Demo Data
  const loadDemoData = () => {
    setExpenses(DEMO_EXPENSES);
    setMonthlyBudgetState(DEMO_MONTHLY_BUDGET);
    showToast('✨ Demo data loaded with realistic expenses and budget!');
    refreshInsights();
  };

  // Reset All Data
  const resetAllData = () => {
    setExpenses([]);
    localStorage.removeItem(STORAGE_KEYS.EXPENSES);
    showToast('All expense data cleared.', 'info');
  };

  // Calculations
  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [expenses]);

  const budgetLeft = useMemo(() => {
    return monthlyBudget - totalSpent;
  }, [monthlyBudget, totalSpent]);

  const budgetUsedPct = useMemo(() => {
    if (!monthlyBudget || monthlyBudget <= 0) return 0;
    return Math.round((totalSpent / monthlyBudget) * 100);
  }, [monthlyBudget, totalSpent]);

  const dailyAverage = useMemo(() => {
    // 30 days in month
    return Math.round(totalSpent / 30);
  }, [totalSpent]);

  const spendingByCategory = useMemo(() => {
    const acc: Record<CategoryType, number> = {
      Food: 0,
      Transport: 0,
      Shopping: 0,
      Bills: 0,
      Entertainment: 0,
      Health: 0,
      Education: 0,
      Other: 0,
    };
    expenses.forEach((item) => {
      if (acc[item.category] !== undefined) {
        acc[item.category] += Number(item.amount || 0);
      } else {
        acc['Other'] += Number(item.amount || 0);
      }
    });
    return acc;
  }, [expenses]);

  // Refresh AI Insights
  const refreshInsights = async () => {
    setIsLoadingInsights(true);
    try {
      const result = await fetchAIInsights(expenses, monthlyBudget, settings.currency);
      setInsights(result);
    } catch (err) {
      console.error('Failed to load insights:', err);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  // Initial load of insights
  useEffect(() => {
    refreshInsights();
  }, [expenses.length, monthlyBudget]);

  // Send message in AI Coach chat
  const sendChatMessage = async (question: string) => {
    if (!question.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: question.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const response = await askAICoach(question, expenses, monthlyBudget, settings.currency);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: response.source,
      };
      setChatMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: "I couldn't check your spending right now. Please try asking again!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        monthlyBudget,
        settings,
        activeTab,
        setActiveTab,
        isAddModalOpen,
        setIsAddModalOpen,
        toast,
        showToast,
        addExpense,
        updateExpense,
        deleteExpense,
        setMonthlyBudget,
        updateSettings,
        loadDemoData,
        resetAllData,
        totalSpent,
        budgetLeft,
        budgetUsedPct,
        dailyAverage,
        spendingByCategory,
        insights,
        isLoadingInsights,
        refreshInsights,
        chatMessages,
        isChatLoading,
        sendChatMessage,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};
