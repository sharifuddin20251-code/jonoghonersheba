import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory document storage with initial seeding
interface StoredDocument {
  id: string;
  title: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  dataUrl: string;
  category: string;
  uploadedAt: string;
  viewCount: number;
  trackingCode: string;
  notes?: string;
  isVerified: boolean;
  sha256?: string;
}

// In-memory document map for ultra-fast, cross-device access
const documentsStore = new Map<string, StoredDocument>();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Body parser with 25MB limit for PDF base64 payloads
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // API Endpoints
  // 1. Get all documents
  app.get('/api/documents', (req, res) => {
    const list = Array.from(documentsStore.values()).sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
    res.json(list);
  });

  // 2. Get single document by ID or tracking code
  app.get('/api/documents/:id', (req, res) => {
    const { id } = req.params;
    const doc = documentsStore.get(id) || Array.from(documentsStore.values()).find(
      (d) => d.trackingCode === id
    );

    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json(doc);
  });

  // 3. Save / Upload Document
  app.post('/api/documents', (req, res) => {
    const doc: StoredDocument = req.body;
    if (!doc || !doc.id || !doc.title || !doc.dataUrl) {
      return res.status(400).json({ error: 'Invalid document payload' });
    }

    documentsStore.set(doc.id, doc);
    res.status(201).json(doc);
  });

  // 4. Delete document
  app.delete('/api/documents/:id', (req, res) => {
    const { id } = req.params;
    const existed = documentsStore.delete(id);
    res.json({ success: existed });
  });

  // 5. Increment view count
  app.post('/api/documents/:id/increment-view', (req, res) => {
    const { id } = req.params;
    const doc = documentsStore.get(id);
    if (doc) {
      doc.viewCount = (doc.viewCount || 0) + 1;
      documentsStore.set(id, doc);
      return res.json({ success: true, viewCount: doc.viewCount });
    }
    res.status(404).json({ error: 'Document not found' });
  });

  // 6. Direct RAW PDF download endpoint
  app.get('/api/documents/:id/raw', (req, res) => {
    const { id } = req.params;
    const doc = documentsStore.get(id);
    if (!doc || !doc.dataUrl) {
      return res.status(404).send('Document not found');
    }

    if (doc.dataUrl.startsWith('data:application/pdf;base64,')) {
      const base64Data = doc.dataUrl.replace(/^data:application\/pdf;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${doc.fileName || 'document.pdf'}"`);
      return res.send(buffer);
    }

    res.redirect(doc.dataUrl);
  });

  // Settings & Password endpoints
  let currentAdminPassword = 'admin123';
  let currentSiteSettings: Record<string, any> = {};

  app.post('/api/settings/password', (req, res) => {
    const { password } = req.body;
    if (password && typeof password === 'string' && password.trim().length >= 6) {
      currentAdminPassword = password.trim();
      return res.json({ success: true });
    }
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  });

  app.get('/api/settings/password-check', (req, res) => {
    const { password } = req.query;
    res.json({ valid: password === currentAdminPassword });
  });

  app.get('/api/settings', (req, res) => {
    res.json(currentSiteSettings);
  });

  app.post('/api/settings', (req, res) => {
    currentSiteSettings = { ...currentSiteSettings, ...req.body };
    res.json({ success: true, settings: currentSiteSettings });
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', documentsCount: documentsStore.size });
  });

  // Environment Mode (Development with Vite middlewares vs Production static)
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Jonogoner Seba server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
