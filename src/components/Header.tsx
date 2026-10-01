import React from 'react';
import { Language, SiteSettings } from '../types';
import { translations } from '../utils/translations';
import { ShieldCheck, FileUp, Search, Lock, Globe, PhoneCall } from 'lucide-react';

interface HeaderProps {
  currentTab: 'upload' | 'verify' | 'admin';
  onSelectTab: (tab: 'upload' | 'verify' | 'admin') => void;
  lang: Language;
  onToggleLang: () => void;
  settings?: SiteSettings;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  lang,
  onToggleLang,
  settings,
}) => {
  const t = translations[lang];

  const portalTitle =
    lang === 'bn'
      ? settings?.portalNameBn || t.portalName
      : settings?.portalNameEn || t.portalName;

  const portalTagline =
    lang === 'bn'
      ? settings?.portalTaglineBn || t.portalTagline
      : settings?.portalTaglineEn || t.portalTagline;

  const helplineText =
    lang === 'bn'
      ? settings?.helplineTextBn || t.helpdesk
      : settings?.helplineTextEn || t.helpdesk;

  const noticeText =
    lang === 'bn'
      ? settings?.noticeBannerTextBn || t.portalMission
      : settings?.noticeBannerTextEn || t.portalMission;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top micro announcement / helpline bar */}
      {settings?.noticeBannerEnabled !== false && (
        <div className="bg-[#006a4e] text-emerald-50 text-xs py-1.5 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium tracking-wide truncate">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-300 animate-pulse shrink-0" />
              <span className="truncate">{noticeText}</span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-emerald-100 text-xs shrink-0">
              <span className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-300" />
                <span>{helplineText}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="bg-emerald-900/60 text-emerald-200 px-2 py-0.5 rounded text-[11px] font-mono">
                {t.officialSeal}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Top Bar Contract: Zone 1 (Brand) - Zone 2 (Nav) - Zone 3 (Actions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Single Brand Lockup Wordmark */}
        <div
          onClick={() => onSelectTab('upload')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          {/* Civic Rosette Icon without state logo */}
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#006a4e] to-[#004d38] text-white flex items-center justify-center shadow-sm ring-1 ring-[#006a4e]/20 group-hover:scale-102 transition-transform">
            <ShieldCheck className="w-6 h-6 text-emerald-200" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-serif">
                {portalTitle}
              </span>
              <span className="text-xs font-semibold text-[#006a4e] uppercase tracking-wider hidden md:inline-block">
                · {t.portalSubname}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium hidden sm:inline-block truncate max-w-xs md:max-w-md">
              {portalTagline}
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Text with hover/active underline) */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onSelectTab('upload')}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              currentTab === 'upload'
                ? 'bg-slate-100 text-[#006a4e] font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <FileUp className="w-4 h-4 text-[#006a4e]" />
            <span>{t.uploadNav}</span>
          </button>

          <button
            onClick={() => onSelectTab('verify')}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              currentTab === 'verify'
                ? 'bg-slate-100 text-[#006a4e] font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span>{t.verifyNav}</span>
          </button>

          <button
            onClick={() => onSelectTab('admin')}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              currentTab === 'admin'
                ? 'bg-slate-100 text-[#006a4e] font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Lock className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">{t.adminNav}</span>
            <span className="sm:hidden">অ্যাডমিন</span>
          </button>
        </nav>

        {/* Zone 3: Language Switcher Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleLang}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 hover:border-slate-400 bg-white text-slate-800 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer whitespace-nowrap"
            title="Toggle Language / ভাষা পরিবর্তন করুন"
          >
            <Globe className="w-3.5 h-3.5 text-[#006a4e]" />
            <div className="flex items-center gap-1">
              <span className={lang === 'bn' ? 'text-[#006a4e] font-bold' : 'text-slate-500'}>
                বাং
              </span>
              <span className="text-slate-300">/</span>
              <span className={lang === 'en' ? 'text-[#006a4e] font-bold' : 'text-slate-500'}>
                ENG
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
