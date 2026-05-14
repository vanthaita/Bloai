'use client';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import dynamic from 'next/dynamic';

const ToastProvider = dynamic(() => import('./ToastProvider'), { ssr: false });

export function ClientProviders() {
  return (
    <>
      <ToastProvider />
      <Analytics />
      <SpeedInsights />
    </>
  );
}
