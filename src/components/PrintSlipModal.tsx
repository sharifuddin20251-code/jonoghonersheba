import React, { useRef } from 'react';
import { DocumentRecord, Language } from '../types';
import { translations, formatDate, formatBytes, getCategoryLabel } from '../utils/translations';
import { Printer, X, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface PrintSlipModalProps {
  document: DocumentRecord;
  qrDataUrl: string;
  lang: Language;
  onClose: () => void;
}

export const PrintSlipModal: React.FC<PrintSlipModalProps> = ({
  document: doc,
  qrDataUrl,
  lang,
  onClose,
}) => {
  const t = translations[lang];
  const printAreaRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden my-8">
        {/* Modal Top Bar (Non-printed) */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-[#006a4e]" />
            <h3 className="font-semibold text-slate-800 text-base">
              {t.printSlipTitle}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#006a4e] text-white text-xs font-semibold rounded-lg hover:bg-[#00523c] transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>{t.printSlipPrintBtn}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Verification Slip Area */}
        <div ref={printAreaRef} className="p-8 bg-white font-sans text-slate-800">
          {/* Slip Header */}
          <div className="border-b-2 border-[#006a4e] pb-4 mb-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-full bg-[#006a4e] text-white flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
                {t.portalName}
              </h2>
            </div>
            <p className="text-xs uppercase tracking-widest text-[#006a4e] font-semibold">
              {t.portalTagline}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {t.printSlipTitle} · {t.printSlipSub}
            </p>
          </div>

          {/* Verification Badge & QR Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-lg bg-slate-50 border border-slate-200 mb-6">
            <div className="shrink-0 text-center">
              <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs inline-block">
                <img
                  src={qrDataUrl}
                  alt="Document QR Code"
                  className="w-36 h-36 object-contain"
                />
              </div>
              <div className="mt-1 text-[10px] font-mono text-slate-500">
                {doc.trackingCode}
              </div>
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t.verifiedBadge}</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 leading-snug">
                {doc.title}
              </h4>
              <p className="text-xs text-slate-600">
                {getCategoryLabel(doc.category, lang)}
              </p>
              <div className="text-xs text-slate-500 font-mono space-y-0.5">
                <div>
                  <span className="font-semibold text-slate-700">{t.docRefId}:</span> {doc.id}
                </div>
                <div>
                  <span className="font-semibold text-slate-700">{t.docUploadDate}:</span>{' '}
                  {formatDate(doc.uploadedAt, lang)}
                </div>
                <div>
                  <span className="font-semibold text-slate-700">{t.docSize}:</span>{' '}
                  {formatBytes(doc.fileSize, lang)}
                </div>
              </div>
            </div>
          </div>

          {/* Verification Instruction Box */}
          <div className="p-4 rounded-lg border border-dashed border-slate-300 text-xs text-slate-600 bg-slate-50/50 mb-6">
            <div className="font-semibold text-slate-800 mb-1">
              যাচাইকরণ নির্দেশিকা / Verification Instruction:
            </div>
            <p className="leading-relaxed">
              {t.printSlipInstruction}
            </p>
            {doc.sha256 && (
              <div className="mt-2 text-[10px] text-slate-400 font-mono break-all">
                SHA-256 Fingerprint: {doc.sha256}
              </div>
            )}
          </div>

          {/* Slip Footer Seal */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-[11px] text-slate-500">
            <div>
              <span>ইস্যুকারী কর্তৃপক্ষ: {t.printSlipIssuedTo}</span>
            </div>
            <div className="text-right">
              <span className="font-serif italic text-[#006a4e] font-semibold">
                জনগণের সেবা · সত্যতা নিশ্চায়ন
              </span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Close */}
        <div className="no-print px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            {t.adminCloseBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
