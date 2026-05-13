'use client';
import { ToastContainer } from 'react-toastify';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export function ClientProviders() {
  return (
    <>
      <ToastContainer position="bottom-right" />
      <Analytics />
      <SpeedInsights />
    </>
  );
}
