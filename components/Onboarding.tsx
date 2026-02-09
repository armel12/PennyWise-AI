import React, { useState } from 'react';
import { UserSettings, Currency, IncomeStyle } from '../types';
import { Button } from './Button';
import { translations } from '../utils/translations';

interface OnboardingProps {
  onComplete: (settings: UserSettings) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [incomeStyle, setIncomeStyle] = useState<IncomeStyle>('irregular');
  const [budgetLimit, setBudgetLimit] = useState('');
  const [savingsGoal, setSavingsGoal] = useState('');
  
  // Default to English for onboarding unless we want to add a selector here too.
  // For simplicity, we use English in Onboarding, user changes later.
  // Or we can add a small toggle. Let's add a small toggle.
  const [lang, setLang] = useState<'en'|'fr'>('en');
  const t = translations[lang];

  const handleFinish = () => {
    onComplete({
      isOnboarded: true,
      name,
      currency,
      incomeStyle,
      budgetLimit: parseFloat(budgetLimit) || 1000,
      savingsGoal: parseFloat(savingsGoal) || 500,
      currentSavings: 0,
      language: lang
    });
  };

  return (
    <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-6 relative">
      
      <div className="absolute top-4 right-4 z-10">
         <button 
            onClick={() => setLang(l => l === 'en' ? 'fr' : 'en')}
            className="bg-white/20 backdrop-blur-md w-12 h-12 rounded-full font-bold text-lg text-white shadow-lg border border-white/30 flex items-center justify-center"
         >
            {lang === 'en' ? 'EN' : 'FR'}
         </button>
      </div>

      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl space-y-6 animate-in zoom-in duration-300">
        
        {step === 1 && (
          <div className="space-y-6 text-center">
            <h1 className="text-3xl font-bold text-gray-800">{t.welcome}</h1>
            <p className="text-gray-500">{t.welcomeDesc}</p>
            <div className="text-left space-y-2">
                <label className="text-sm font-bold text-gray-600">{t.nameLabel}</label>
                <input 
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    autoFocus
                />
            </div>
            <Button fullWidth onClick={() => setStep(2)} disabled={!name}>{t.startBtn}</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
             <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">{t.currencyTitle}</h2>
             </div>
             <div className="grid grid-cols-3 gap-3">
                {(['USD', 'EUR', 'GBP', 'INR', 'NGN', 'PHP'] as Currency[]).map(curr => (
                    <button 
                        key={curr}
                        onClick={() => setCurrency(curr)}
                        className={`p-4 rounded-xl border font-bold text-lg transition-all ${
                            currency === curr 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' 
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        {curr}
                    </button>
                ))}
             </div>
             <Button fullWidth onClick={() => setStep(3)}>{t.nextBtn}</Button>
          </div>
        )}

        {step === 3 && (
            <div className="space-y-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">{t.financialGoalsTitle}</h2>
                    <p className="text-gray-500 text-sm mt-1">{t.financialGoalsDesc}</p>
                </div>
                
                {/* Budget Input */}
                <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">{t.budgetTitle}</label>
                     <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">{currency}</span>
                        <input 
                            type="number"
                            inputMode="decimal"
                            value={budgetLimit}
                            onChange={e => setBudgetLimit(e.target.value)}
                            className="w-full pl-16 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xl font-bold"
                            placeholder="1000"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Savings Goal Input */}
                <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">{t.savingsGoalLabel}</label>
                     <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">{currency}</span>
                        <input 
                            type="number"
                            inputMode="decimal"
                            value={savingsGoal}
                            onChange={e => setSavingsGoal(e.target.value)}
                            className="w-full pl-16 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xl font-bold"
                            placeholder="500"
                        />
                    </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-xl text-xs text-orange-700">
                    {t.budgetHint}
                </div>
                <Button fullWidth onClick={handleFinish} disabled={!budgetLimit || !savingsGoal}>{t.finishBtn}</Button>
            </div>
        )}

      </div>
    </div>
  );
};