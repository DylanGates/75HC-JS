import { Expense } from '@/lib/types';

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export class ExpenseValidator {
  static validateExpense(expense: Partial<Expense>): ValidationResult {
    const errors: ValidationError[] = [];

    // Description validation
    if (!expense.description || expense.description.trim().length === 0) {
      errors.push({
        field: 'description',
        message: 'Description is required',
        code: 'REQUIRED'
      });
    } else if (expense.description.length > 200) {
      errors.push({
        field: 'description',
        message: 'Description must be less than 200 characters',
        code: 'MAX_LENGTH'
      });
    }

    // Amount validation
    if (expense.amount === undefined || expense.amount === null) {
      errors.push({
        field: 'amount',
        message: 'Amount is required',
        code: 'REQUIRED'
      });
    } else if (typeof expense.amount !== 'number' || isNaN(expense.amount)) {
      errors.push({
        field: 'amount',
        message: 'Amount must be a valid number',
        code: 'INVALID_TYPE'
      });
    } else if (expense.amount <= 0) {
      errors.push({
        field: 'amount',
        message: 'Amount must be greater than 0',
        code: 'MIN_VALUE'
      });
    } else if (expense.amount > 1000000) {
      errors.push({
        field: 'amount',
        message: 'Amount must be less than 1,000,000',
        code: 'MAX_VALUE'
      });
    }

    // Category validation
    const validCategories = ['food', 'transport', 'utilities', 'entertainment', 'shopping', 'health', 'other'];
    if (!expense.category) {
      errors.push({
        field: 'category',
        message: 'Category is required',
        code: 'REQUIRED'
      });
    } else if (!validCategories.includes(expense.category)) {
      errors.push({
        field: 'category',
        message: 'Invalid category selected',
        code: 'INVALID_CATEGORY'
      });
    }

    // Date validation
    if (!expense.date) {
      errors.push({
        field: 'date',
        message: 'Date is required',
        code: 'REQUIRED'
      });
    } else {
      const date = new Date(expense.date);
      if (isNaN(date.getTime())) {
        errors.push({
          field: 'date',
          message: 'Invalid date format',
          code: 'INVALID_DATE'
        });
      } else if (date > new Date()) {
        errors.push({
          field: 'date',
          message: 'Date cannot be in the future',
          code: 'FUTURE_DATE'
        });
      } else if (date < new Date('2000-01-01')) {
        errors.push({
          field: 'date',
          message: 'Date is too far in the past',
          code: 'PAST_DATE'
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateAmount(amount: number): ValidationResult {
    const errors: ValidationError[] = [];

    if (amount === undefined || amount === null) {
      errors.push({
        field: 'amount',
        message: 'Amount is required',
        code: 'REQUIRED'
      });
    } else if (typeof amount !== 'number' || isNaN(amount)) {
      errors.push({
        field: 'amount',
        message: 'Amount must be a valid number',
        code: 'INVALID_TYPE'
      });
    } else if (amount <= 0) {
      errors.push({
        field: 'amount',
        message: 'Amount must be greater than 0',
        code: 'MIN_VALUE'
      });
    } else if (amount > 1000000) {
      errors.push({
        field: 'amount',
        message: 'Amount must be less than 1,000,000',
        code: 'MAX_VALUE'
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateDate(date: string): ValidationResult {
    const errors: ValidationError[] = [];

    if (!date) {
      errors.push({
        field: 'date',
        message: 'Date is required',
        code: 'REQUIRED'
      });
    } else {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        errors.push({
          field: 'date',
          message: 'Invalid date format',
          code: 'INVALID_DATE'
        });
      } else if (parsedDate > new Date()) {
        errors.push({
          field: 'date',
          message: 'Date cannot be in the future',
          code: 'FUTURE_DATE'
        });
      } else if (parsedDate < new Date('2000-01-01')) {
        errors.push({
          field: 'date',
          message: 'Date is too far in the past',
          code: 'PAST_DATE'
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export class ErrorHandler {
  static handleDatabaseError(error: any): string {
    if (error.code === 'SQLITE_CONSTRAINT') {
      return 'This expense already exists or conflicts with existing data.';
    } else if (error.code === 'SQLITE_FULL') {
      return 'Database is full. Please export your data and clear some expenses.';
    } else if (error.code === 'SQLITE_READONLY') {
      return 'Database is read-only. Please check permissions.';
    } else if (error.message?.includes('no such table')) {
      return 'Database table not found. Please restart the application.';
    } else {
      return 'A database error occurred. Please try again.';
    }
  }

  static handleNetworkError(error: any): string {
    if (error.message?.includes('Failed to fetch')) {
      return 'Network connection failed. Please check your internet connection.';
    } else if (error.message?.includes('timeout')) {
      return 'Request timed out. Please try again.';
    } else if (error.status === 404) {
      return 'Service not found. Please try again later.';
    } else if (error.status === 500) {
      return 'Server error. Please try again later.';
    } else {
      return 'A network error occurred. Please try again.';
    }
  }

  static handleStorageError(error: any): string {
    if (error.name === 'QuotaExceededError') {
      return 'Storage quota exceeded. Please export your data and clear some expenses.';
    } else if (error.name === 'SecurityError') {
      return 'Storage access denied. Please check your browser settings.';
    } else {
      return 'A storage error occurred. Please try again.';
    }
  }

  static handleValidationError(errors: ValidationError[]): string {
    if (errors.length === 0) return '';
    if (errors.length === 1) return errors[0].message;
    return `Multiple validation errors: ${errors.map(e => e.message).join(', ')}`;
  }
}

export function formatErrorMessage(error: any): string {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (error?.message) return error.message;
  return 'An unexpected error occurred';
}

export function isRetryableError(error: any): boolean {
  // Network errors, timeouts, temporary server errors
  if (error.message?.includes('network') || 
      error.message?.includes('timeout') ||
      error.status >= 500) {
    return true;
  }
  
  // Database connection errors
  if (error.code === 'SQLITE_BUSY' || 
      error.code === 'SQLITE_LOCKED') {
    return true;
  }
  
  return false;
}