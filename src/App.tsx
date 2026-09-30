/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ExpenseProvider, useExpenses } from './context/ExpenseContext';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { MyExpenses } from './components/MyExpenses';
import { SpendingPage } from './components/SpendingPage';
import { AIInsightsPage } from './components/AIInsightsPage';
import { AIChatTab } from './components/AIChatTab';
import { BudgetPage } from './components/BudgetPage';
import { SettingsPage } from './components/SettingsPage';
import { AddExpenseModal } from './components/AddExpenseModal';
import { Toast } from './components/Toast';

const MainContent: React.FC = () => {
  const { activeTab, isAddModalOpen, setIsAddModalOpen } = useExpenses();

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <LandingPage />;
      case 'dashboard':
        return <Dashboard />;
      case 'expenses':
        return <MyExpenses />;
      case 'spending':
        return <SpendingPage />;
      case 'insights':
        return <AIInsightsPage />;
      case 'chat':
        return <AIChatTab />;
      case 'budget':
        return <BudgetPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Navigation (Sidebar & Mobile Nav) */}
      <Navigation />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 pb-24 md:pb-12 overflow-y-auto">
        {renderActiveScreen()}
      </main>

      {/* One-Tap Add Expense Modal */}
      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Global Friendly Toast Notifications */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <ExpenseProvider>
      <MainContent />
    </ExpenseProvider>
  );
}
