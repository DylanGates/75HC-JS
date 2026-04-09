'use client';

import { useState, useEffect } from 'react';

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export function useLocalStorage(key: string, initialValue: Expense[] = []) {
  const [storedValue, setStoredValue] = useState<Expense[]>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  const setValue = (value: Expense[] | ((val: Expense[]) => Expense[])) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue] as const;
}