/**
 * Format date consistently for server and client to avoid hydration mismatches.
 * Uses manual formatting instead of toLocaleDateString to ensure consistency.
 */
export function formatDate(date: Date | string, format: 'full' | 'short' = 'full'): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const d = new Date(date);
  const month = months[d.getMonth()];
  const day = d.getDate();
  const year = d.getFullYear();
  
  return format === 'full' ? `${month} ${day}, ${year}` : `${month} ${day}`;
}

/**
 * Format date in Vietnamese format consistently
 */
export function formatDateVi(date: Date | string): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}/${month}/${year}`;
}
