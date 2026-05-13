/**
 * Shared Cloudinary URL builder.
 *
 * Replaces `CldImage` from `next-cloudinary` across the codebase so the
 * heavy SDK (~100 kB) is never shipped to the browser. Use plain
 * `next/image` with the URL produced by this function instead.
 *
 * Rules:
 *  - Empty / null / undefined               → placeholder image URL
 *  - Full Cloudinary URL for our cloud       → transformations rewritten with correct w_
 *  - Other full URLs (http/https)            → returned as-is (Unsplash, etc.)
 *  - Cloudinary public ID (no protocol)     → optimised URL with w/h/c_fill/g_auto/q/f_auto
 */

const CLOUD_NAME = 'dq2z27agv';
const PLACEHOLDER_ID = 'default-placeholder';
const CLOUDINARY_BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/`;

export type CldQuality = 'auto:eco' | 'auto:good' | 'auto' | 'auto:best';

/**
 * Extract the version + public-ID portion from a Cloudinary upload URL.
 *
 * Input example:  "q_auto,f_webp,w_1200/v1234567890/folder/filename.jpg"
 * Output example: "v1234567890/folder/filename.jpg"
 *
 * Falls back to returning the raw string if no version segment is found
 * (e.g., a public ID without a version prefix).
 */
function extractAssetPath(afterBase: string): string {
  // Version segment: starts with 'v' followed by ≥7 digits
  const versionMatch = afterBase.match(/(v\d{7,}\/.+)$/);
  if (versionMatch?.[1]) return versionMatch[1];

  // No version — skip leading transformation segments (contain '_' Cloudinary param syntax)
  // A transformation segment looks like "q_auto,f_webp,w_1200" or "c_fill,g_auto"
  const segments = afterBase.split('/');
  const firstNonTransform = segments.findIndex(
    (s) => !s.split(',').every((p) => /^[a-zA-Z]+_/.test(p)),
  );
  return firstNonTransform !== -1
    ? segments.slice(firstNonTransform).join('/')
    : afterBase;
}

export function buildCldUrl(
  src: string | null | undefined,
  width: number,
  height: number,
  quality: CldQuality = 'auto:eco',
): string {
  if (!src) {
    return `${CLOUDINARY_BASE}w_${width},h_${height},c_fill,g_auto,q_auto,f_auto/${PLACEHOLDER_ID}`;
  }

  // Full Cloudinary URL for our own cloud — rewrite transforms for responsive delivery.
  // This fixes the Lighthouse "image too large" audit: images were stored as w_1200 URLs
  // and the loader returned them unchanged, so every breakpoint got the same 1200px asset.
  if (src.startsWith(CLOUDINARY_BASE)) {
    const afterBase = src.slice(CLOUDINARY_BASE.length);
    const assetPath = extractAssetPath(afterBase);
    const transforms =
      height > 0
        ? `w_${width},h_${height},c_fill,g_auto,q_${quality},f_auto`
        : `w_${width},q_${quality},f_auto`;
    return `${CLOUDINARY_BASE}${transforms}/${assetPath}`;
  }

  // Other full URLs (Unsplash, Discord CDN, etc.) — pass straight through
  if (src.startsWith('http')) return src;

  // Cloudinary public ID → construct optimised delivery URL
  const transforms =
    height > 0
      ? `w_${width},h_${height},c_fill,g_auto,q_${quality},f_auto`
      : `w_${width},q_${quality},f_auto`;
  return `${CLOUDINARY_BASE}${transforms}/${src}`;
}
