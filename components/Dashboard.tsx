import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Expense, UserSettings } from '../types';
import { AlertTriangle, TrendingUp, Wallet, LogOut, Edit2 } from 'lucide-react';
import { translations, categoryTranslations } from '../utils/translations';
import { Button } from './Button';

interface DashboardProps {
  expenses: Expense[];
  settings: UserSettings;
  updateSettings: (settings: UserSettings) => void;
  setView: (view: any) => void;
  onLogout: () => void;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#9ca3af'];

export const Dashboard: React.FC<DashboardProps> = ({ expenses, settings, updateSettings, setView, onLogout }) => {
  const t = translations[settings.language];
  const catT = categoryTranslations[settings.language];

  // Edit Budget State
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [newBudget, setNewBudget] = useState('');

  // Filter for current month
  const currentMonthExpenses = useMemo(() => {
    const now = new Date();
    return expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
  }, [expenses]);

  const todayExpenses = useMemo(() => {
    const now = new Date().toISOString().split('T')[0];
    return expenses.filter(e => e.date === now);
  }, [expenses]);

  const totalSpentMonth = currentMonthExpenses.reduce((sum, item) => sum + item.amount, 0);
  const totalSpentToday = todayExpenses.reduce((sum, item) => sum + item.amount, 0);
  
  const budgetUsage = (totalSpentMonth / settings.budgetLimit) * 100;
  const isOverBudget = totalSpentMonth > settings.budgetLimit;
  const isNearBudget = !isOverBudget && budgetUsage > 80;

  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    currentMonthExpenses.forEach(e => {
      data[e.category] = (data[e.category] || 0) + e.amount;
    });
    return Object.keys(data).map(key => ({ name: key, value: data[key] }));
  }, [currentMonthExpenses]);

  const toggleLanguage = () => {
    updateSettings({
        ...settings,
        language: settings.language === 'en' ? 'fr' : 'en'
    });
  };

  const startEditingBudget = () => {
      setNewBudget(settings.budgetLimit.toString());
      setIsEditingBudget(true);
  };

  const saveBudget = () => {
      const val = parseFloat(newBudget);
      if (val > 0) {
          updateSettings({ ...settings, budgetLimit: val });
          setIsEditingBudget(false);
      }
  };

  return (
    <div className="pb-24 pt-4 md:pt-20 px-4 max-w-2xl mx-auto space-y-6">
      
      {/* Edit Budget Modal */}
      {isEditingBudget && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in duration-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">{t.editBudgetTitle}</h3>
                  <div className="relative mb-6">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">{settings.currency}</span>
                      <input 
                          type="number"
                          inputMode="decimal"
                          value={newBudget}
                          onChange={(e) => setNewBudget(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xl font-bold"
                          autoFocus
                      />
                  </div>
                  <div className="flex gap-3">
                      <Button variant="secondary" fullWidth onClick={() => setIsEditingBudget(false)}>
                          {t.cancel}
                      </Button>
                      <Button fullWidth onClick={saveBudget}>
                          {t.saveChanges}
                      </Button>
                  </div>
              </div>
          </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{t.hi}, {settings.name}</h2>
          <p className="text-gray-500 text-sm">{t.walletHappy}</p>
        </div>
        <div className="flex items-center gap-3">
             <button 
                onClick={toggleLanguage}
                className="font-bold text-lg hover:scale-110 transition-transform bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center text-gray-700"
                title="Switch Language"
             >
                {settings.language === 'en' ? 'EN' : 'FR'}
             </button>
            <button 
                onClick={onLogout}
                className="hover:scale-110 transition-transform bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center text-gray-700 hover:text-red-600 hover:bg-red-50"
                title="Log Out"
            >
                <LogOut size={18} />
            </button>
        </div>
      </div>

      {/* Budget Card */}
      <div className={`p-6 rounded-2xl shadow-lg text-white transition-all ${isOverBudget ? 'bg-gradient-to-br from-red-500 to-rose-600' : isNearBudget ? 'bg-gradient-to-br from-orange-400 to-red-500' : 'bg-gradient-to-br from-indigo-600 to-purple-600'}`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="opacity-80 text-sm font-medium">{t.remainingBudget}</p>
            <h3 className="text-3xl font-bold mt-1">
              {settings.currency}{Math.max(0, settings.budgetLimit - totalSpentMonth).toFixed(2)}
            </h3>
          </div>
          <Wallet className="opacity-80" />
        </div>
        
        <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white/90 rounded-full transition-all duration-1000"
            style={{ width: `${Math.min(100, budgetUsage)}%` }}
          />
        </div>
        
        <div className="mt-4 flex justify-between items-center text-sm">
          <span className="font-medium opacity-90">{t.spent}: {settings.currency}{totalSpentMonth.toFixed(0)}</span>
          
          <button 
            onClick={startEditingBudget}
            className="flex items-center gap-2 bg-black/20 hover:bg-black/30 active:bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
             <span className="font-medium">{t.limit}: {settings.currency}{settings.budgetLimit}</span>
             <Edit2 size={14} className="opacity-80" />
          </button>
        </div>

        {isOverBudget && (
          <div className="mt-4 flex items-center gap-2 bg-white/20 p-2 rounded-lg text-sm">
            <AlertTriangle size={16} />
            <span className="font-semibold">{t.budgetExceeded}</span>
          </div>
        )}
         {!isOverBudget && isNearBudget && (
          <div className="mt-4 flex items-center gap-2 bg-white/20 p-2 rounded-lg text-sm">
            <AlertTriangle size={16} />
            <span className="font-semibold">{t.budgetNear}</span>
          </div>
        )}
      </div>

      {/* Today's Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs font-semibold uppercase">{t.spentToday}</p>
            <p className="text-xl font-bold text-gray-800 mt-1">{settings.currency}{totalSpentToday}</p>
        </div>
        <div 
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition"
            onClick={() => setView('add-expense')}
        >
            <p className="text-gray-500 text-xs font-semibold uppercase flex items-center gap-1">
                {t.quickAdd} <TrendingUp size={12}/>
            </p>
            <p className="text-xl font-bold text-indigo-600 mt-1">{t.addExpenseBtn}</p>
        </div>
      </div>

      {/* Charts */}
      {categoryData.length > 0 ? (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">{t.chartTitle}</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                    formatter={(value: number, name: any, props: any) => [`${settings.currency}${value}`, t.amountPlaceholder || 'Amount']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {categoryData.map((entry, index) => (
               <div key={entry.name} className="flex items-center gap-2 text-sm text-gray-600">
                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                 <span className="truncate">{catT[entry.name] || entry.name}</span>
                 <span className="ml-auto font-medium">{settings.currency}{entry.value}</span>
               </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 p-8 rounded-2xl border-dashed border-2 border-gray-200 text-center">
            <p className="text-gray-400">{t.noExpenses}</p>
            <button onClick={() => setView('add-expense')} className="text-indigo-600 font-semibold mt-2 text-sm">{t.addFirstExpense}</button>
        </div>
      )}

      {/* Recent List */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">{t.recentTrans}</h3>
        <div className="space-y-3">
          {expenses.slice(0, 5).map(expense => (
            <div key={expense.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
              <div className="flex gap-3 items-center">
                 <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                    {expense.category === 'Food' ? '🍔' : 
                     expense.category === 'Transport' ? '🚌' :
                     expense.category === 'Housing' ? '🏠' :
                     expense.category === 'Entertainment' ? '🎬' :
                     '💸'}
                 </div>
                 <div>
                    <p className="font-semibold text-gray-800">{catT[expense.category]}</p>
                    <p className="text-xs text-gray-500">{expense.note || expense.merchant || new Date(expense.date).toLocaleDateString()}</p>
                 </div>
              </div>
              <span className="font-bold text-gray-900">-{settings.currency}{expense.amount}</span>
            </div>
          ))}
          {expenses.length === 0 && <p className="text-center text-gray-400 text-sm italic">{t.nothingHere}</p>}
        </div>
      </div>
    </div>
  );
};