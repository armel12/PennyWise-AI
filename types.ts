export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'NGN' | 'PHP';

export type IncomeStyle = 'daily' | 'weekly' | 'irregular';

export type Category = 'Food' | 'Transport' | 'Housing' | 'Entertainment' | 'Health' | 'Education' | 'Savings' | 'Other';

export type Language = 'en' | 'fr';

export interface User {
  id: string;
  email: string;
  phone?: string;
  name?: string;
  avatar?: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  date: string; // ISO Date string
  merchant?: string;
  note?: string;
  isScanned?: boolean;
}

export interface UserSettings {
  isOnboarded: boolean;
  name: string;
  currency: Currency;
  incomeStyle: IncomeStyle;
  budgetLimit: number; // Monthly or Daily based on preference, simplified to Monthly for MVP
  savingsGoal: number;
  currentSavings: number;
  language: Language;
}

export interface ReceiptData {
  total: number;
  date?: string;
  merchant?: string;
  category?: Category;
  items?: string[];
}

export type ViewState = 'onboarding' | 'dashboard' | 'add-expense' | 'scan-receipt' | 'savings' | 'education';