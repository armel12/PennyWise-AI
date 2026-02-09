import React, { useState } from 'react';
import { UserSettings } from '../types';
import { Target, TrendingUp, Plus, Edit2 } from 'lucide-react';
import { translations } from '../utils/translations';
import { Button } from './Button';

interface SavingsProps {
  settings: UserSettings;
  updateSettings: (s: UserSettings) => void;
}

export const Savings: React.FC<SavingsProps> = ({ settings, updateSettings }) => {
  const t = translations[settings.language];
  const [addAmount, setAddAmount] = useState('');
  
  // Edit Goal State
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  
  const percentage = Math.min(100, (settings.currentSavings / settings.savingsGoal) * 100);

  const handleAddSavings = () => {
    const amount = parseFloat(addAmount);
    if (!amount) return;
    
    updateSettings({
        ...settings,
        currentSavings: settings.currentSavings + amount
    });
    setAddAmount('');
  };

  const startEditingGoal = () => {
      setNewGoal(settings.savingsGoal.toString());
      setIsEditingGoal(true);
  };

  const saveGoal = () => {
      const val = parseFloat(newGoal);
      if (val > 0) {
          updateSettings({ ...settings, savingsGoal: val });
          setIsEditingGoal(false);
      }
  };

  return (
    <div className="pb-24 pt-4 md:pt-20 px-4 max-w-2xl mx-auto space-y-6">
        
        {/* Edit Goal Modal */}
        {isEditingGoal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in duration-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">{t.editGoalTitle}</h3>
                  <div className="relative mb-6">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">{settings.currency}</span>
                      <input 
                          type="number"
                          inputMode="decimal"
                          value={newGoal}
                          onChange={(e) => setNewGoal(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xl font-bold"
                          autoFocus
                      />
                  </div>
                  <div className="flex gap-3">
                      <Button variant="secondary" fullWidth onClick={() => setIsEditingGoal(false)}>
                          {t.cancel}
                      </Button>
                      <Button fullWidth onClick={saveGoal}>
                          {t.saveChanges}
                      </Button>
                  </div>
              </div>
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-800">{t.savingsPocket}</h2>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center space-y-4">
            <div className="w-32 h-32 mx-auto rounded-full border-8 border-indigo-100 flex items-center justify-center relative">
                <Target size={40} className="text-indigo-600" />
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle 
                        cx="50" cy="50" r="46" 
                        fill="none" 
                        stroke="#4f46e5" 
                        strokeWidth="8"
                        strokeDasharray="289" // 2 * pi * 46
                        strokeDashoffset={289 - (289 * percentage) / 100}
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
            </div>
            
            <div>
                <p className="text-gray-500 text-sm">{t.youSaved}</p>
                <h3 className="text-4xl font-bold text-gray-900 mt-1">{settings.currency}{settings.currentSavings}</h3>
                
                <button 
                    onClick={startEditingGoal}
                    className="flex items-center justify-center gap-2 mt-3 mx-auto px-4 py-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-indigo-600 transition-colors active:scale-95"
                >
                    <span className="text-sm font-medium">{t.goal}: {settings.currency}{settings.savingsGoal}</span>
                    <Edit2 size={14} />
                </button>
            </div>
        </div>

        <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="font-bold mb-4 flex items-center gap-2">
                <TrendingUp size={20} /> {t.addToSavings}
            </h3>
            <div className="flex gap-2">
                <input 
                    type="number" 
                    inputMode="decimal"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    placeholder={t.amountPlaceholder}
                    className="flex-1 rounded-lg px-4 py-3 text-gray-900 outline-none font-bold"
                />
                <button 
                    onClick={handleAddSavings}
                    className="bg-indigo-800 hover:bg-indigo-900 p-3 rounded-lg font-bold"
                >
                    <Plus />
                </button>
            </div>
            <p className="text-xs opacity-70 mt-3">
                {t.savingTip.replace('{currency}', settings.currency)}
            </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
             <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <p className="text-green-700 font-bold text-sm">{t.smallWinsTitle}</p>
                <p className="text-green-600 text-xs mt-1">{t.smallWinsDesc.replace('{currency}', settings.currency)}</p>
             </div>
             <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <p className="text-blue-700 font-bold text-sm">{t.consistencyTitle}</p>
                <p className="text-blue-600 text-xs mt-1">{t.consistencyDesc}</p>
             </div>
        </div>
    </div>
  );
};