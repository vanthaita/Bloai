'use client';
import { ToastContainer } from 'react-toastify';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

interface ClientProvidersProps {
  isVercel: boolean;
}

export function ClientProviders({ isVercel }: ClientProvidersProps) {
  return (
    <>
      <ToastContainer position="bottom-right" />
      {isVercel && <Analytics />}
      {isVercel && <SpeedInsights />}
    </>
  );
}
