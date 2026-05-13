import { useEffect } from 'react';

interface WebVitalsMetrics {
  FCP?: number;
  LCP?: number;
  FID?: number;
  CLS?: number;
  TTFB?: number;
}

/**
 * Hook to track Web Vitals metrics
 * Useful for monitoring performance improvements
 */
export function useWebVitals() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const metrics: WebVitalsMetrics = {};

    // Track FCP (First Contentful Paint)
    const paintEntries = performance.getEntriesByType('paint');
    paintEntries.forEach((entry) => {
      if (entry.name === 'first-contentful-paint') {
        metrics.FCP = Math.round(entry.startTime);
      }
    });

    // Track LCP (Largest Contentful Paint)
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        metrics.LCP = Math.round((lastEntry as any).renderTime || (lastEntry as any).loadTime);
      }
      
      if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', () => {
          console.log('Web Vitals:', metrics);
        });
      }
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // LCP observer not supported
    }

    // Track CLS (Cumulative Layout Shift)
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      list.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      metrics.CLS = Math.round(clsValue * 1000) / 1000;
    });

    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      // CLS observer not supported
    }

    return () => {
      observer.disconnect();
      clsObserver.disconnect();
    };
  }, []);
}
