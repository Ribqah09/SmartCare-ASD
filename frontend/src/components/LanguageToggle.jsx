import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-brand-400 transition-all duration-300 group shadow-sm"
    >
      <Globe className="w-3.5 h-3.5 text-brand-600 transition-transform group-hover:rotate-45" />
      <div className="flex items-center gap-1.5">
        <span className={`text-[10px] font-black transition-colors ${language === 'en' ? 'text-brand-700' : 'text-slate-400'}`}>
          EN
        </span>
        {/* Decorative separator line */}
        <div className="w-[1px] h-3 bg-slate-300" />
        <span className={`text-[11px] font-bold transition-colors ${language === 'ur' ? 'text-brand-700' : 'text-slate-400'}`}>
          اردو
        </span>
      </div>
    </button>
  );
}