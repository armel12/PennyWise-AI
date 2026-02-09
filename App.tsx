import React, { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { AddExpense } from './components/AddExpense';
import { ScanReceipt } from './components/ScanReceipt';
import { Navigation } from './components/Navigation';
import { Savings } from './components/Savings';
import { Education } from './components/Education';
import { AuthScreen } from './components/AuthScreen';
import { Expense, UserSettings, ViewState, User } from './types';
import { authService } from './services/authService';
import { dataService } from './services/dataService';
import { supabase } from './services/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  // --- State Management ---
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<ViewState>('dashboard'); 
  
  const [settings, setSettings] = useState<UserSettings>({
      isOnboarded: false,
      name: '',
      currency: 'USD',
      incomeStyle: 'irregular',
      budgetLimit: 1000,
      savingsGoal: 500,
      currentSavings: 0,
      language: 'en'
  });

  const [expenses, setExpenses] = useState<Expense[]>([]);

  // --- Auth & Data Loading ---
  
  useEffect(() => {
    // Listen for Supabase auth changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const mappedUser = authService.mapUser(session.user);
        setUser(mappedUser);
        loadUserData(mappedUser.id);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const mappedUser = authService.mapUser(session.user);
        setUser(mappedUser);
        loadUserData(mappedUser.id);
      } else {
        setUser(null);
        setSettings({
             isOnboarded: false,
             name: '',
             currency: 'USD',
             incomeStyle: 'irregular',
             budgetLimit: 1000,
             savingsGoal: 500,
             currentSavings: 0,
             language: 'en'
        });
        setExpenses([]);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userId: string) => {
    try {
        const [fetchedSettings, fetchedExpenses] = await Promise.all([
            dataService.getUserSettings(userId),
            dataService.getExpenses(userId)
        ]);

        if (fetchedSettings) {
            setSettings(fetchedSettings);
        } else {
             // New user defaults (handled in state init, but ensures logic if user exists but settings dont)
             // We keep the default state settings which has isOnboarded: false
        }

        if (fetchedExpenses) {
            setExpenses(fetchedExpenses);
        }
    } catch (e) {
        console.error("Failed to load user data", e);
    } finally {
        setIsLoading(false);
    }
  };

  // --- Handlers ---
  const handleLogin = (loggedInUser: User) => {
    // State update handled by onAuthStateChange subscription
  };

  const handleLogout = async () => {
    await authService.logout();
    // State update handled by onAuthStateChange subscription
  };

  const handleOnboardingComplete = async (newSettings: UserSettings) => {
    if (!user) return;
    setSettings(newSettings);
    setView('dashboard');
    await dataService.updateUserSettings(user.id, newSettings);
  };

  const updateSettingsWrapper = async (newSettings: UserSettings) => {
      setSettings(newSettings);
      if (user) {
          await dataService.updateUserSettings(user.id, newSettings);
      }
  };

  const handleAddExpense = async (newExpense: Omit<Expense, 'id'>) => {
    if (!user) return;
    const expense: Expense = { ...newExpense, id: uuidv4() };
    setExpenses(prev => [expense, ...prev]);
    setView('dashboard');
    await dataService.addExpense(user.id, expense);
  };

  // --- Rendering ---
  
  if (isLoading) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-indigo-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-indigo-600 font-bold animate-pulse">Loading PennyWise...</p>
        </div>
    );
  }

  // 1. Auth Check
  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  // 2. Onboarding Check
  if (!settings.isOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // 3. Full Screen Views (No Navigation)
  if (view === 'add-expense') {
    return (
        <AddExpense 
            onAdd={handleAddExpense} 
            onCancel={() => setView('dashboard')} 
            onScan={() => setView('scan-receipt')}
            settings={settings}
        />
    );
  }

  if (view === 'scan-receipt') {
    return (
        <ScanReceipt 
            onSave={handleAddExpense} 
            onCancel={() => setView('add-expense')} 
            settings={settings}
        />
    );
  }

  // 4. Tab Views (With Navigation)
  return (
    <div className="min-h-screen bg-white md:bg-gray-50 font-sans text-gray-900">
      
      {view === 'dashboard' && (
        <Dashboard 
            expenses={expenses} 
            settings={settings} 
            updateSettings={updateSettingsWrapper}
            setView={setView}
            onLogout={handleLogout}
        />
      )}

      {view === 'savings' && (
        <Savings 
            settings={settings} 
            updateSettings={updateSettingsWrapper} 
        />
      )}

      {view === 'education' && (
        <Education settings={settings} />
      )}

      <Navigation currentView={view} setView={setView} language={settings.language} />
    </div>
  );
};

export default App;