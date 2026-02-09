import React, { useState } from 'react';
import { Expense, Category, UserSettings } from '../types';
import { Button } from './Button';
import { ArrowLeft, Camera } from 'lucide-react';
import { translations, categoryTranslations } from '../utils/translations';

interface AddExpenseProps {
  onAdd: (expense: Omit<Expense, 'id'>) => void;
  onCancel: () => void;
  onScan: () => void;
  settings: UserSettings;
}

export const AddExpense: React.FC<AddExpenseProps> = ({ onAdd, onCancel, onScan, settings }) => {
  const t = translations[settings.language];
  const catT = categoryTranslations[settings.language];

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Food');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const categories: Category[] = ['Food', 'Transport', 'Housing', 'Entertainment', 'Health', 'Education', 'Savings', 'Other'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    onAdd({
      amount: parseFloat(amount),
      category,
      note,
      date,
      isScanned: false
    });
  };

  return (
    <div className="min-h-screen bg-white md:pt-20">
      <div className="p-4 border-b border-gray-100 flex items-center gap-4 sticky top-0 bg-white z-10">
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h2 className="text-xl font-bold">{t.addExpenseTitle}</h2>
      </div>

      <div className="p-6 max-w-lg mx-auto space-y-8">
        
        {/* Big Amount Input */}
        <div className="text-center">
            <label className="block text-sm font-medium text-gray-500 mb-2">{t.howMuch}</label>
            <div className="relative inline-block">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full text-3xl font-bold text-gray-400 pr-2">{settings.currency}</span>
                <input 
                    type="number" 
                    inputMode="decimal"
                    pattern="[0-9]*"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="text-6xl font-bold text-gray-800 w-48 text-center focus:outline-none placeholder:text-gray-200"
                    autoFocus
                />
            </div>
        </div>

        {/* AI Scan CTA */}
        <div className="flex justify-center">
            <button 
                type="button"
                onClick={onScan}
                className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-5 py-2 rounded-full font-medium hover:bg-indigo-100 transition shadow-sm"
            >
                <Camera size={18} />
                {t.scanBtn}
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Category Grid */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">{t.categoryLabel}</label>
                <div className="grid grid-cols-4 gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setCategory(cat)}
                            className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
                                category === cat 
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105' 
                                : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                            }`}
                        >
                            <div className="text-lg mb-1">
                                {cat === 'Food' ? '🍔' : 
                                 cat === 'Transport' ? '🚌' :
                                 cat === 'Housing' ? '🏠' :
                                 cat === 'Entertainment' ? '🎬' :
                                 cat === 'Health' ? '💊' :
                                 cat === 'Education' ? '📚' :
                                 cat === 'Savings' ? '💰' :
                                 '📦'}
                            </div>
                            {catT[cat]}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.dateLabel}</label>
                    <input 
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">{t.noteLabel}</label>
                    <input 
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder={t.notePlaceholder}
                        className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>

            <Button type="submit" fullWidth disabled={!amount}>
                {t.saveExpenseBtn}
            </Button>
        </form>
      </div>
    </div>
  );
};