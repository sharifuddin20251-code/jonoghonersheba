import React from 'react';
import { Language, StorageStats } from '../types';
import { translations, formatNumber, formatBytes } from '../utils/translations';
import {
  ShieldCheck,
  FileUp,
  Search,
  Lock,
  QrCode,
  CheckCircle,
  FileCheck2,
} from 'lucide-react';

interface HeroSectionProps {
  lang: Language;
  stats: StorageStats;
  onSelectTab: (tab: 'upload' | 'verify' | 'admin') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  stats,
  onSelectTab,
}) => {
  const t = translations[lang];

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-[#f8f9fa] border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Main Hero Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[#006a4e] text-xs font-semibold shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-[#006a4e]" />
            <span>{t.officialSeal}</span>
            <span aria-hidden="true">·</span>
            <span>{t.statSecureVal}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-serif leading-tight">
            {t.heroTitle}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {t.heroSubtitle}
          </p>

          {/* Quick Primary Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={() => onSelectTab('upload')}
              className="flex items-center gap-2 px-5 py-3 bg-[#006a4e] hover:bg-[#00523c] text-white text-sm font-semibold rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <FileUp className="w-4.5 h-4.5" />
              <span>{t.uploadActionBtn}</span>
            </button>

            <button
              onClick={() => onSelectTab('verify')}
              className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-slate-400 text-sm font-semibold rounded-xl shadow-2xs transition-all cursor-pointer"
            >
              <Search className="w-4.5 h-4.5 text-slate-500" />
              <span>{t.verifyActionBtn}</span>
            </button>
          </div>
        </div>

        {/* Civic Operational Stats Strip */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs text-center">
            <span className="text-xs text-slate-500 font-medium block">
              {t.statTotalDocs}
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900 mt-0.5 block">
              {formatNumber(stats.totalDocuments, lang)}
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs text-center">
            <span className="text-xs text-slate-500 font-medium block">
              {t.statTotalViews}
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900 mt-0.5 block">
              {formatNumber(stats.totalViews, lang)}
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs text-center">
            <span className="text-xs text-slate-500 font-medium block">
              {t.statStorageUsed}
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900 mt-0.5 block">
              {formatBytes(stats.totalSizeBytes, lang)}
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs text-center">
            <span className="text-xs text-slate-500 font-medium block">
              {t.statSecureSystem}
            </span>
            <span className="text-base sm:text-lg font-bold text-[#006a4e] mt-1 block">
              {t.statSecureVal}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
