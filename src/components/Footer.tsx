import React from 'react';
import { Language } from '../types';
import { translations } from '../utils/translations';
import { ShieldCheck, PhoneCall, Globe } from 'lucide-react';

interface FooterProps {
  lang: Language;
  onSelectTab: (tab: 'upload' | 'verify' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onSelectTab }) => {
  const t = translations[lang];

  return (
    <footer className="bg-white border-t border-slate-200 mt-16 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-200">
          <div className="space-y-1 max-w-md">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#006a4e] text-white flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 font-serif text-base">
                {t.portalName}
              </span>
              <span className="text-[11px] font-semibold text-[#006a4e]">
                ({t.portalSubname})
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              {t.footerGovNote}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-600">
            <button
              onClick={() => onSelectTab('upload')}
              className="hover:text-[#006a4e] transition-colors"
            >
              {t.uploadNav}
            </button>
            <button
              onClick={() => onSelectTab('verify')}
              className="hover:text-[#006a4e] transition-colors"
            >
              {t.verifyNav}
            </button>
            <button
              onClick={() => onSelectTab('admin')}
              className="hover:text-[#006a4e] transition-colors"
            >
              {t.adminNav}
            </button>
            <span className="text-slate-400">|</span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <PhoneCall className="w-3.5 h-3.5 text-[#006a4e]" />
              <span>{t.helpdesk}</span>
            </span>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            <span>{t.footerCopyright}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hover:underline cursor-pointer">
              {t.footerPrivacy}
            </span>
            <span aria-hidden="true">·</span>
            <span className="hover:underline cursor-pointer">
              {t.footerTerms}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
