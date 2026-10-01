import QRCode from 'qrcode';

export async function generateQrDataUrl(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: 600,
      margin: 2,
      color: {
        dark: '#006a4e', // Deep green government portal brand color
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    });
  } catch (err) {
    console.error('Failed to generate QR data URL', err);
    throw err;
  }
}

export async function generateQrSvg(text: string): Promise<string> {
  try {
    return await QRCode.toString(text, {
      type: 'svg',
      margin: 2,
      color: {
        dark: '#006a4e',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    });
  } catch (err) {
    console.error('Failed to generate QR SVG', err);
    throw err;
  }
}

export function downloadQrPng(dataUrl: string, fileName: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `${fileName}-qr.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadQrSvgFile(svgContent: string, fileName: string) {
  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}-qr.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getDocumentViewerUrl(docId: string): string {
  try {
    const origin = window?.location?.origin || '';
    const pathname = window?.location?.pathname || '/';
    return `${origin}${pathname}?doc=${encodeURIComponent(docId)}`;
  } catch {
    return `?doc=${encodeURIComponent(docId)}`;
  }
}
