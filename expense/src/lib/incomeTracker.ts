export interface Income {
  id: string;
  source: string;
  amount: number;
  category: 'salary' | 'freelance' | 'investment' | 'business' | 'other';
  date: string;
  frequency: 'one-time' | 'monthly' | 'weekly' | 'yearly';
  isRecurring: boolean;
  notes?: string;
}

export interface IncomeStats {
  totalIncome: number;
  monthlyAverage: number;
  byCategory: Array<{ category: string; total: number; count: number }>;
  bySource: Array<{ source: string; total: number; count: number }>;
  monthlyTrend: Array<{ month: string; income: number; expenses: number; net: number }>;
}

export class IncomeTracker {
  private storageKey = 'incomeData';

  createIncome(income: Omit<Income, 'id'>): Income {
    const newIncome: Income = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...income
    };
    
    const incomes = this.getAllIncome();
    incomes.unshift(newIncome);
    localStorage.setItem(this.storageKey, JSON.stringify(incomes));
    
    return newIncome;
  }

  getAllIncome(): Income[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  updateIncome(id: string, updates: Partial<Income>): boolean {
    const incomes = this.getAllIncome();
    const index = incomes.findIndex(i => i.id === id);
    
    if (index === -1) return false;
    
    incomes[index] = { ...incomes[index], ...updates };
    localStorage.setItem(this.storageKey, JSON.stringify(incomes));
    return true;
  }

  deleteIncome(id: string): boolean {
    const incomes = this.getAllIncome();
    const filtered = incomes.filter(i => i.id !== id);
    
    if (filtered.length === incomes.length) return false;
    
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
    return true;
  }

  getIncomeByDateRange(startDate: string, endDate: string): Income[] {
    const incomes = this.getAllIncome();
    return incomes.filter(income => 
      income.date >= startDate && income.date <= endDate
    );
  }

  getIncomeByCategory(category: string): Income[] {
    const incomes = this.getAllIncome();
    return incomes.filter(income => income.category === category);
  }

  getIncomeBySource(source: string): Income[] {
    const incomes = this.getAllIncome();
    return incomes.filter(income => income.source === source);
  }

  getRecurringIncome(): Income[] {
    const incomes = this.getAllIncome();
    return incomes.filter(income => income.isRecurring);
  }

  calculateMonthlyAverage(): number {
    const incomes = this.getAllIncome();
    const total = incomes.reduce((sum, income) => sum + income.amount, 0);
    
    // Calculate based on income frequency
    const monthlyEquivalent = incomes.reduce((sum, income) => {
      switch (income.frequency) {
        case 'monthly':
          return sum + income.amount;
        case 'weekly':
          return sum + (income.amount * 4.33); // Average weeks per month
        case 'yearly':
          return sum + (income.amount / 12);
        case 'one-time':
          return sum + (income.amount / 12); // Assume spread over 12 months
        default:
          return sum + income.amount;
      }
    }, 0);
    
    return monthlyEquivalent;
  }

  calculateIncomeStats(expenses: Array<{ amount: number; date: string; category: string }>): IncomeStats {
    const incomes = this.getAllIncome();
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const monthlyAverage = this.calculateMonthlyAverage();

    // Calculate by category
    const byCategory: { [key: string]: { total: number; count: number } } = {};
    incomes.forEach(income => {
      if (!byCategory[income.category]) {
        byCategory[income.category] = { total: 0, count: 0 };
      }
      byCategory[income.category].total += income.amount;
      byCategory[income.category].count += 1;
    });

    // Calculate by source
    const bySource: { [key: string]: { total: number; count: number } } = {};
    incomes.forEach(income => {
      if (!bySource[income.source]) {
        bySource[income.source] = { total: 0, count: 0 };
      }
      bySource[income.source].total += income.amount;
      bySource[income.source].count += 1;
    });

    // Calculate monthly trend for last 6 months
    const monthlyTrend: Array<{ month: string; income: number; expenses: number; net: number }> = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = month.toISOString().split('T')[0];
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0).toISOString().split('T')[0];
      
      const monthIncomes = incomes.filter(income => 
        income.date >= monthStart && income.date <= monthEnd
      );
      
      const monthExpenses = expenses.filter(expense => 
        expense.date >= monthStart && expense.date <= monthEnd
      );
      
      const incomeTotal = monthIncomes.reduce((sum, income) => sum + income.amount, 0);
      const expenseTotal = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      monthlyTrend.push({
        month: month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        income: incomeTotal,
        expenses: expenseTotal,
        net: incomeTotal - expenseTotal
      });
    }

    return {
      totalIncome,
      monthlyAverage,
      byCategory: Object.entries(byCategory).map(([category, data]) => ({
        category,
        total: data.total,
        count: data.count
      })),
      bySource: Object.entries(bySource).map(([source, data]) => ({
        source,
        total: data.total,
        count: data.count
      })),
      monthlyTrend
    };
  }

  getProjectedMonthlyIncome(): number {
    const recurring = this.getRecurringIncome();
    return recurring.reduce((sum, income) => {
      switch (income.frequency) {
        case 'monthly':
          return sum + income.amount;
        case 'weekly':
          return sum + (income.amount * 4.33);
        case 'yearly':
          return sum + (income.amount / 12);
        default:
          return sum;
      }
    }, 0);
  }

  exportToCSV(): string {
    const incomes = this.getAllIncome();
    const headers = ['Date', 'Source', 'Category', 'Amount', 'Frequency', 'Recurring', 'Notes'];
    
    const rows = incomes.map(income => [
      income.date,
      income.source,
      income.category,
      income.amount.toFixed(2),
      income.frequency,
      income.isRecurring ? 'Yes' : 'No',
      income.notes || ''
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}

export const incomeTracker = new IncomeTracker();