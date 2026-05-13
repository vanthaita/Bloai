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
        (window as any).adsbygoogle.push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, []);
}
