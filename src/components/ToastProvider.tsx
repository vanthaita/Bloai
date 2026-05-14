'use client';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';

export default function ToastProvider() {
  useEffect(() => {
    // @ts-expect-error TypeScript doesn't like dynamic imports of CSS
    import('react-toastify/dist/ReactToastify.css');
  }, []);

  return <ToastContainer position="bottom-right" />;
}
