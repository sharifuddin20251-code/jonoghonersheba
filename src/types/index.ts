export type Language = 'bn' | 'en';

export type DocumentCategory =
  | 'general'
  | 'certificate'
  | 'notice'
  | 'application'
  | 'land'
  | 'license'
  | 'utility';

export interface DocumentRecord {
  id: string; // e.g., 'DOC-2026-89421'
  title: string;
  fileName: string;
  fileSize: number; // in bytes
  mimeType: string;
  dataUrl: string; // base64 data URL
  category: DocumentCategory;
  uploadedAt: string; // ISO string
  viewCount: number;
  trackingCode: string;
  notes?: string;
  isVerified: boolean;
  sha256?: string;
}

export interface AdminUser {
  username: string;
  name: string;
  role: 'super_admin' | 'officer';
  loginTime: string;
}

export interface StorageStats {
  totalDocuments: number;
  totalViews: number;
  totalSizeBytes: number;
  todayUploads: number;
}

export interface SiteSettings {
  portalNameBn: string;
  portalNameEn: string;
  portalTaglineBn: string;
  portalTaglineEn: string;
  helplineTextBn: string;
  helplineTextEn: string;
  noticeBannerEnabled: boolean;
  noticeBannerTextBn: string;
  noticeBannerTextEn: string;
  maxFileSizeMb: number;
  allowCitizenDownload: boolean;
  allowCitizenPrint: boolean;
  allowPublicUpload: boolean;
}

