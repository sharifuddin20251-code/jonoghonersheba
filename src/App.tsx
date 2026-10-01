import React, { useState, useEffect } from 'react';
import { Language, DocumentRecord, StorageStats, SiteSettings } from './types';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { UploadSection } from './components/UploadSection';
import { VerifySection } from './components/VerifySection';
import { AdminPortal } from './components/AdminPortal';
import { StrictPdfViewer } from './components/StrictPdfViewer';
import { Footer } from './components/Footer';
import { documentStorage } from './services/storage';
import { settingsService } from './services/settingsService';

export default function App() {
  // Language State (Bengali default)
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('jonogoner_lang');
      return saved === 'en' ? 'en' : 'bn';
    } catch {
      return 'bn';
    }
  });

  // Website Settings State with real-time sync
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() =>
    settingsService.getSettings()
  );

  // Navigation Tab State: 'upload' | 'verify' | 'admin'
  const [currentTab, setCurrentTab] = useState<'upload' | 'verify' | 'admin'>('upload');

  // Dedicated Strict PDF Viewer State
  const [viewingDocId, setViewingDocId] = useState<string | null>(null);

  // Storage Stats State
  const [stats, setStats] = useState<StorageStats>({
    totalDocuments: 3,
    totalViews: 129,
    totalSizeBytes: 182570,
    todayUploads: 1,
  });

  // Listen for site settings changes
  useEffect(() => {
    const handleSettingsChanged = () => {
      setSiteSettings(settingsService.getSettings());
    };
    window.addEventListener('site-settings-changed', handleSettingsChanged);
    return () => {
      window.removeEventListener('site-settings-changed', handleSettingsChanged);
    };
  }, []);

  // Toggle Language
  const handleToggleLang = () => {
    const nextLang: Language = lang === 'bn' ? 'en' : 'bn';
    setLang(nextLang);
    try {
      localStorage.setItem('jonogoner_lang', nextLang);
      document.documentElement.lang = nextLang;
    } catch {
      // Ignore
    }
  };

  // Sync with URL query parameters (e.g. ?doc=DOC-2026-91823 or ?tab=admin)
  useEffect(() => {
    const checkUrlState = () => {
      try {
        const search = window?.location?.search || '';
        const params = new URLSearchParams(search);
        const docParam = params.get('doc');
        const tabParam = params.get('tab');

        if (docParam) {
          setViewingDocId(docParam);
        } else {
          setViewingDocId(null);
        }

        if (tabParam === 'verify' || tabParam === 'admin' || tabParam === 'upload') {
          setCurrentTab(tabParam);
        }
      } catch {
        // Fallback for restricted frame contexts
      }
    };

    checkUrlState();
    window.addEventListener('popstate', checkUrlState);

    // Initial stats load
    loadStats();

    return () => {
      window.removeEventListener('popstate', checkUrlState);
    };
  }, []);

  const loadStats = async () => {
    try {
      const docs = await documentStorage.getAllDocuments();
      const calculated = documentStorage.getStats(docs);
      setStats(calculated);
    } catch (e) {
      console.warn('Could not load stats', e);
    }
  };

  // Open Document in Strict Viewer
  const handleOpenViewer = (docId: string) => {
    setViewingDocId(docId);
    try {
      const url = new URL(window?.location?.href || window?.location?.pathname || '/');
      url.searchParams.set('doc', docId);
      url.searchParams.delete('tab');
      window.history.pushState({}, '', url.toString());
    } catch {
      // In restricted iframe environments, pushState might be restricted
    }
  };

  // Exit Strict Viewer back to main portal
  const handleExitViewer = () => {
    setViewingDocId(null);
    try {
      const url = new URL(window?.location?.href || window?.location?.pathname || '/');
      url.searchParams.delete('doc');
      window.history.pushState({}, '', url.toString());
    } catch {}
    loadStats();
  };

  // Select Tab
  const handleSelectTab = (tab: 'upload' | 'verify' | 'admin') => {
    setCurrentTab(tab);
    setViewingDocId(null);
    try {
      const url = new URL(window?.location?.href || window?.location?.pathname || '/');
      url.searchParams.delete('doc');
      if (tab === 'upload') {
        url.searchParams.delete('tab');
      } else {
        url.searchParams.set('tab', tab);
      }
      window.history.pushState({}, '', url.toString());
    } catch {}
  };

  // IF in Dedicated Strict PDF Viewer Mode:
  if (viewingDocId) {
    return (
      <StrictPdfViewer
        documentId={viewingDocId}
        lang={lang}
        onExitViewer={handleExitViewer}
        settings={siteSettings}
      />
    );
  }

  // Regular Portal Interface
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-slate-800 font-sans selection:bg-[#006a4e]/20 selection:text-[#006a4e]">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        lang={lang}
        onToggleLang={handleToggleLang}
        settings={siteSettings}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section shown on public tabs */}
        {currentTab !== 'admin' && (
          <HeroSection
            lang={lang}
            stats={stats}
            onSelectTab={handleSelectTab}
          />
        )}

        {/* Tab View Selection */}
        {currentTab === 'upload' && (
          <UploadSection
            lang={lang}
            onOpenViewer={handleOpenViewer}
            onUploadCompleted={() => loadStats()}
            settings={siteSettings}
          />
        )}

        {currentTab === 'verify' && (
          <VerifySection
            lang={lang}
            onOpenViewer={handleOpenViewer}
          />
        )}

        {currentTab === 'admin' && (
          <AdminPortal
            lang={lang}
            onOpenViewer={handleOpenViewer}
            siteSettings={siteSettings}
            onUpdateSettings={(newSettings) => setSiteSettings(newSettings)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        onSelectTab={handleSelectTab}
      />
    </div>
  );
}
