import { Expense } from '@/lib/types';

export interface BudgetGoal {
  id: string;
  category: string;
  amount: number;
  period: 'monthly' | 'weekly' | 'yearly';
  startDate: string;
  endDate?: string;
  isActive: boolean;
  alertThreshold: number; // percentage (e.g., 80 for 80%)
}

export interface BudgetAlert {
  id: string;
  goalId: string;
  category: string;
  currentSpent: number;
  budgetAmount: number;
  percentageUsed: number;
  alertType: 'warning' | 'limit' | 'exceeded';
  message: string;
  timestamp: string;
  isRead: boolean;
}

export class BudgetManager {
  private storageKey = 'budgetGoals';
  private alertsKey = 'budgetAlerts';

  getBudgetGoals(): BudgetGoal[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  saveBudgetGoal(goal: BudgetGoal): void {
    const goals = this.getBudgetGoals();
    const existingIndex = goals.findIndex(g => g.id === goal.id);
    
    if (existingIndex >= 0) {
      goals[existingIndex] = goal;
    } else {
      goals.push(goal);
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(goals));
  }

  deleteBudgetGoal(goalId: string): void {
    const goals = this.getBudgetGoals();
    const filtered = goals.filter(g => g.id !== goalId);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }

  calculateSpendingByCategory(expenses: Expense[], category: string, period: 'monthly' | 'weekly' | 'yearly'): number {
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'yearly':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    return expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expense.category === category && expenseDate >= startDate;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  }

  checkBudgetAlerts(expenses: Expense[]): BudgetAlert[] {
    const goals = this.getBudgetGoals().filter(g => g.isActive);
    const alerts: BudgetAlert[] = [];
    const now = new Date().toISOString();

    goals.forEach(goal => {
      const spent = this.calculateSpendingByCategory(expenses, goal.category, goal.period);
      const percentage = goal.amount > 0 ? (spent / goal.amount) * 100 : 0;

      let alertType: 'warning' | 'limit' | 'exceeded';
      let message: string;

      if (percentage >= 100) {
        alertType = 'exceeded';
        message = `Budget exceeded for ${goal.category}! Spent ${formatCurrency(spent)} of ${formatCurrency(goal.amount)}`;
      } else if (percentage >= goal.alertThreshold) {
        alertType = 'warning';
        message = `Budget warning for ${goal.category}: ${percentage.toFixed(1)}% used`;
      } else if (percentage >= 95) {
        alertType = 'limit';
        message = `Approaching budget limit for ${goal.category}: ${formatCurrency(goal.amount - spent)} remaining`;
      } else {
        return; // No alert needed
      }

      alerts.push({
        id: `alert_${goal.id}_${Date.now()}`,
        goalId: goal.id,
        category: goal.category,
        currentSpent: spent,
        budgetAmount: goal.amount,
        percentageUsed: percentage,
        alertType,
        message,
        timestamp: now,
        isRead: false
      });
    });

    return alerts;
  }

  getBudgetAlerts(): BudgetAlert[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(this.alertsKey);
    return stored ? JSON.parse(stored) : [];
  }

  saveBudgetAlert(alert: BudgetAlert): void {
    const alerts = this.getBudgetAlerts();
    alerts.unshift(alert);
    
    // Keep only last 50 alerts
    const recentAlerts = alerts.slice(0, 50);
    localStorage.setItem(this.alertsKey, JSON.stringify(recentAlerts));
  }

  markAlertAsRead(alertId: string): void {
    const alerts = this.getBudgetAlerts();
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      alert.isRead = true;
      localStorage.setItem(this.alertsKey, JSON.stringify(alerts));
    }
  }

  markAllAlertsAsRead(): void {
    const alerts = this.getBudgetAlerts();
    alerts.forEach(alert => alert.isRead = true);
    localStorage.setItem(this.alertsKey, JSON.stringify(alerts));
  }

  clearAllAlerts(): void {
    localStorage.removeItem(this.alertsKey);
  }

  getUnreadAlertCount(): number {
    const alerts = this.getBudgetAlerts();
    return alerts.filter(a => !a.isRead).length;
  }

  getBudgetProgress(expenses: Expense[]): Array<{
    category: string;
    budget: number;
    spent: number;
    percentage: number;
    remaining: number;
  }> {
    const goals = this.getBudgetGoals().filter(g => g.isActive);
    
    return goals.map(goal => {
      const spent = this.calculateSpendingByCategory(expenses, goal.category, goal.period);
      const percentage = goal.amount > 0 ? (spent / goal.amount) * 100 : 0;
      const remaining = Math.max(0, goal.amount - spent);

      return {
        category: goal.category,
        budget: goal.amount,
        spent,
        percentage,
        remaining
      };
    });
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

export const budgetManager = new BudgetManager();