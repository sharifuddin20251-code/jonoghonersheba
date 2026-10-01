import React, { useState, useEffect } from 'react';
import {
  DocumentRecord,
  DocumentCategory,
  Language,
  AdminUser,
  SiteSettings,
} from '../types';
import {
  translations,
  formatBytes,
  formatDate,
  formatNumber,
  getCategoryLabel,
} from '../utils/translations';
import { documentStorage } from '../services/storage';
import { settingsService, defaultSiteSettings } from '../services/settingsService';
import {
  generateQrDataUrl,
  generateQrSvg,
  downloadQrPng,
  downloadQrSvgFile,
  getDocumentViewerUrl,
} from '../utils/qrHelper';
import {
  Lock,
  Unlock,
  ShieldCheck,
  Search,
  Trash2,
  Eye,
  EyeOff,
  QrCode,
  Download,
  FileText,
  AlertTriangle,
  X,
  FileSpreadsheet,
  Layers,
  Database,
  Calendar,
  LogOut,
  ExternalLink,
  CheckCircle2,
  Copy,
  Check,
  Settings,
  KeyRound,
  Edit,
  Save,
  RotateCcw,
  Sliders,
  Bell,
  HardDrive,
  Printer,
} from 'lucide-react';

interface AdminPortalProps {
  lang: Language;
  onOpenViewer: (docId: string) => void;
  siteSettings: SiteSettings;
  onUpdateSettings: (settings: SiteSettings) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  lang,
  onOpenViewer,
  siteSettings,
  onUpdateSettings,
}) => {
  const t = translations[lang];

  // Auth State
  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('jonogoner_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Admin Active Tab
  const [adminTab, setAdminTab] = useState<'registry' | 'settings' | 'security'>('registry');

  // Document Registry State
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);

  // Modals State
  const [previewDoc, setPreviewDoc] = useState<DocumentRecord | null>(null);
  const [editDoc, setEditDoc] = useState<DocumentRecord | null>(null);
  const [qrModalDoc, setQrModalDoc] = useState<DocumentRecord | null>(null);
  const [qrModalPng, setQrModalPng] = useState<string>('');
  const [qrModalSvg, setQrModalSvg] = useState<string>('');
  const [deleteConfirmDoc, setDeleteConfirmDoc] = useState<DocumentRecord | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Website Settings Form State
  const [formSettings, setFormSettings] = useState<SiteSettings>(siteSettings);
  const [settingsSuccessMsg, setSettingsSuccessMsg] = useState<string | null>(null);

  // Password Change Form State
  const [currentPassInput, setCurrentPassInput] = useState<string>('');
  const [newPassInput, setNewPassInput] = useState<string>('');
  const [confirmPassInput, setConfirmPassInput] = useState<string>('');
  const [showCurrentPass, setShowCurrentPass] = useState<boolean>(false);
  const [showNewPass, setShowNewPass] = useState<boolean>(false);
  const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false);
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);

  // Sync settings prop to form
  useEffect(() => {
    setFormSettings(siteSettings);
  }, [siteSettings]);

  // Load documents
  const loadDocs = async () => {
    const list = await documentStorage.getAllDocuments();
    setDocuments(list);
  };

  useEffect(() => {
    if (user) {
      loadDocs();
    }
  }, [user]);

  // Handle Login using dynamic password from settingsService
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const isUserValid = usernameInput.trim().toLowerCase() === 'admin';
    const isPassValid = settingsService.verifyAdminPassword(passwordInput);

    if (isUserValid && isPassValid) {
      const loggedUser: AdminUser = {
        username: 'admin',
        name: 'Super Administrator',
        role: 'super_admin',
        loginTime: new Date().toISOString(),
      };
      setUser(loggedUser);
      localStorage.setItem('jonogoner_admin_user', JSON.stringify(loggedUser));
    } else {
      setLoginError(t.adminInvalidCreds);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('jonogoner_admin_user');
  };

  // Handle Password Change
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(null);

    if (newPassInput !== confirmPassInput) {
      setPassError(t.adminPassMismatch);
      return;
    }

    if (newPassInput.trim().length < 6) {
      setPassError(
        lang === 'bn'
          ? 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।'
          : 'New password must be at least 6 characters.'
      );
      return;
    }

    const result = settingsService.updateAdminPassword(currentPassInput, newPassInput);
    if (result.success) {
      setPassSuccess(t.adminPassUpdatedSuccess);
      setCurrentPassInput('');
      setNewPassInput('');
      setConfirmPassInput('');
      setTimeout(() => setPassSuccess(null), 4000);
    } else {
      setPassError(result.message);
    }
  };

  // Handle Site Settings Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    settingsService.saveSettings(formSettings);
    onUpdateSettings(formSettings);
    setSettingsSuccessMsg(t.adminSettingsSaved);
    setTimeout(() => setSettingsSuccessMsg(null), 3000);
  };

  // Handle Restore Default Settings
  const handleRestoreDefaults = () => {
    if (
      window.confirm(
        lang === 'bn'
          ? 'আপনি কি নিশ্চিত যে সকল সেটিংস ডিফল্ট অবস্থায় ফিরিয়ে নিতে চান?'
          : 'Are you sure you want to restore all website settings to defaults?'
      )
    ) {
      const restored = settingsService.resetSettings();
      setFormSettings(restored);
      onUpdateSettings(restored);
      setSettingsSuccessMsg(t.adminSettingsSaved);
      setTimeout(() => setSettingsSuccessMsg(null), 3000);
    }
  };

  // Save Edited Document
  const handleSaveEditDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDoc) return;
    await documentStorage.saveDocument(editDoc);
    setEditDoc(null);
    await loadDocs();
  };

  // Delete Action
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmDoc) return;
    await documentStorage.deleteDocument(deleteConfirmDoc.id);
    setDeleteConfirmDoc(null);
    await loadDocs();
  };

  // Batch Delete
  const handleBatchDelete = async () => {
    if (selectedDocIds.length === 0) return;
    if (window.confirm(`${t.adminBatchDelete} (${selectedDocIds.length})?`)) {
      for (const id of selectedDocIds) {
        await documentStorage.deleteDocument(id);
      }
      setSelectedDocIds([]);
      await loadDocs();
    }
  };

  // Open QR modal
  const handleOpenQrModal = async (doc: DocumentRecord) => {
    const viewerUrl = getDocumentViewerUrl(doc.id);
    const png = await generateQrDataUrl(viewerUrl);
    const svg = await generateQrSvg(viewerUrl);
    setQrModalDoc(doc);
    setQrModalPng(png);
    setQrModalSvg(svg);
    setCopiedLink(false);
  };

  // Filtered documents
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.trackingCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' || doc.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const stats = documentStorage.getStats(documents);

  // Toggle selection
  const toggleSelectDoc = (id: string) => {
    setSelectedDocIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedDocIds.length === filteredDocs.length) {
      setSelectedDocIds([]);
    } else {
      setSelectedDocIds(filteredDocs.map((d) => d.id));
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = [
      'Document ID',
      'Title',
      'Filename',
      'Category',
      'File Size (Bytes)',
      'Uploaded Date',
      'Views',
      'Tracking Code',
      'Viewer URL',
    ];
    const rows = documents.map((doc) => [
      `"${doc.id}"`,
      `"${doc.title.replace(/"/g, '""')}"`,
      `"${doc.fileName}"`,
      `"${doc.category}"`,
      doc.fileSize,
      `"${doc.uploadedAt}"`,
      doc.viewCount,
      `"${doc.trackingCode}"`,
      `"${getDocumentViewerUrl(doc.id)}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `jonogoner_seba_registry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON
  const handleExportJson = () => {
    const jsonStr = JSON.stringify(documents, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jonogoner_seba_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // If NOT logged in, show secure login form (zero passwords revealed)
  if (!user) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Card Header */}
          <div className="bg-[#006a4e] text-white p-6 sm:p-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-700/60 border border-emerald-400/30 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-6 h-6 text-emerald-200" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif">
              {t.adminLoginTitle}
            </h2>
            <p className="text-xs text-emerald-100 max-w-xs mx-auto">
              {t.adminLoginSub}
            </p>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8 space-y-6">
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  {t.adminUsernameLabel}
                </label>
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="admin"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  {t.adminPasswordLabel}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-3.5 pr-10 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                    title={showPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#006a4e] hover:bg-[#00523c] text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                {t.adminLoginBtn}
              </button>
            </form>

            {/* Official Security Notice */}
            <div className="pt-4 border-t border-slate-200 text-center">
              <p className="text-[11px] text-slate-500 font-sans">
                {lang === 'bn'
                  ? 'শুধুমাত্র অনুমোদিত প্রশাসনিক কর্মকর্তাদের প্রবেশের জন্য সংরক্ষিত।'
                  : 'Restricted area. Authorized administrative personnel only.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard View (Full Control)
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#006a4e] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              {user.name}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Root Level Access
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-serif mt-1">
            {t.adminDashboardTitle}
          </h2>
          <p className="text-xs text-slate-600">
            {t.adminDashboardSub}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#006a4e]" />
            <span>{t.adminExportCsv}</span>
          </button>

          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-slate-600" />
            <span>{t.adminExportJson}</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.adminLogout}</span>
          </button>
        </div>
      </div>

      {/* Admin Module Tabs: 1. Registry, 2. Website Settings, 3. Security & Password */}
      <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl max-w-xl">
        <button
          onClick={() => setAdminTab('registry')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            adminTab === 'registry'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#006a4e]" />
          <span>{t.adminTabRegistry}</span>
        </button>

        <button
          onClick={() => setAdminTab('settings')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            adminTab === 'settings'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Settings className="w-3.5 h-3.5 text-[#006a4e]" />
          <span>{t.adminTabSettings}</span>
        </button>

        <button
          onClick={() => setAdminTab('security')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            adminTab === 'security'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5 text-[#006a4e]" />
          <span>{t.adminTabSecurity}</span>
        </button>
      </div>

      {/* TAB 1: DOCUMENT REGISTRY */}
      {adminTab === 'registry' && (
        <div className="space-y-6">
          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-200 text-[#006a4e] flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium">{t.statTotalDocs}</span>
                <div className="text-2xl font-bold text-slate-900 font-mono">
                  {formatNumber(stats.totalDocuments, lang)}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium">{t.statTotalViews}</span>
                <div className="text-2xl font-bold text-slate-900 font-mono">
                  {formatNumber(stats.totalViews, lang)}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium">{t.statStorageUsed}</span>
                <div className="text-2xl font-bold text-slate-900 font-mono">
                  {formatBytes(stats.totalSizeBytes, lang)}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium">{t.adminDateToday}</span>
                <div className="text-2xl font-bold text-slate-900 font-mono">
                  {formatNumber(stats.todayUploads, lang)}
                </div>
              </div>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.adminSearchPlaceholder}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 text-slate-700"
              >
                <option value="all">{t.adminFilterCategory}</option>
                <option value="certificate">{t.catCertificate}</option>
                <option value="general">{t.catGeneral}</option>
                <option value="notice">{t.catNotice}</option>
                <option value="application">{t.catApplication}</option>
                <option value="land">{t.catLand}</option>
                <option value="license">{t.catLicense}</option>
                <option value="utility">{t.catUtility}</option>
              </select>

              {selectedDocIds.length > 0 && (
                <button
                  onClick={handleBatchDelete}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>
                    {t.adminBatchDelete} ({formatNumber(selectedDocIds.length, lang)})
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Documents Data Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 text-xs font-semibold tracking-wider">
                    <th className="py-3 px-4 w-10">
                      <input
                        type="checkbox"
                        checked={
                          filteredDocs.length > 0 &&
                          selectedDocIds.length === filteredDocs.length
                        }
                        onChange={toggleSelectAll}
                        className="rounded border-slate-300 text-[#006a4e] focus:ring-[#006a4e]"
                      />
                    </th>
                    <th className="py-3 px-4">{t.adminTableHeaderRef}</th>
                    <th className="py-3 px-4">{t.adminTableHeaderTitle}</th>
                    <th className="py-3 px-4">{t.adminTableHeaderCat}</th>
                    <th className="py-3 px-4">{t.adminTableHeaderSize}</th>
                    <th className="py-3 px-4">{t.adminTableHeaderDate}</th>
                    <th className="py-3 px-4 text-center">{t.adminTableHeaderViews}</th>
                    <th className="py-3 px-4 text-right">{t.adminTableHeaderActions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredDocs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500">
                        {t.adminNoRecordsFound}
                      </td>
                    </tr>
                  ) : (
                    filteredDocs.map((doc) => {
                      const isSelected = selectedDocIds.includes(doc.id);
                      return (
                        <tr
                          key={doc.id}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            isSelected ? 'bg-emerald-50/40' : ''
                          }`}
                        >
                          <td className="py-3 px-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectDoc(doc.id)}
                              className="rounded border-slate-300 text-[#006a4e] focus:ring-[#006a4e]"
                            />
                          </td>

                          {/* Reference & QR Trigger */}
                          <td className="py-3 px-4 font-mono">
                            <button
                              onClick={() => handleOpenQrModal(doc)}
                              className="flex items-center gap-1.5 text-[#006a4e] hover:underline font-semibold"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              <span>{doc.id}</span>
                            </button>
                          </td>

                          {/* Title & File Name */}
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-900 max-w-xs truncate">
                              {doc.title}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono truncate max-w-xs">
                              {doc.fileName}
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                              {getCategoryLabel(doc.category, lang)}
                            </span>
                          </td>

                          {/* Size */}
                          <td className="py-3 px-4 font-mono whitespace-nowrap">
                            {formatBytes(doc.fileSize, lang)}
                          </td>

                          {/* Date */}
                          <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                            {formatDate(doc.uploadedAt, lang)}
                          </td>

                          {/* View Count */}
                          <td className="py-3 px-4 text-center font-mono font-semibold text-slate-800">
                            {formatNumber(doc.viewCount || 0, lang)}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right whitespace-nowrap space-x-1">
                            {/* Open Strict Viewer */}
                            <button
                              onClick={() => onOpenViewer(doc.id)}
                              className="p-1.5 text-slate-600 hover:text-[#006a4e] hover:bg-slate-100 rounded transition-colors cursor-pointer"
                              title={t.adminActionView}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>

                            {/* Edit Document */}
                            <button
                              onClick={() => setEditDoc(doc)}
                              className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                              title={t.adminActionEdit}
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            {/* Quick Preview Modal */}
                            <button
                              onClick={() => setPreviewDoc(doc)}
                              className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                              title={t.adminActionPreview}
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* QR Code Modal */}
                            <button
                              onClick={() => handleOpenQrModal(doc)}
                              className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                              title={t.adminActionQr}
                            >
                              <QrCode className="w-4 h-4" />
                            </button>

                            {/* Delete Single */}
                            <button
                              onClick={() => setDeleteConfirmDoc(doc)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                              title={t.adminActionDelete}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WEBSITE SETTINGS & FULL CONTROL */}
      {adminTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-serif">
                {t.adminSiteSettingsTitle}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                {t.adminSiteSettingsSub}
              </p>
            </div>

            <button
              type="button"
              onClick={handleRestoreDefaults}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.adminResetDefaults}</span>
            </button>
          </div>

          {settingsSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{settingsSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-6">
            {/* Group 1: Portal Branding & Names */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#006a4e] flex items-center gap-1.5">
                <Sliders className="w-4 h-4" />
                <span>পোর্টাল ব্র্যান্ডিং ও পরিচিতি / Portal Identity</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    {t.adminPortalTitleBn}
                  </label>
                  <input
                    type="text"
                    value={formSettings.portalNameBn}
                    onChange={(e) =>
                      setFormSettings({ ...formSettings, portalNameBn: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    {t.adminPortalTitleEn}
                  </label>
                  <input
                    type="text"
                    value={formSettings.portalNameEn}
                    onChange={(e) =>
                      setFormSettings({ ...formSettings, portalNameEn: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    {t.adminPortalTaglineBn}
                  </label>
                  <input
                    type="text"
                    value={formSettings.portalTaglineBn}
                    onChange={(e) =>
                      setFormSettings({ ...formSettings, portalTaglineBn: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    {t.adminPortalTaglineEn}
                  </label>
                  <input
                    type="text"
                    value={formSettings.portalTaglineEn}
                    onChange={(e) =>
                      setFormSettings({ ...formSettings, portalTaglineEn: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    {t.adminHelplineBn}
                  </label>
                  <input
                    type="text"
                    value={formSettings.helplineTextBn}
                    onChange={(e) =>
                      setFormSettings({ ...formSettings, helplineTextBn: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20"
                  />
                </div>
              </div>
            </div>

            {/* Group 2: Emergency Announcement Banner */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#006a4e] flex items-center gap-1.5">
                  <Bell className="w-4 h-4" />
                  <span>{t.adminNoticeBanner}</span>
                </h4>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formSettings.noticeBannerEnabled}
                    onChange={(e) =>
                      setFormSettings({
                        ...formSettings,
                        noticeBannerEnabled: e.target.checked,
                      })
                    }
                    className="rounded border-slate-300 text-[#006a4e] focus:ring-[#006a4e]"
                  />
                  <span className="text-xs font-semibold text-slate-700">
                    {t.adminEnableNotice}
                  </span>
                </label>
              </div>

              {formSettings.noticeBannerEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      {t.adminNoticeTextBn}
                    </label>
                    <input
                      type="text"
                      value={formSettings.noticeBannerTextBn}
                      onChange={(e) =>
                        setFormSettings({
                          ...formSettings,
                          noticeBannerTextBn: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      {t.adminNoticeTextEn}
                    </label>
                    <input
                      type="text"
                      value={formSettings.noticeBannerTextEn}
                      onChange={(e) =>
                        setFormSettings({
                          ...formSettings,
                          noticeBannerTextEn: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Group 3: Upload & Citizen Policies */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#006a4e] flex items-center gap-1.5">
                <HardDrive className="w-4 h-4" />
                <span>নাগরিক ব্যবহারের নীতিমালা ও আপলোড সীমা</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    {t.adminMaxFileSize}
                  </label>
                  <select
                    value={formSettings.maxFileSizeMb}
                    onChange={(e) =>
                      setFormSettings({
                        ...formSettings,
                        maxFileSizeMb: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20"
                  >
                    <option value={5}>৫ মেগাবাইট (5 MB)</option>
                    <option value={10}>১০ মেগাবাইট (10 MB - ডিফল্ট)</option>
                    <option value={15}>১৫ মেগাবাইট (15 MB)</option>
                    <option value={20}>২০ মেগাবাইট (20 MB)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="allowDownload"
                    checked={formSettings.allowCitizenDownload}
                    onChange={(e) =>
                      setFormSettings({
                        ...formSettings,
                        allowCitizenDownload: e.target.checked,
                      })
                    }
                    className="rounded border-slate-300 text-[#006a4e] focus:ring-[#006a4e]"
                  />
                  <label htmlFor="allowDownload" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    {t.adminAllowDownload}
                  </label>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="allowPrint"
                    checked={formSettings.allowCitizenPrint}
                    onChange={(e) =>
                      setFormSettings({
                        ...formSettings,
                        allowCitizenPrint: e.target.checked,
                      })
                    }
                    className="rounded border-slate-300 text-[#006a4e] focus:ring-[#006a4e]"
                  />
                  <label htmlFor="allowPrint" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    {t.adminAllowPrint}
                  </label>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{t.adminSaveSettingsBtn}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: SECURITY & PASSWORD CHANGE */}
      {adminTab === 'security' && (
        <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#006a4e] flex items-center justify-center">
                <KeyRound className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-serif">
                  {t.adminChangePassTitle}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  {t.adminChangePassSub}
                </p>
              </div>
            </div>
          </div>

          {passError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{passError}</span>
            </div>
          )}

          {passSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{passSuccess}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            {/* Current Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                {t.adminCurrentPass} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPass ? 'text' : 'password'}
                  required
                  value={currentPassInput}
                  onChange={(e) => setCurrentPassInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3.5 pr-10 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e]"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                >
                  {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                {t.adminNewPass} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  required
                  value={newPassInput}
                  onChange={(e) => setNewPassInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3.5 pr-10 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                >
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <span className="text-[11px] text-slate-500 block">
                {lang === 'bn' ? 'কমপক্ষে ৬ অক্ষরের শক্তিশালী পাসওয়ার্ড নির্বাচন করুন।' : 'Minimum 6 characters recommended.'}
              </span>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                {t.adminConfirmNewPass} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  required
                  value={confirmPassInput}
                  onChange={(e) => setConfirmPassInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3.5 pr-10 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                >
                  {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#006a4e] hover:bg-[#00523c] text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>{t.adminUpdatePassBtn}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT DOCUMENT MODAL */}
      {editDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-[#006a4e]" />
                <h3 className="font-bold text-slate-900 text-base">
                  {t.adminEditDocTitle}
                </h3>
              </div>
              <button
                onClick={() => setEditDoc(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditDoc} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  {t.docTitleLabel}
                </label>
                <input
                  type="text"
                  required
                  value={editDoc.title}
                  onChange={(e) => setEditDoc({ ...editDoc, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  {t.docCategoryLabel}
                </label>
                <select
                  value={editDoc.category}
                  onChange={(e) =>
                    setEditDoc({ ...editDoc, category: e.target.value as DocumentCategory })
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20"
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

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  {t.docNotesLabel}
                </label>
                <textarea
                  rows={2}
                  value={editDoc.notes || ''}
                  onChange={(e) => setEditDoc({ ...editDoc, notes: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="docVerified"
                  checked={editDoc.isVerified}
                  onChange={(e) =>
                    setEditDoc({ ...editDoc, isVerified: e.target.checked })
                  }
                  className="rounded border-slate-300 text-[#006a4e] focus:ring-[#006a4e]"
                />
                <label htmlFor="docVerified" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  {t.adminDocVerifiedToggle}
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditDoc(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  {t.adminCloseBtn}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#006a4e] hover:bg-[#00523c] rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  {t.adminSaveSettingsBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Inspector Modal */}
      {qrModalDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 text-center space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm">
                {t.qrGeneratedHeading}
              </h3>
              <button
                onClick={() => setQrModalDoc(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 inline-block mx-auto">
              <img
                src={qrModalPng}
                alt="Document QR"
                className="w-48 h-48 object-contain"
              />
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm truncate">
                {qrModalDoc.title}
              </h4>
              <p className="text-xs font-mono text-slate-500">
                {qrModalDoc.id}
              </p>
            </div>

            {/* Copy viewer link */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-2 rounded-lg text-xs font-mono text-slate-700">
              <span className="truncate flex-1 text-left">
                {getDocumentViewerUrl(qrModalDoc.id)}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(getDocumentViewerUrl(qrModalDoc.id));
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="p-1 text-[#006a4e] hover:bg-slate-200 rounded"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Download Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => downloadQrPng(qrModalPng, qrModalDoc.id)}
                className="flex-1 py-2 px-3 bg-[#006a4e] hover:bg-[#00523c] text-white text-xs font-semibold rounded-lg shadow-xs"
              >
                {t.downloadPngBtn}
              </button>
              <button
                onClick={() => downloadQrSvgFile(qrModalSvg, qrModalDoc.id)}
                className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xs"
              >
                {t.downloadSvgBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {t.adminPreviewModalTitle}: {previewDoc.title}
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  {previewDoc.id} · {formatBytes(previewDoc.fileSize, lang)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onOpenViewer(previewDoc.id);
                    setPreviewDoc(null);
                  }}
                  className="px-3 py-1.5 bg-[#006a4e] text-white text-xs font-semibold rounded-lg hover:bg-[#00523c]"
                >
                  {t.openViewerBtn}
                </button>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-200 p-2 overflow-hidden">
              <object
                data={`${previewDoc.dataUrl}#toolbar=0`}
                type="application/pdf"
                className="w-full h-full bg-white rounded border border-slate-300"
              >
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                  <p className="text-sm text-slate-700 font-medium mb-2">{previewDoc.title}</p>
                  <a
                    href={previewDoc.dataUrl}
                    download={previewDoc.fileName}
                    className="px-4 py-2 bg-[#006a4e] text-white text-xs font-semibold rounded-lg"
                  >
                    {t.strictViewerDownload}
                  </a>
                </div>
              </object>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      {deleteConfirmDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-slate-900 text-lg">
                {t.adminConfirmDeleteTitle}
              </h3>
              <p className="text-xs text-slate-600">
                {t.adminConfirmDeleteMsg}
              </p>
              <p className="text-xs font-mono font-semibold text-slate-800 pt-2">
                {deleteConfirmDoc.title} ({deleteConfirmDoc.id})
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={() => setDeleteConfirmDoc(null)}
                className="flex-1 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                {t.adminCloseBtn}
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                {t.adminActionDelete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
