import { Expense } from '@/lib/types';

export class OfflineDataManager {
  private dbName: string = 'ExpenseTrackerDB';
  private dbVersion: number = 1;
  private db: IDBDatabase | null = null;

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create expenses store
        if (!db.objectStoreNames.contains('expenses')) {
          const expenseStore = db.createObjectStore('expenses', { keyPath: 'id' });
          expenseStore.createIndex('date', 'date', { unique: false });
          expenseStore.createIndex('category', 'category', { unique: false });
          expenseStore.createIndex('synced', 'synced', { unique: false });
        }
        
        // Create sync queue store
        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
          syncStore.createIndex('type', 'type', { unique: false });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        // Create receipts store
        if (!db.objectStoreNames.contains('receipts')) {
          const receiptStore = db.createObjectStore('receipts', { keyPath: 'id' });
          receiptStore.createIndex('expenseId', 'expenseId', { unique: false });
          receiptStore.createIndex('uploaded', 'uploaded', { unique: false });
        }
      };
    });
  }

  async addExpense(expense: Expense): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['expenses'], 'readwrite');
    const store = transaction.objectStore('expenses');
    
    return new Promise((resolve, reject) => {
      const request = store.add({ ...expense, synced: false });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllExpenses(): Promise<Expense[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['expenses'], 'readonly');
    const store = transaction.objectStore('expenses');
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const expenses = request.result.map(({ synced, ...expense }) => expense);
        resolve(expenses);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getUnsyncedExpenses(): Promise<Expense[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['expenses'], 'readonly');
    const store = transaction.objectStore('expenses');
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const expenses = request.result
          .filter(item => item.synced === false)
          .map(({ synced, ...expense }) => expense);
        resolve(expenses);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async markAsSynced(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['expenses'], 'readwrite');
    const store = transaction.objectStore('expenses');
    
    return new Promise((resolve, reject) => {
      const getRequest = store.get(id);
      
      getRequest.onsuccess = () => {
        const expense = getRequest.result;
        if (expense) {
          expense.synced = true;
          const updateRequest = store.put(expense);
          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          resolve();
        }
      };
      
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async addReceipt(receipt: {
    id: string;
    expenseId: string;
    file: File;
    uploaded: boolean;
  }): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['receipts'], 'readwrite');
    const store = transaction.objectStore('receipts');
    
    return new Promise((resolve, reject) => {
      const request = store.add(receipt);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getReceiptsByExpense(expenseId: string): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['receipts'], 'readonly');
    const store = transaction.objectStore('receipts');
    const index = store.index('expenseId');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(expenseId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async addToSyncQueue(action: string, data: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['syncQueue'], 'readwrite');
    const store = transaction.objectStore('syncQueue');
    
    return new Promise((resolve, reject) => {
      const request = store.add({
        type: action,
        data,
        timestamp: Date.now()
      });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSyncQueue(): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['syncQueue'], 'readonly');
    const store = transaction.objectStore('syncQueue');
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async clearSyncQueue(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['syncQueue'], 'readwrite');
    const store = transaction.objectStore('syncQueue');
    
    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

// Singleton instance
export const offlineDataManager = new OfflineDataManager();