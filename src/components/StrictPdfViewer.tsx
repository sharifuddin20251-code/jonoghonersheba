import React, { useState, useEffect, useRef } from 'react';
import { DocumentRecord, Language, SiteSettings } from '../types';
import { translations, formatDate, formatBytes, formatNumber } from '../utils/translations';
import { documentStorage } from '../services/storage';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Minimize2,
  Download,
  Printer,
  ShieldCheck,
  ArrowLeft,
  FileText,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface StrictPdfViewerProps {
  documentId: string;
  lang: Language;
  onExitViewer: () => void;
  settings?: SiteSettings;
}

export const StrictPdfViewer: React.FC<StrictPdfViewerProps> = ({
  documentId,
  lang,
  onExitViewer,
  settings,
}) => {
  const t = translations[lang];

  const [docRecord, setDocRecord] = useState<DocumentRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Viewer Controls State
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  const viewerContainerRef = useRef<HTMLDivElement>(null);

  // Load document and create blob URL
  useEffect(() => {
    let active = true;

    async function fetchDoc() {
      setIsLoading(true);
      setLoadError(null);
      try {
        const found = await documentStorage.getDocumentById(documentId);
        if (!active) return;

        if (found) {
          setDocRecord(found);
          // Increment view count asynchronously
          documentStorage.incrementViewCount(found.id);

          // Convert base64 dataUrl into an object URL for optimal memory & cross-browser rendering
          if (found.dataUrl.startsWith('data:application/pdf;base64,')) {
            const base64Data = found.dataUrl.split(',')[1];
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setBlobUrl(url);
          } else {
            setBlobUrl(found.dataUrl);
          }
        } else {
          setLoadError(t.docNotFoundTitle);
        }
      } catch (err) {
        if (active) {
          console.error(err);
          setLoadError(t.strictViewerError);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    fetchDoc();

    return () => {
      active = false;
      if (blobUrl && blobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [documentId]);

  // Handle Fullscreen safely
  const toggleFullscreen = () => {
    if (!viewerContainerRef.current) return;
    try {
      if (!window.document.fullscreenElement) {
        if (viewerContainerRef.current.requestFullscreen) {
          viewerContainerRef.current.requestFullscreen().catch(() => {});
        }
        setIsFullscreen(true);
      } else {
        if (window.document.exitFullscreen) {
          window.document.exitFullscreen().catch(() => {});
        }
        setIsFullscreen(false);
      }
    } catch {
      setIsFullscreen(!isFullscreen);
    }
  };

  // Zoom controls
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 25, 250));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 25, 50));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
    setRotation(0);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Download PDF
  const handleDownload = () => {
    if (!docRecord) return;
    const downloadTarget = blobUrl || docRecord.dataUrl;
    const link = window.document.createElement('a');
    link.href = downloadTarget;
    link.download = docRecord.fileName || `${docRecord.id}.pdf`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  // Print PDF safely
  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      ref={viewerContainerRef}
      className="fixed inset-0 z-50 flex flex-col bg-[#1e293b] text-slate-100 select-none overflow-hidden font-sans"
    >
      {/* Strict Minimal Top Utility Bar - Zero Ads, Zero Promos, Strict Verification Only */}
      <header className="h-14 sm:h-16 bg-[#0f172a] border-b border-slate-700/80 px-3 sm:px-6 flex items-center justify-between gap-3 shrink-0 shadow-md">
        {/* Left: Verification Badge & Document Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onExitViewer}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
            title={t.strictViewerExit}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t.strictViewerExit}</span>
          </button>

          <div className="h-6 w-px bg-slate-700 shrink-0 hidden sm:block" />

          {/* Verification Badge */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#006a4e] text-emerald-200 flex items-center justify-center shrink-0 ring-1 ring-emerald-500/30">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>

            <div className="min-w-0 flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                  {docRecord ? docRecord.title : t.strictViewerTitle}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-700/60 px-2 py-0.5 rounded shrink-0 hidden md:inline-block">
                  {t.strictViewerBadge}
                </span>
              </div>
              {docRecord && (
                <div className="text-[11px] text-slate-400 font-mono truncate hidden sm:block">
                  <span>{docRecord.id}</span>
                  <span className="mx-1.5" aria-hidden="true">·</span>
                  <span>{formatDate(docRecord.uploadedAt, lang)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center/Right: PDF Controls (Zoom, Rotate, Print, Download, Fullscreen) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel <= 50}
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg transition-colors cursor-pointer"
            title={t.strictViewerZoomOut}
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Zoom Level Indicator */}
          <span className="text-xs font-mono font-medium text-slate-300 px-1.5 min-w-12 text-center hidden sm:inline-block">
            {formatNumber(zoomLevel, lang)}%
          </span>

          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            disabled={zoomLevel >= 250}
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg transition-colors cursor-pointer"
            title={t.strictViewerZoomIn}
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Reset Zoom */}
          <button
            onClick={handleResetZoom}
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer hidden sm:flex"
            title={t.strictViewerResetZoom}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Rotate */}
          <button
            onClick={handleRotate}
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            title={t.strictViewerRotate}
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <div className="h-6 w-px bg-slate-700 mx-1 shrink-0" />

          {/* Print */}
          {settings?.allowCitizenPrint !== false && (
            <button
              onClick={handlePrint}
              className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              title={t.strictViewerPrint}
            >
              <Printer className="w-4 h-4" />
            </button>
          )}

          {/* Download */}
          {settings?.allowCitizenDownload !== false && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs cursor-pointer"
              title={t.strictViewerDownload}
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">{t.strictViewerDownload}</span>
            </button>
          )}

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer hidden sm:flex"
            title={t.strictViewerFullscreen}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      {/* Main Document Viewer Canvas */}
      <main className="flex-1 bg-[#334155] relative overflow-auto flex items-center justify-center p-2 sm:p-6">
        {isLoading ? (
          <div className="flex flex-col items-center space-y-3 text-slate-300">
            <div className="w-10 h-10 border-3 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
            <span className="text-sm font-medium">{t.strictViewerLoading}</span>
          </div>
        ) : loadError || !docRecord ? (
          <div className="max-w-md bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-700 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {loadError || t.docNotFoundTitle}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {t.docNotFoundDesc}
              </p>
            </div>
            <button
              onClick={onExitViewer}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              {t.strictViewerExit}
            </button>
          </div>
        ) : (
          <div
            className="transition-transform duration-150 ease-out origin-center flex flex-col items-center justify-center w-full h-full max-w-5xl"
            style={{
              transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
            }}
          >
            {/* Embedded Native & Standard PDF Viewer using <object> */}
            <div className="w-full h-full min-h-[600px] sm:min-h-[750px] bg-white rounded-lg shadow-2xl overflow-hidden border border-slate-600 flex flex-col">
              {/* Document Header Watermark Banner */}
              <div className="bg-[#006a4e] text-emerald-100 text-[11px] py-1.5 px-4 flex items-center justify-between font-mono shrink-0">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span>JONOGONER SEBA · VERIFIED CITIZEN RECORD</span>
                </div>
                <div className="text-right">
                  <span>ID: {docRecord.id}</span>
                </div>
              </div>

              {/* Native PDF Object Rendering without iframe cross-origin sandbox restrictions */}
              {blobUrl ? (
                <object
                  data={`${blobUrl}#toolbar=0&navpanes=0`}
                  type="application/pdf"
                  className="w-full flex-1 border-0 bg-white min-h-[550px] sm:min-h-[700px]"
                >
                  <div className="p-8 text-center text-slate-700 flex flex-col items-center justify-center flex-1">
                    <FileText className="w-12 h-12 text-[#006a4e] mb-3" />
                    <h4 className="font-bold text-base">{docRecord.title}</h4>
                    <p className="text-xs text-slate-500 mb-4">{formatBytes(docRecord.fileSize, lang)}</p>
                    <button
                      onClick={handleDownload}
                      className="px-4 py-2 bg-[#006a4e] text-white text-xs font-semibold rounded-lg hover:bg-[#00523c]"
                    >
                      {t.strictViewerDownload}
                    </button>
                  </div>
                </object>
              ) : (
                <div className="p-8 text-center text-slate-700 flex flex-col items-center justify-center flex-1">
                  <FileText className="w-12 h-12 text-[#006a4e] mb-3" />
                  <h4 className="font-bold text-base">{docRecord.title}</h4>
                  <p className="text-xs text-slate-500 mb-4">{formatBytes(docRecord.fileSize, lang)}</p>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-[#006a4e] text-white text-xs font-semibold rounded-lg hover:bg-[#00523c]"
                  >
                    {t.strictViewerDownload}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Discrete Bottom Verification Guarantee Bar */}
      <footer className="h-8 bg-[#0f172a] border-t border-slate-800 px-4 flex items-center justify-between text-[11px] text-slate-400 font-mono shrink-0">
        <div>
          <span>{t.strictViewerWarning}</span>
        </div>
        <div className="hidden sm:block">
          <span>{t.portalName} · {t.portalSubname}</span>
        </div>
      </footer>
    </div>
  );
};
