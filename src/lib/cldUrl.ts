/**
 * Shared Cloudinary URL builder.
 *
 * Replaces `CldImage` from `next-cloudinary` across the codebase so the
 * heavy SDK (~100 kB) is never shipped to the browser. Use plain
 * `next/image` with the URL produced by this function instead.
 *
 * Rules:
 *  - Already-full URLs (http/https) → returned as-is (Unsplash, etc.)
 *  - Empty / null / undefined          → placeholder image URL
 *  - Cloudinary public ID              → optimised URL with w/h/c_fill/g_auto/q/f_auto
 */

const CLOUD_NAME = 'dq2z27agv';
const PLACEHOLDER_ID = 'default-placeholder';

export type CldQuality = 'auto:eco' | 'auto:good' | 'auto' | 'auto:best';

export function buildCldUrl(
  src: string | null | undefined,
  width: number,
  height: number,
  quality: CldQuality = 'auto:eco',
): string {
  if (!src) {
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${width},h_${height},c_fill,g_auto,q_auto,f_auto/${PLACEHOLDER_ID}`;
  }

  // Already a full URL (Unsplash, Discord CDN, etc.) — pass straight through
  if (src.startsWith('http')) return src;

  // Cloudinary public ID → construct optimised delivery URL
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${width},h_${height},c_fill,g_auto,q_${quality},f_auto/${src}`;
}
