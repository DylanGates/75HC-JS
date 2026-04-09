'use client';

import { useState } from 'react';
import SummaryCards from '@/components/SummaryCards';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import CategoryChart from '@/components/CategoryChart';
import TrendChart from '@/components/TrendChart';
import PDFExportButton from '@/components/PDFExportButton';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import BudgetGoals from '@/components/BudgetGoals';
import IncomeTracker from '@/components/IncomeTracker';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Expense, generateId, calculateTotal, calculateMonthlyAverage } from '@/lib/types';
import { offlineDataManager } from '@/lib/offlineData';
import { ExpenseValidator, ErrorHandler } from '@/lib/validation';

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'budget' | 'income'>('overview');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Initialize offline data manager
  useState(() => {
    offlineDataManager.initialize().catch(console.error);
  }, []);

  const showNotification = (message: string, type: 'error' | 'success') => {
    if (type === 'error') {
      setError(message);
      setTimeout(() => setError(''), 5000);
    } else {
      setSuccess(message);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const addExpense = (expenseData: {
    description: string;
    amount: number;
    category: string;
    date: string;
  }) => {
    try {
      // Validate expense data
      const validation = ExpenseValidator.validateExpense(expenseData);
      if (!validation.isValid) {
        showNotification(ErrorHandler.handleValidationError(validation.errors), 'error');
        return;
      }

      const newExpense: Expense = {
        id: generateId(),
        ...expenseData,
      };

      setExpenses([newExpense, ...expenses]);
      
      // Add to offline data manager for sync
      offlineDataManager.addExpense(newExpense).catch(console.error);
      
      showNotification('Expense added successfully!', 'success');
    } catch (error) {
      showNotification(ErrorHandler.handleStorageError(error), 'error');
    }
  };

  const deleteExpense = (id: string) => {
    try {
      setExpenses(expenses.filter(expense => expense.id !== id));
      showNotification('Expense deleted successfully!', 'success');
    } catch (error) {
      showNotification(ErrorHandler.handleStorageError(error), 'error');
    }
  };

  const totalExpenses = calculateTotal(expenses);
  const monthlyAverage = calculateMonthlyAverage(expenses);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <AnalyticsDashboard expenses={expenses} />;
      case 'budget':
        return <BudgetGoals expenses={expenses} />;
      case 'income':
        return <IncomeTracker expenses={expenses} />;
      default:
        return (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <ExpenseForm onAddExpense={addExpense} />
              <CategoryChart expenses={expenses} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <TrendChart expenses={expenses} />
              <ExpenseList
                expenses={expenses}
                onDeleteExpense={deleteExpense}
                searchTerm={searchTerm}
                categoryFilter={categoryFilter}
                onSearchChange={setSearchTerm}
                onCategoryFilterChange={setCategoryFilter}
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Notifications */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
            {success}
          </div>
        )}

        {/* Header with Summary and PDF Export */}
        <div className="flex justify-between items-center mb-8">
          <SummaryCards totalExpenses={totalExpenses} monthlyAverage={monthlyAverage} />
          <PDFExportButton
            expenses={expenses}
            totalExpenses={totalExpenses}
            monthlyAverage={monthlyAverage}
          />
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'budget', label: 'Budget Goals' },
              { id: 'income', label: 'Income' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
}