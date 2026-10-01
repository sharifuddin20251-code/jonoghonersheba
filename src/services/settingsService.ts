import { SiteSettings } from '../types';

const SETTINGS_KEY = 'jonogoner_site_settings_v1';
const PASS_KEY = 'jonogoner_admin_pass_v1';
const DEFAULT_PASS = 'admin123';

export const defaultSiteSettings: SiteSettings = {
  portalNameBn: 'জনগণের সেবা',
  portalNameEn: 'Jonogoner Seba',
  portalTaglineBn: 'নিরাপদ ডিজিটাল নাগরিক নথি ও কিউআর যাচাইকরণ পোর্টাল',
  portalTaglineEn: 'Secure Digital Citizen Document & QR Verification Portal',
  helplineTextBn: 'সহায়তা হটলাইন: ৩৩৩ / ১৬১২৩',
  helplineTextEn: 'Helpline: 333 / 16123',
  noticeBannerEnabled: true,
  noticeBannerTextBn: 'গণপ্রজাতন্ত্রী নাগরিক সেবা ও প্রাতিষ্ঠানিক নথি যাচাইয়ের নির্ভরযোগ্য প্ল্যাটফর্ম',
  noticeBannerTextEn: 'Trustworthy civic platform for official document hosting and instant QR verification',
  maxFileSizeMb: 10,
  allowCitizenDownload: true,
  allowCitizenPrint: true,
  allowPublicUpload: true,
};

class SettingsService {
  // Password Management
  public getAdminPassword(): string {
    try {
      const saved = localStorage.getItem(PASS_KEY);
      return saved && saved.trim() ? saved : DEFAULT_PASS;
    } catch {
      return DEFAULT_PASS;
    }
  }

  public verifyAdminPassword(input: string): boolean {
    const current = this.getAdminPassword();
    return input === current;
  }

  public updateAdminPassword(currentPass: string, newPass: string): { success: boolean; message: string } {
    if (!this.verifyAdminPassword(currentPass)) {
      return { success: false, message: 'বর্তমান পাসওয়ার্ডটি সঠিক নয়!' };
    }

    if (!newPass || newPass.trim().length < 6) {
      return { success: false, message: 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' };
    }

    try {
      localStorage.setItem(PASS_KEY, newPass.trim());
      // Also notify backend if available
      fetch('/api/settings/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPass.trim() }),
      }).catch(() => {});
      return { success: true, message: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।' };
    } catch (e) {
      return { success: false, message: 'পাসওয়ার্ড সংরক্ষণ করা সম্ভব হয়নি।' };
    }
  }

  // Site Settings Management
  public getSettings(): SiteSettings {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        return { ...defaultSiteSettings, ...JSON.parse(raw) };
      }
    } catch {
      // Fallback
    }
    return defaultSiteSettings;
  }

  public saveSettings(settings: SiteSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      // Dispatch custom event so all components react immediately without reload
      window.dispatchEvent(new Event('site-settings-changed'));

      fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      }).catch(() => {});
    } catch (e) {
      console.warn('Could not save settings', e);
    }
  }

  public resetSettings(): SiteSettings {
    this.saveSettings(defaultSiteSettings);
    return defaultSiteSettings;
  }
}

export const settingsService = new SettingsService();
