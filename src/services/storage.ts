import { DocumentRecord, StorageStats } from '../types';
import { initialSampleDocuments } from '../utils/sampleDocuments';

const STORAGE_KEY = 'jonogoner_seba_documents_v1';

/**
 * Storage service providing hybrid support:
 * 1. Checks if server API /api/documents is reachable.
 * 2. Falls back and syncs with localStorage for zero-latency, offline resiliency.
 */
class DocumentStorageService {
  private hasInitialized = false;

  public async getAllDocuments(): Promise<DocumentRecord[]> {
    // Attempt to fetch from server first
    try {
      const response = await fetch('/api/documents', { method: 'GET' });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          // Sync with local cache
          this.saveToLocalStorage(data);
          return data;
        }
      }
    } catch {
      // Server not reachable or offline, fallback to localStorage
    }

    return this.getFromLocalStorage();
  }

  public async getDocumentById(id: string): Promise<DocumentRecord | null> {
    // Attempt server fetch
    try {
      const response = await fetch(`/api/documents/${encodeURIComponent(id)}`, { method: 'GET' });
      if (response.ok) {
        const doc = await response.json();
        return doc;
      }
    } catch {
      // Fallback
    }

    const docs = this.getFromLocalStorage();
    const found = docs.find((d) => d.id === id || d.trackingCode === id);
    return found || null;
  }

  public async saveDocument(doc: DocumentRecord): Promise<DocumentRecord> {
    // Save to local storage first for instant feedback
    const docs = this.getFromLocalStorage();
    const existingIndex = docs.findIndex((d) => d.id === doc.id);
    let updatedDocs: DocumentRecord[];
    if (existingIndex >= 0) {
      updatedDocs = [...docs];
      updatedDocs[existingIndex] = doc;
    } else {
      updatedDocs = [doc, ...docs];
    }
    this.saveToLocalStorage(updatedDocs);

    // Also send to server API if available
    try {
      await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc),
      });
    } catch {
      // Server sync will happen when online
    }

    return doc;
  }

  public async deleteDocument(id: string): Promise<boolean> {
    const docs = this.getFromLocalStorage();
    const updated = docs.filter((d) => d.id !== id);
    this.saveToLocalStorage(updated);

    try {
      await fetch(`/api/documents/${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch {
      // Ignore
    }

    return true;
  }

  public async incrementViewCount(id: string): Promise<void> {
    const docs = this.getFromLocalStorage();
    const target = docs.find((d) => d.id === id);
    if (target) {
      target.viewCount = (target.viewCount || 0) + 1;
      this.saveToLocalStorage(docs);
    }

    try {
      await fetch(`/api/documents/${encodeURIComponent(id)}/increment-view`, {
        method: 'POST',
      });
    } catch {
      // Ignore
    }
  }

  public getStats(docs: DocumentRecord[]): StorageStats {
    const totalDocs = docs.length;
    let totalViews = 0;
    let totalSizeBytes = 0;
    const now = new Date();
    const todayDateStr = now.toISOString().slice(0, 10);
    let todayUploads = 0;

    for (const doc of docs) {
      totalViews += doc.viewCount || 0;
      totalSizeBytes += doc.fileSize || 0;
      if (doc.uploadedAt && doc.uploadedAt.startsWith(todayDateStr)) {
        todayUploads++;
      }
    }

    return {
      totalDocuments: totalDocs,
      totalViews,
      totalSizeBytes,
      todayUploads,
    };
  }

  private getFromLocalStorage(): DocumentRecord[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        this.saveToLocalStorage(initialSampleDocuments);
        return initialSampleDocuments;
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      this.saveToLocalStorage(initialSampleDocuments);
      return initialSampleDocuments;
    } catch {
      return initialSampleDocuments;
    }
  }

  private saveToLocalStorage(docs: DocumentRecord[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
    } catch (e) {
      console.warn('LocalStorage limit reached or disabled:', e);
    }
  }
}

export const documentStorage = new DocumentStorageService();
