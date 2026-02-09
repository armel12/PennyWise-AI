import React from 'react';
import { Home, PlusCircle, Target, BookOpen } from 'lucide-react';
import { ViewState, Language } from '../types';
import { translations } from '../utils/translations';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  language: Language;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView, language }) => {
  const t = translations[language];

  const navItems = [
    { view: 'dashboard', icon: Home, label: t.navHome },
    { view: 'savings', icon: Target, label: t.navSavings },
    { view: 'education', icon: BookOpen, label: t.navLearn },
  ];

  return (
    <>
      {/* Floating Action Button for Add Expense - Always Visible */}
      <div className="fixed bottom-24 right-4 z-20 md:hidden">
        <button
          onClick={() => setView('add-expense')}
          className="bg-indigo-600 text-white p-4 rounded-full shadow-xl hover:bg-indigo-700 transition-transform hover:scale-105 active:scale-95 flex items-center justify-center"
          aria-label="Add Expense"
        >
          <PlusCircle size={28} />
        </button>
      </div>

      {/* Mobile Bottom Nav - With safe area padding support */}
      <div 
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 pt-2 pb-2 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 flex justify-around items-start"
        style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))', height: 'calc(60px + env(safe-area-inset-bottom))' }}
      >
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setView(item.view as ViewState)}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentView === item.view ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <item.icon size={24} strokeWidth={currentView === item.view ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Desktop/Tablet Navigation (Simple top bar) */}
      <div className="hidden md:flex fixed top-0 left-0 right-0 bg-white border-b border-gray-100 px-8 py-4 shadow-sm z-10 justify-between items-center">
         <h1 className="text-xl font-bold text-indigo-800">PennyWise AI</h1>
         <div className="flex gap-6">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => setView(item.view as ViewState)}
                className={`flex items-center gap-2 font-medium ${
                  currentView === item.view ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-500'
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
            <button 
                onClick={() => setView('add-expense')}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-semibold"
            >
                {t.addExpenseBtn}
            </button>
         </div>
      </div>
    </>
  );
};