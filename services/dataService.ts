import { supabase } from './supabaseClient';
import { Expense, UserSettings } from '../types';

export const dataService = {
  async getUserSettings(userId: string): Promise<UserSettings | null> {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code !== 'PGRST116') { // PGRST116 is 'Row not found'
        console.error('Error fetching settings:', error);
      }
      return null;
    }
    
    if (!data) return null;

    return {
       isOnboarded: data.is_onboarded,
       name: data.name,
       currency: data.currency,
       incomeStyle: data.income_style,
       budgetLimit: data.budget_limit,
       savingsGoal: data.savings_goal,
       currentSavings: data.current_savings,
       language: data.language
    };
  },

  async updateUserSettings(userId: string, settings: UserSettings) {
    const { error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        is_onboarded: settings.isOnboarded,
        name: settings.name,
        currency: settings.currency,
        income_style: settings.incomeStyle,
        budget_limit: settings.budgetLimit,
        savings_goal: settings.savingsGoal,
        current_savings: settings.currentSavings,
        language: settings.language
      });

    if (error) console.error('Error updating settings:', error);
  },

  async getExpenses(userId: string): Promise<Expense[]> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching expenses:', error);
      return [];
    }

    return data.map((item: any) => ({
      id: item.id,
      amount: item.amount,
      category: item.category,
      date: item.date,
      merchant: item.merchant,
      note: item.note,
      isScanned: item.is_scanned
    }));
  },

  async addExpense(userId: string, expense: Expense) {
    const { error } = await supabase
      .from('expenses')
      .insert({
        id: expense.id,
        user_id: userId,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        merchant: expense.merchant,
        note: expense.note,
        is_scanned: expense.isScanned
      });

    if (error) console.error('Error adding expense:', error);
  }
};