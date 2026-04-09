'use client';

import { useState, useEffect } from 'react';
import { BudgetGoal, BudgetAlert, budgetManager, formatCurrency } from '@/lib/budgetManager';
import { Expense } from '@/lib/types';

interface BudgetGoalsProps {
  expenses: Expense[];
}

export default function BudgetGoals({ expenses }: BudgetGoalsProps) {
  const [goals, setGoals] = useState<BudgetGoal[]>([]);
  const [alerts, setAlerts] = useState<BudgetAlert[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<BudgetGoal | null>(null);

  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    period: 'monthly' as 'monthly' | 'weekly' | 'yearly',
    alertThreshold: '80'
  });

  useEffect(() => {
    loadGoals();
    checkAlerts();
  }, [expenses]);

  const loadGoals = () => {
    const savedGoals = budgetManager.getBudgetGoals();
    setGoals(savedGoals);
  };

  const checkAlerts = () => {
    const newAlerts = budgetManager.checkBudgetAlerts(expenses);
    newAlerts.forEach(alert => budgetManager.saveBudgetAlert(alert));
    setAlerts(budgetManager.getBudgetAlerts());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const goal: BudgetGoal = {
      id: editingGoal?.id || Date.now().toString(),
      category: formData.category,
      amount: parseFloat(formData.amount),
      period: formData.period,
      startDate: new Date().toISOString().split('T')[0],
      isActive: true,
      alertThreshold: parseInt(formData.alertThreshold)
    };

    budgetManager.saveBudgetGoal(goal);
    loadGoals();
    checkAlerts();
    
    // Reset form
    setFormData({
      category: '',
      amount: '',
      period: 'monthly',
      alertThreshold: '80'
    });
    setShowForm(false);
    setEditingGoal(null);
  };

  const handleEdit = (goal: BudgetGoal) => {
    setFormData({
      category: goal.category,
      amount: goal.amount.toString(),
      period: goal.period,
      alertThreshold: goal.alertThreshold.toString()
    });
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleDelete = (goalId: string) => {
    if (confirm('Are you sure you want to delete this budget goal?')) {
      budgetManager.deleteBudgetGoal(goalId);
      loadGoals();
    }
  };

  const markAlertAsRead = (alertId: string) => {
    budgetManager.markAlertAsRead(alertId);
    setAlerts(budgetManager.getBudgetAlerts());
  };

  const markAllAlertsAsRead = () => {
    budgetManager.markAllAlertsAsRead();
    setAlerts(budgetManager.getBudgetAlerts());
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'limit': return '🚨';
      case 'exceeded': return '❌';
      default: return 'ℹ️';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'limit': return 'border-orange-200 bg-orange-50';
      case 'exceeded': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const budgetProgress = budgetManager.getBudgetProgress(expenses);
  const unreadCount = budgetManager.getUnreadAlertCount();

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Budget Goals & Alerts</h2>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAlertsAsRead}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
            >
              Mark all as read ({unreadCount})
            </button>
          )}
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'Add Budget Goal'}
          </button>
        </div>
      </div>

      {/* Budget Goal Form */}
      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingGoal ? 'Edit Budget Goal' : 'Add New Budget Goal'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select category</option>
                <option value="food">Food</option>
                <option value="transport">Transport</option>
                <option value="utilities">Utilities</option>
                <option value="entertainment">Entertainment</option>
                <option value="shopping">Shopping</option>
                <option value="health">Health</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget Amount</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
              <select
                value={formData.period}
                onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alert Threshold (%)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.alertThreshold}
                onChange={(e) => setFormData(prev => ({ ...prev, alertThreshold: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                {editingGoal ? 'Update Goal' : 'Create Goal'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Budget Progress */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Progress</h3>
        {budgetProgress.length === 0 ? (
          <p className="text-gray-500">No budget goals set. Create one above!</p>
        ) : (
          <div className="space-y-4">
            {budgetProgress.map((progress) => (
              <div key={progress.category} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-900 capitalize">{progress.category}</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(goals.find(g => g.category === progress.category)!)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(goals.find(g => g.category === progress.category)!.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{formatCurrency(progress.spent)} spent</span>
                  <span>{formatCurrency(progress.budget)} budget</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                  <div
                    className={`h-2 rounded-full ${getProgressColor(progress.percentage)}`}
                    style={{ width: `${Math.min(progress.percentage, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{progress.percentage.toFixed(1)}% used</span>
                  <span>{formatCurrency(progress.remaining)} remaining</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Budget Alerts */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Budget Alerts {unreadCount > 0 && <span className="text-red-600">({unreadCount} unread)</span>}
        </h3>
        {alerts.length === 0 ? (
          <p className="text-gray-500">No budget alerts. You're doing great!</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border ${getAlertColor(alert.alertType)} ${
                  !alert.isRead ? 'border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">{getAlertIcon(alert.alertType)}</span>
                    <div>
                      <p className="font-medium text-gray-900">{alert.category}</p>
                      <p className="text-sm text-gray-600">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {!alert.isRead && (
                    <button
                      onClick={() => markAlertAsRead(alert.id)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}