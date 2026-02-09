import React from 'react';
import { BookOpen, ShieldCheck, TrendingUp, AlertTriangle } from 'lucide-react';
import { UserSettings } from '../types';
import { translations } from '../utils/translations';

interface EducationProps {
  settings: UserSettings;
}

export const Education: React.FC<EducationProps> = ({ settings }) => {
  const t = translations[settings.language];

  return (
    <div className="pb-24 pt-4 md:pt-20 px-4 max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-6">
            <div className="bg-yellow-100 p-3 rounded-full text-yellow-700">
                <BookOpen size={24} />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-800">{t.learnTitle}</h2>
                <p className="text-gray-500 text-sm">{t.learnDesc}</p>
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-start gap-4">
                <ShieldCheck className="text-green-500 shrink-0 mt-1" size={24} />
                <div>
                    <h3 className="font-bold text-gray-800">{t.saveVsInvestTitle}</h3>
                    <p className="text-gray-600 text-sm mt-1 leading-relaxed whitespace-pre-line">
                        {t.saveVsInvestDesc}
                    </p>
                </div>
            </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white">
            <div className="flex items-start gap-4">
                <TrendingUp className="shrink-0 mt-1" size={24} />
                <div>
                    <h3 className="font-bold text-lg">{t.compoundTitle}</h3>
                    <p className="text-white/90 text-sm mt-2 leading-relaxed">
                        {t.compoundDesc}
                    </p>
                </div>
            </div>
        </div>

        <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
             <div className="flex items-start gap-4">
                <AlertTriangle className="text-orange-600 shrink-0 mt-1" size={24} />
                <div>
                    <h3 className="font-bold text-orange-800">{t.ruleTitle}</h3>
                    <ul className="list-disc list-inside text-sm text-orange-700 mt-2 space-y-1">
                        <li>{t.rule1}</li>
                        <li>{t.rule2}</li>
                        <li>{t.rule3}</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
  );
};
