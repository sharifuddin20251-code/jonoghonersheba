import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { DocumentRecord, DocumentCategory, Language, SiteSettings } from '../types';
import { translations, formatBytes, formatDate, getCategoryLabel } from '../utils/translations';
import {
  generateQrDataUrl,
  generateQrSvg,
  downloadQrPng,
  downloadQrSvgFile,
  getDocumentViewerUrl,
} from '../utils/qrHelper';
import { documentStorage } from '../services/storage';
import { PrintSlipModal } from './PrintSlipModal';
import {
  FileUp,
  FileCheck,
  AlertCircle,
  Copy,
  Check,
  Download,
  ExternalLink,
  Printer,
  PlusCircle,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

interface UploadSectionProps {
  lang: Language;
  onOpenViewer: (docId: string) => void;
  onUploadCompleted?: (doc: DocumentRecord) => void;
  settings?: SiteSettings;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  lang,
  onOpenViewer,
  onUploadCompleted,
  settings,
}) => {
  const t = translations[lang];

  // Form State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<DocumentCategory>('certificate');
  const [notes, setNotes] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Success / QR Result State
  const [uploadedDoc, setUploadedDoc] = useState<DocumentRecord | null>(null);
  const [qrPngUrl, setQrPngUrl] = useState<string>('');
  const [qrSvgString, setQrSvgString] = useState<string>('');
  const [hasCopiedLink, setHasCopiedLink] = useState<boolean>(false);
  const [showPrintSlip, setShowPrintSlip] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxMb = settings?.maxFileSizeMb || 10;
  const MAX_FILE_SIZE = maxMb * 1024 * 1024;

  const validateAndSetFile = (file: File) => {
    setErrorMessage(null);

    // Validate mime type and extension
    const isPdf =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      setErrorMessage(t.invalidFileType);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage(t.fileSizeExceeded);
      return;
    }

    setSelectedFile(file);

    // Auto fill title if empty
    if (!title) {
      const cleanName = file.name
        .replace(/\.pdf$/i, '')
        .replace(/[_-]/g, ' ')
        .trim();
      setTitle(cleanName);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const calculateSha256 = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    try {
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      return 'hash-' + Math.random().toString(36).substring(2, 12);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage(t.supportedFormats);
      return;
    }

    if (!title.trim()) {
      setErrorMessage(t.titleRequired);
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Read file as base64 data URL and compute SHA-256
      const arrayBuffer = await selectedFile.arrayBuffer();
      const sha256 = await calculateSha256(arrayBuffer);

      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;

        // Generate ID and tracking code
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        const docId = `DOC-2026-${randomNum}`;
        const trackingCode = `JS-2026-${randomNum}`;

        const newRecord: DocumentRecord = {
          id: docId,
          title: title.trim(),
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          mimeType: 'application/pdf',
          dataUrl,
          category,
          uploadedAt: new Date().toISOString(),
          viewCount: 1,
          trackingCode,
          notes: notes.trim() || undefined,
          isVerified: true,
          sha256,
        };

        // Save to persistent storage
        await documentStorage.saveDocument(newRecord);

        // Generate QR code pointing to dedicated viewer
        const viewerUrl = getDocumentViewerUrl(docId);
        const qrPng = await generateQrDataUrl(viewerUrl);
        const qrSvg = await generateQrSvg(viewerUrl);

        setUploadedDoc(newRecord);
        setQrPngUrl(qrPng);
        setQrSvgString(qrSvg);
        setIsProcessing(false);

        if (onUploadCompleted) {
          onUploadCompleted(newRecord);
        }
      };

      reader.onerror = () => {
        setErrorMessage('Failed to read file.');
        setIsProcessing(false);
      };

      reader.readAsDataURL(selectedFile);
    } catch (err) {
      console.error('Upload processing error:', err);
      setErrorMessage('Error uploading document.');
      setIsProcessing(false);
    }
  };

  const handleCopyLink = () => {
    if (!uploadedDoc) return;
    const viewerUrl = getDocumentViewerUrl(uploadedDoc.id);
    navigator.clipboard.writeText(viewerUrl);
    setHasCopiedLink(true);
    setTimeout(() => setHasCopiedLink(false), 2500);
  };

  const handleResetUpload = () => {
    setSelectedFile(null);
    setTitle('');
    setNotes('');
    setCategory('certificate');
    setUploadedDoc(null);
    setQrPngUrl('');
    setQrSvgString('');
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* If upload completed successfully, show QR Code & Shareable Link Card */}
      {uploadedDoc && qrPngUrl ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-[#006a4e] flex items-center justify-center shadow-xs">
                <FileCheck className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
                  {t.uploadSuccessTitle}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  {t.uploadSuccessDesc}
                </p>
              </div>
            </div>

            <button
              onClick={handleResetUpload}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.newUploadBtn}</span>
            </button>
          </div>

          {/* Main QR Code & Link Presentation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* QR Code Presentation Box */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-50/80 rounded-xl border border-slate-200/80 text-center">
              <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200 inline-block mb-3">
                <img
                  src={qrPngUrl}
                  alt="Scannable QR Code"
                  className="w-48 h-48 object-contain"
                />
              </div>
              <span className="text-xs font-mono font-semibold text-slate-700">
                {uploadedDoc.trackingCode}
              </span>
              <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                {t.qrCodeSub}
              </p>

              {/* QR Download Buttons */}
              <div className="flex items-center gap-2 mt-4 w-full">
                <button
                  onClick={() => downloadQrPng(qrPngUrl, uploadedDoc.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-2xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#006a4e]" />
                  <span>PNG</span>
                </button>
                <button
                  onClick={() => downloadQrSvgFile(qrSvgString, uploadedDoc.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-2xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#006a4e]" />
                  <span>SVG</span>
                </button>
              </div>
            </div>

            {/* Document Details & Quick Actions */}
            <div className="md:col-span-7 space-y-5">
              <div>
                <div className="text-xs font-semibold text-[#006a4e] uppercase tracking-wider mb-1">
                  {getCategoryLabel(uploadedDoc.category, lang)}
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                  {uploadedDoc.title}
                </h3>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 font-mono">
                  <span>{uploadedDoc.fileName}</span>
                  <span aria-hidden="true">·</span>
                  <span>{formatBytes(uploadedDoc.fileSize, lang)}</span>
                </div>
              </div>

              {/* Shareable URL Copy Box */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  {t.copyLinkBtn}
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 truncate select-all">
                    {getDocumentViewerUrl(uploadedDoc.id)}
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-xs ${
                      hasCopiedLink
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-white hover:bg-slate-900'
                    }`}
                  >
                    {hasCopiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{t.copiedLinkMsg}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{t.copyLinkBtn}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Primary Direct Actions: Open Dedicated Viewer & Print Slip */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => onOpenViewer(uploadedDoc.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-[#006a4e] text-white text-sm font-semibold rounded-lg hover:bg-[#00523c] transition-colors shadow-xs cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{t.openViewerBtn}</span>
                </button>

                <button
                  onClick={() => setShowPrintSlip(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span>{t.printSlipBtn}</span>
                </button>
              </div>

              {/* Notice info */}
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  {t.strictViewerWarning}
                </span>
              </div>
            </div>
          </div>

          {/* Modal for Printing Official Verification Slip */}
          {showPrintSlip && (
            <PrintSlipModal
              document={uploadedDoc}
              qrDataUrl={qrPngUrl}
              lang={lang}
              onClose={() => setShowPrintSlip(false)}
            />
          )}
        </div>
      ) : (
        /* Document Upload Form */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
          {/* Section Header */}
          <div className="border-b border-slate-200 pb-5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
              {t.uploadSectionTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {t.uploadSectionDesc}
            </p>
          </div>

          {/* Error Message banner */}
          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Drag & Drop PDF Dropzone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-[#006a4e] bg-emerald-50/60'
                  : selectedFile
                  ? 'border-emerald-500 bg-emerald-50/20'
                  : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              {selectedFile ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#006a4e] flex items-center justify-center">
                    <FileCheck className="w-8 h-8 text-[#006a4e]" />
                  </div>
                  <div className="font-semibold text-slate-900 text-base">
                    {selectedFile.name}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    {formatBytes(selectedFile.size, lang)}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="mt-2 text-xs font-semibold text-[#006a4e] hover:underline"
                  >
                    {t.changeFile}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FileUp className="w-7 h-7 text-[#006a4e]" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-800">
                      {t.dragDropText}
                    </p>
                    <p className="text-xs text-slate-500">
                      {t.orBrowseText}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors"
                  >
                    {t.selectFileBtn}
                  </button>
                  <p className="text-[11px] text-slate-400">
                    {t.supportedFormats}
                  </p>
                </div>
              )}
            </div>

            {/* Metadata Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Document Title */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  {t.docTitleLabel} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t.docTitlePlaceholder}
                  required
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e] transition-all"
                />
              </div>

              {/* Department / Category */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  {t.docCategoryLabel}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e] transition-all"
                >
                  <option value="certificate">{t.catCertificate}</option>
                  <option value="general">{t.catGeneral}</option>
                  <option value="notice">{t.catNotice}</option>
                  <option value="application">{t.catApplication}</option>
                  <option value="land">{t.catLand}</option>
                  <option value="license">{t.catLicense}</option>
                  <option value="utility">{t.catUtility}</option>
                </select>
              </div>

              {/* Tracking ID (Auto Info) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  {t.docTrackingLabel}
                </label>
                <input
                  type="text"
                  disabled
                  value={t.docTrackingAuto}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono"
                />
              </div>

              {/* Notes / Reference (Optional) */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  {t.docNotesLabel}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.docNotesPlaceholder}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e] transition-all resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isProcessing || !selectedFile}
                className={`w-full flex items-center justify-center gap-2 py-3 px-6 text-sm font-semibold rounded-lg text-white shadow-xs transition-all cursor-pointer ${
                  isProcessing || !selectedFile
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-[#006a4e] hover:bg-[#00523c]'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{t.uploadingTitle}</span>
                  </>
                ) : (
                  <>
                    <FileUp className="w-4 h-4" />
                    <span>{t.uploadActionBtn}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
