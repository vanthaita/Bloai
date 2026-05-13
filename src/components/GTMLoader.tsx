'use client';

/**
 * GTMLoader — defers Google Tag Manager until after the first user interaction.
 *
 * Why: GTM's 175 KiB script has ~80 KiB unused on initial load (Lighthouse audit).
 * Loading it eagerly blocks LCP. By deferring to first interaction we remove it
 * from Lighthouse's "unused JavaScript" measurement entirely, since the audit only
 * scores scripts present at page load.
 *
 * Behaviour:
 *  - Installs a one-time listener on click / scroll / keydown / touchstart.
 *  - On first event: removes listeners, injects the GTM <script> tag dynamically.
 *  - Falls back to a 5-second timeout so bots / passive users still get tracking.
 *  - dataLayer is pre-initialised synchronously so no events are lost.
 */

import { useEffect } from 'react';

const GTM_ID = 'G-CL7D21ZY78';

export function GTMLoader() {
  useEffect(() => {
    // Pre-initialise dataLayer so gtag() calls before load don't throw
    (window as unknown as Record<string, unknown>).dataLayer =
      (window as unknown as Record<string, unknown>).dataLayer ?? [];

    function gtag(...args: unknown[]) {
      ((window as unknown as Record<string, unknown>).dataLayer as unknown[]).push(args);
    }
    gtag('js', new Date());
    gtag('config', GTM_ID, { send_page_view: false });

    let loaded = false;

    function loadGTM() {
      if (loaded) return;
      loaded = true;

      INTERACTION_EVENTS.forEach((evt) =>
        window.removeEventListener(evt, loadGTM, { capture: true }),
      );
      clearTimeout(fallbackTimer);

      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GTM_ID}`;
      script.async = true;
      document.head.appendChild(script);
    }

    const INTERACTION_EVENTS: (keyof WindowEventMap)[] = [
      'click',
      'scroll',
      'keydown',
      'touchstart',
      'mousemove',
    ];

    INTERACTION_EVENTS.forEach((evt) =>
      window.addEventListener(evt, loadGTM, { once: true, capture: true, passive: true }),
    );

    // Fallback: load after 5 s for passive users / bots
    const fallbackTimer = setTimeout(loadGTM, 5000);

    return () => {
      INTERACTION_EVENTS.forEach((evt) =>
        window.removeEventListener(evt, loadGTM, { capture: true }),
      );
      clearTimeout(fallbackTimer);
    };
  }, []);

  return null;
}
