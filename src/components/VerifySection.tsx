import React, { useState } from 'react';
import { DocumentRecord, Language } from '../types';
import { translations, formatDate, formatBytes, getCategoryLabel } from '../utils/translations';
import { documentStorage } from '../services/storage';
import {
  Search,
  CheckCircle2,
  FileText,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  Calendar,
  HardDrive,
} from 'lucide-react';

interface VerifySectionProps {
  lang: Language;
  onOpenViewer: (docId: string) => void;
}

export const VerifySection: React.FC<VerifySectionProps> = ({
  lang,
  onOpenViewer,
}) => {
  const t = translations[lang];

  const [query, setQuery] = useState<string>('');
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [foundDoc, setFoundDoc] = useState<DocumentRecord | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim();
    if (!clean) return;

    setIsSearching(true);
    setHasSearched(true);

    try {
      const doc = await documentStorage.getDocumentById(clean);
      setFoundDoc(doc);
    } catch (err) {
      console.error(err);
      setFoundDoc(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuickLookup = async (id: string) => {
    setQuery(id);
    setIsSearching(true);
    setHasSearched(true);
    const doc = await documentStorage.getDocumentById(id);
    setFoundDoc(doc);
    setIsSearching(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#006a4e] text-xs font-semibold border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{t.portalMission}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
          {t.verifySectionTitle}
        </h2>
        <p className="text-sm text-slate-600">
          {t.verifySectionDesc}
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.verifyInputPlaceholder}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e] transition-all font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#006a4e] hover:bg-[#00523c] text-white text-sm font-semibold rounded-xl transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isSearching ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>{t.verifySearchBtn}</span>
          </button>
        </form>

        {/* Quick Sample IDs Clickable Helper */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-medium text-slate-700">দ্রুত পরীক্ষা / Quick Demo IDs:</span>
          {['DOC-2026-91823', 'DOC-2026-74512', 'DOC-2026-63209'].map((demoId) => (
            <button
              key={demoId}
              type="button"
              onClick={() => handleQuickLookup(demoId)}
              className="font-mono text-[#006a4e] hover:underline bg-emerald-50/70 border border-emerald-200/60 px-2 py-0.5 rounded cursor-pointer"
            >
              {demoId}
            </button>
          ))}
        </div>
      </div>

      {/* Result Display */}
      {hasSearched && (
        <div>
          {foundDoc ? (
            <div className="bg-white rounded-2xl border-2 border-emerald-500/60 shadow-lg p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#006a4e] flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7 text-[#006a4e]" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{t.docFoundTitle}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">
                      {foundDoc.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => onOpenViewer(foundDoc.id)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#006a4e] hover:bg-[#00523c] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{t.openViewerBtn}</span>
                </button>
              </div>

              {/* Metadata Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block mb-1">{t.docRefId}</span>
                  <span className="font-bold text-slate-800 font-mono text-sm">
                    {foundDoc.id}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block mb-1">{t.docCategoryLabel}</span>
                  <span className="font-semibold text-slate-800">
                    {getCategoryLabel(foundDoc.category, lang)}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block mb-1">{t.docUploadDate}</span>
                  <span className="font-semibold text-slate-800">
                    {formatDate(foundDoc.uploadedAt, lang)}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block mb-1">{t.docSize}</span>
                  <span className="font-semibold text-slate-800 font-mono">
                    {formatBytes(foundDoc.fileSize, lang)}
                  </span>
                </div>
              </div>

              {foundDoc.notes && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                  <span className="font-semibold text-slate-900 block mb-1">
                    {t.docNotesLabel}:
                  </span>
                  <p>{foundDoc.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-red-200 shadow-md p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {t.docNotFoundTitle}
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                {t.docNotFoundDesc}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
