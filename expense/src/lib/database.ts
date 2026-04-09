import Database from 'better-sqlite3';
import { Expense } from '@/lib/types';
import { join } from 'path';

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    const dbPath = join(process.cwd(), 'expenses.db');
    db = new Database(dbPath);
    
    // Create expenses table if it doesn't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY,
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    db.exec(`CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_expenses_created ON expenses(created_at)`);
  }
  
  return db;
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}

// Expense CRUD operations
export function createExpense(expense: Omit<Expense, 'id'>): Expense {
  const db = getDatabase();
  const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
  
  const stmt = db.prepare(`
    INSERT INTO expenses (id, description, amount, category, date)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  stmt.run(id, expense.description, expense.amount, expense.category, expense.date);
  
  return { id, ...expense };
}

export function getAllExpenses(): Expense[] {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM expenses ORDER BY date DESC, created_at DESC');
  return stmt.all() as Expense[];
}

export function getExpensesByDateRange(startDate: string, endDate: string): Expense[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM expenses 
    WHERE date >= ? AND date <= ? 
    ORDER BY date DESC, created_at DESC
  `);
  return stmt.all(startDate, endDate) as Expense[];
}

export function getExpensesByCategory(category: string): Expense[] {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM expenses WHERE category = ? ORDER BY date DESC');
  return stmt.all(category) as Expense[];
}

export function updateExpense(id: string, expense: Partial<Expense>): boolean {
  const db = getDatabase();
  
  const fields = [];
  const values = [];
  
  if (expense.description !== undefined) {
    fields.push('description = ?');
    values.push(expense.description);
  }
  if (expense.amount !== undefined) {
    fields.push('amount = ?');
    values.push(expense.amount);
  }
  if (expense.category !== undefined) {
    fields.push('category = ?');
    values.push(expense.category);
  }
  if (expense.date !== undefined) {
    fields.push('date = ?');
    values.push(expense.date);
  }
  
  if (fields.length === 0) return false;
  
  fields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);
  
  const stmt = db.prepare(`UPDATE expenses SET ${fields.join(', ')} WHERE id = ?`);
  const result = stmt.run(...values);
  
  return result.changes > 0;
}

export function deleteExpense(id: string): boolean {
  const db = getDatabase();
  const stmt = db.prepare('DELETE FROM expenses WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

interface ExpenseStats {
  total: number;
  count: number;
  byCategory: Array<{ category: string; total: number; count: number }>;
  byMonth: Array<{ month: string; total: number; count: number }>;
}

export function getExpenseStats(): ExpenseStats {
  const db = getDatabase();
  
  const totalStmt = db.prepare('SELECT SUM(amount) as total FROM expenses');
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM expenses');
  const categoryStmt = db.prepare(`
    SELECT category, SUM(amount) as total, COUNT(*) as count
    FROM expenses
    GROUP BY category
    ORDER BY total DESC
  `);
  
  const monthlyStmt = db.prepare(`
    SELECT 
      strftime('%Y-%m', date) as month,
      SUM(amount) as total,
      COUNT(*) as count
    FROM expenses
    GROUP BY month
    ORDER BY month DESC
    LIMIT 12
  `);
  
  const totalResult = totalStmt.get() as { total: number } | undefined;
  const countResult = countStmt.get() as { count: number } | undefined;
  const byCategory = categoryStmt.all() as Array<{ category: string; total: number; count: number }>;
  const byMonth = monthlyStmt.all() as Array<{ month: string; total: number; count: number }>;
  
  return {
    total: totalResult?.total || 0,
    count: countResult?.count || 0,
    byCategory,
    byMonth,
  };
}

// Database backup and restore
export function backupDatabase(): Buffer {
  const db = getDatabase();
  const backup = db.backup('main');
  return Buffer.from(backup);
}

interface DatabaseStats {
  expenseCount: number;
  databaseSize: number;
}

export function getDatabaseStats(): DatabaseStats {
  const db = getDatabase();
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM expenses');
  const sizeStmt = db.prepare('SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()');
  
  const countResult = countStmt.get() as { count: number } | undefined;
  const sizeResult = sizeStmt.get() as { size: number } | undefined;
  
  return {
    expenseCount: countResult?.count || 0,
    databaseSize: sizeResult?.size || 0,
  };
}