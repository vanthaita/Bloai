import { useEffect } from 'react';

/**
 * Hook to defer loading of 3rd party scripts until after page is interactive
 * This helps improve FCP and LCP metrics
 */
export function useThirdPartyScripts() {
  useEffect(() => {
    // Load AdSense ads if available
    if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
      try {
        // Only push if there are ad slots on the page
        const adSlots = document.querySelectorAll('.adsbygoogle');
        if (adSlots.length > 0) {
          (window as any).adsbygoogle.push({});
        }
      } catch (e) {
        // Silently fail in production to avoid console errors
        if (process.env.NODE_ENV === 'development') {
          console.error('AdSense error:', e);
        }
      }
    }
  }, []);
}
