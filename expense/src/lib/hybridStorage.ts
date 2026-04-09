import { Expense } from '@/lib/types';
import { 
  createExpense as createExpenseDB, 
  getAllExpenses as getAllExpensesDB,
  deleteExpense as deleteExpenseDB,
  updateExpense as updateExpenseDB,
  getExpenseStats as getExpenseStatsDB
} from '@/lib/database';

// Hybrid storage manager that uses both localStorage and SQLite
export class HybridStorageManager {
  private useDatabase: boolean = false;
  private storageKey: string = 'expenses';

  constructor() {
    // Check if SQLite is available (server-side)
    this.useDatabase = typeof window === 'undefined';
  }

  async initialize(): Promise<void> {
    if (this.useDatabase) {
      try {
        // Test database connection
        const testExpense = {
          description: 'Test expense',
          amount: 0.01,
          category: 'other',
          date: new Date().toISOString().split('T')[0]
        };
        
        const result = createExpenseDB(testExpense);
        deleteExpenseDB(result.id);
        
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Database initialization failed, falling back to localStorage:', error);
        this.useDatabase = false;
      }
    }
  }

  async getAllExpenses(): Promise<Expense[]> {
    if (this.useDatabase) {
      return getAllExpensesDB();
    } else {
      // Fallback to localStorage
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : [];
    }
  }

  async createExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
    if (this.useDatabase) {
      return createExpenseDB(expense);
    } else {
      // Fallback to localStorage
      const expenses = await this.getAllExpenses();
      const newExpense: Expense = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        ...expense
      };
      
      expenses.unshift(newExpense);
      localStorage.setItem(this.storageKey, JSON.stringify(expenses));
      return newExpense;
    }
  }

  async updateExpense(id: string, updates: Partial<Expense>): Promise<boolean> {
    if (this.useDatabase) {
      return updateExpenseDB(id, updates);
    } else {
      // Fallback to localStorage
      const expenses = await this.getAllExpenses();
      const index = expenses.findIndex(e => e.id === id);
      
      if (index === -1) return false;
      
      expenses[index] = { ...expenses[index], ...updates };
      localStorage.setItem(this.storageKey, JSON.stringify(expenses));
      return true;
    }
  }

  async deleteExpense(id: string): Promise<boolean> {
    if (this.useDatabase) {
      return deleteExpenseDB(id);
    } else {
      // Fallback to localStorage
      const expenses = await this.getAllExpenses();
      const filtered = expenses.filter(e => e.id !== id);
      
      if (filtered.length === expenses.length) return false;
      
      localStorage.setItem(this.storageKey, JSON.stringify(filtered));
      return true;
    }
  }

  async getExpenseStats() {
    if (this.useDatabase) {
      return getExpenseStatsDB();
    } else {
      // Fallback to localStorage
      const expenses = await this.getAllExpenses();
      const total = expenses.reduce((sum, e) => sum + e.amount, 0);
      const count = expenses.length;
      
      const byCategory: { [key: string]: { total: number; count: number } } = {};
      expenses.forEach(expense => {
        if (!byCategory[expense.category]) {
          byCategory[expense.category] = { total: 0, count: 0 };
        }
        byCategory[expense.category].total += expense.amount;
        byCategory[expense.category].count += 1;
      });
      
      return {
        total,
        count,
        byCategory: Object.entries(byCategory).map(([category, data]) => ({
          category,
          total: data.total,
          count: data.count
        })),
        byMonth: [] // Simplified for localStorage
      };
    }
  }

  async migrateFromLocalStorage(): Promise<void> {
    if (this.useDatabase) {
      const localData = localStorage.getItem(this.storageKey);
      if (localData) {
        const expenses: Expense[] = JSON.parse(localData);
        console.log(`Migrating ${expenses.length} expenses from localStorage to database...`);
        
        for (const expense of expenses) {
          try {
            createExpenseDB({
              description: expense.description,
              amount: expense.amount,
              category: expense.category,
              date: expense.date
            });
          } catch (error) {
            console.error('Failed to migrate expense:', expense, error);
          }
        }
        
        // Clear localStorage after successful migration
        localStorage.removeItem(this.storageKey);
        console.log('Migration completed successfully');
      }
    }
  }

  isUsingDatabase(): boolean {
    return this.useDatabase;
  }
}

// Singleton instance
export const storageManager = new HybridStorageManager();

// Initialize on module load
storageManager.initialize().catch(console.error);