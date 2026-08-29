export function escapeWifiValue(value: string): string {
  return value.replace(/([\\;,:\"])/g, '\\$1');
}

export const MAX_IMAGE_FILE_BYTES = 50 * 1024 * 1024;
export const MAX_IMAGE_PIXELS = 40_000_000;
export const MAX_PDF_FILE_BYTES = 100 * 1024 * 1024;
export const MAX_PDF_PAGES = 500;

export function validateImageFile(file: File): string | null {
  if (!file.type.startsWith('image/')) return 'Please select a valid image file.';
  if (file.size > MAX_IMAGE_FILE_BYTES) return 'Image files must be 50 MB or smaller.';
  return null;
}

export function validateImageDimensions(width: number, height: number): string | null {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return 'The image dimensions could not be read.';
  }
  if (width * height > MAX_IMAGE_PIXELS) return 'Images larger than 40 megapixels are not supported.';
  return null;
}

export function validatePdfFile(file: File): string | null {
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    return 'Please select a valid PDF file.';
  }
  if (file.size > MAX_PDF_FILE_BYTES) return 'PDF files must be 100 MB or smaller.';
  return null;
}

export function validatePdfPageCount(pageCount: number): string | null {
  return pageCount > MAX_PDF_PAGES ? `PDFs with more than ${MAX_PDF_PAGES} pages are not supported.` : null;
}

export function parsePageNumbers(value: string, max: number): number[] {
  const pages = new Set<number>();

  for (const part of value.split(',').map((item) => item.trim())) {
    if (!part) continue;
    const rangeParts = part.split('-').map((item) => item.trim());
    const range = rangeParts.map((item) => /^\d+$/.test(item) ? Number(item) : Number.NaN);
    if (range.length === 2 && range.every(Number.isInteger) && range[0] <= range[1]) {
      for (let page = range[0]; page <= range[1]; page += 1) {
        if (page >= 1 && page <= max) pages.add(page - 1);
      }
    } else if (range.length === 1 && Number.isInteger(range[0]) && range[0] >= 1 && range[0] <= max) {
      pages.add(range[0] - 1);
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

export function generateUuid(): string {
  if (typeof crypto === 'undefined') {
    throw new Error('Secure UUID generation is not supported in this browser.');
  }
  if (crypto.randomUUID) return crypto.randomUUID();
  if (!crypto.getRandomValues) {
    throw new Error('Secure UUID generation is not supported in this browser.');
  }

  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}