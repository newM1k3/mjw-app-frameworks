// imageCompression.ts
// MJW Design — Shared Library
//
// Client-side image compression using the Canvas API.
// Resizes and re-encodes images before upload to reduce bandwidth and
// storage costs. No server or third-party library required — pure browser API.
//
// Source: Harvested from mjw-time-travel-station (March 2026)
//
// Dependencies: none (uses built-in browser Canvas API)
//
// Usage:
//   import { compressImage, formatFileSize } from '../_shared/lib/imageCompression';
//
//   const result = await compressImage(file, {
//     maxWidth: 1920,
//     maxHeight: 1920,
//     quality: 0.85,
//   });
//   console.log(`Compressed ${formatFileSize(result.originalSize)} → ${formatFileSize(result.compressedSize)}`);
//   // result.dataUrl  — base64 data URL ready for display or upload
//   // result.blob     — Blob ready for FormData / fetch upload
//
// Notes:
//   - Aspect ratio is always preserved.
//   - If the image is already smaller than maxWidth × maxHeight, no resize occurs
//     but re-encoding still applies the quality setting.
//   - Default settings (1920×1920, 85% JPEG) are suitable for AI image generation
//     reference uploads. Adjust for thumbnails or avatars as needed.
// ─────────────────────────────────────────────────────────────────────────────

export interface CompressionOptions {
  /** Maximum output width in pixels (default: 1920) */
  maxWidth?: number;
  /** Maximum output height in pixels (default: 1920) */
  maxHeight?: number;
  /** JPEG/WebP quality 0–1 (default: 0.85) */
  quality?: number;
  /** Output MIME type (default: 'image/jpeg') */
  mimeType?: string;
}

export interface CompressionResult {
  /** Base64 data URL of the compressed image */
  dataUrl: string;
  /** Blob of the compressed image (use for fetch/FormData uploads) */
  blob: Blob;
  /** Original file size in bytes */
  originalSize: number;
  /** Compressed file size in bytes */
  compressedSize: number;
  /** Percentage reduction in file size (0–100) */
  compressionRatio: number;
}

/**
 * Compress an image File using the Canvas API.
 * Resizes to fit within maxWidth × maxHeight while preserving aspect ratio,
 * then re-encodes at the specified quality.
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.85,
    mimeType = 'image/jpeg',
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions while preserving aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          if (width > height) {
            width = maxWidth;
            height = Math.round(width / aspectRatio);
          } else {
            height = maxHeight;
            width = Math.round(height * aspectRatio);
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('[imageCompression] Failed to get canvas context'));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('[imageCompression] Failed to create blob'));
              return;
            }
            const dataUrl = canvas.toDataURL(mimeType, quality);
            const originalSize = file.size;
            const compressedSize = blob.size;
            const compressionRatio =
              ((originalSize - compressedSize) / originalSize) * 100;

            resolve({ dataUrl, blob, originalSize, compressedSize, compressionRatio });
          },
          mimeType,
          quality
        );
      };

      img.onerror = () => reject(new Error('[imageCompression] Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('[imageCompression] Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Format a byte count as a human-readable string.
 * @example formatFileSize(1536000) // → "1.46 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
