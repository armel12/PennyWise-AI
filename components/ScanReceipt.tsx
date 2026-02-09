import React, { useState, useRef } from 'react';
import { parseReceiptImage } from '../services/geminiService';
import { Expense, Category, UserSettings } from '../types';
import { Button } from './Button';
import { ArrowLeft, UploadCloud, RefreshCw, CheckCircle } from 'lucide-react';
import { translations, categoryTranslations } from '../utils/translations';

interface ScanReceiptProps {
  onSave: (expense: Omit<Expense, 'id'>) => void;
  onCancel: () => void;
  settings: UserSettings;
}

export const ScanReceipt: React.FC<ScanReceiptProps> = ({ onSave, onCancel, settings }) => {
  const t = translations[settings.language];
  const catT = categoryTranslations[settings.language];

  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Edit State
  const [parsedData, setParsedData] = useState<{
    total: string;
    category: Category;
    date: string;
    merchant: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage(base64);
        processImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (base64: string) => {
    setIsProcessing(true);
    setError(null);
    try {
      const result = await parseReceiptImage(base64);
      
      setParsedData({
        total: result.total.toString(),
        category: result.category || 'Other',
        date: result.date || new Date().toISOString().split('T')[0],
        merchant: result.merchant || ''
      });

    } catch (err: any) {
      setError(err.message || "Failed to scan. Try manual entry.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = () => {
    if (parsedData && parsedData.total) {
      onSave({
        amount: parseFloat(parsedData.total),
        category: parsedData.category,
        date: parsedData.date,
        merchant: parsedData.merchant,
        note: parsedData.merchant ? `At ${parsedData.merchant}` : 'Scanned Receipt',
        isScanned: true
      });
    }
  };

  if (!image) {
    return (
        <div className="min-h-screen bg-white md:pt-20 flex flex-col">
            <div className="p-4 flex items-center gap-4">
                <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft size={24} className="text-gray-600" />
                </button>
                <h2 className="text-xl font-bold">{t.scanTitle}</h2>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 text-indigo-600">
                    <UploadCloud size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{t.snapSave}</h3>
                <p className="text-gray-500 mb-8 max-w-xs">
                    {t.snapDesc}
                </p>

                <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />

                <Button 
                    onClick={() => fileInputRef.current?.click()} 
                    fullWidth
                    className="max-w-xs shadow-xl shadow-indigo-200"
                >
                    {t.takePhotoBtn}
                </Button>
                
                <button 
                    onClick={onCancel} 
                    className="mt-4 text-sm text-gray-500 font-medium hover:text-indigo-600"
                >
                    {t.enterManually}
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-white md:pt-20">
      <div className="p-4 border-b border-gray-100 flex items-center gap-4">
        <button onClick={() => setImage(null)} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h2 className="text-xl font-bold">{t.verifyTitle}</h2>
      </div>

      <div className="p-6 max-w-lg mx-auto">
        <div className="mb-6 rounded-xl overflow-hidden border border-gray-200 h-48 bg-gray-50 flex items-center justify-center relative">
           <img src={image} alt="Receipt" className="h-full w-full object-contain" />
           {isProcessing && (
             <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                <RefreshCw className="animate-spin mb-2" size={32} />
                <p className="font-semibold">{t.aiReading}</p>
             </div>
           )}
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-center gap-2">
                <span>{error}</span>
                <button onClick={() => setImage(null)} className="underline ml-auto">{t.retry}</button>
            </div>
        )}

        {parsedData && !isProcessing && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t.totalAmount} ({settings.currency})</label>
                    <input 
                        type="number" 
                        value={parsedData.total}
                        onChange={(e) => setParsedData({...parsedData, total: e.target.value})}
                        className="w-full text-3xl font-bold text-gray-800 border-b-2 border-indigo-100 focus:border-indigo-600 focus:outline-none py-2 bg-transparent"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t.merchant}</label>
                    <input 
                        type="text" 
                        value={parsedData.merchant}
                        onChange={(e) => setParsedData({...parsedData, merchant: e.target.value})}
                        className="w-full font-medium text-gray-800 border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t.dateLabel}</label>
                        <input 
                            type="date" 
                            value={parsedData.date}
                            onChange={(e) => setParsedData({...parsedData, date: e.target.value})}
                            className="w-full font-medium text-gray-800 border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t.categoryLabel}</label>
                        <select 
                            value={parsedData.category}
                            onChange={(e) => setParsedData({...parsedData, category: e.target.value as Category})}
                            className="w-full font-medium text-gray-800 border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 bg-white"
                        >
                            {['Food', 'Transport', 'Housing', 'Entertainment', 'Health', 'Education', 'Savings', 'Other'].map(c => (
                                <option key={c} value={c}>{catT[c]}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="pt-6">
                    <Button onClick={handleConfirm} fullWidth>
                        <CheckCircle size={20} />
                        {t.confirmSave}
                    </Button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
