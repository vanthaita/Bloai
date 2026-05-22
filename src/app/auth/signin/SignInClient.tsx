'use client';

import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { FcGoogle, FiLoader } from '@/components/icons';

const SignInPage = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const callbackUrl = '/';

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setIsLoading(true);
      await signIn('google', { callbackUrl });
    } catch (error) {
      setIsLoading(false);
      setError('Xác thực với Google không thành công');
    }
  };

  return (
    <div className="w-full max-w-md animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="mb-2 font-mono text-3xl font-bold text-gray-900">
          Chào mừng trở lại
        </h1>
        <p className="mb-4 text-gray-600">
          Đăng nhập để tiếp tục hành trình của bạn
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
        >
          &larr; Quay lại Trang chủ
        </Link>
      </div>

      {error && (
        <div className="mb-4 flex animate-fade-in items-center gap-2 rounded-lg bg-red-50 p-3 text-red-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-900 shadow-sm transition-all hover:border-gray-400 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading ? (
          <FiLoader className="h-5 w-5 animate-spin text-gray-600" />
        ) : (
          <FcGoogle className="h-5 w-5 shrink-0" />
        )}
        <span>{isLoading ? 'Đang chuyển hướng...' : 'Đăng nhập với Google'}</span>
      </button>
    </div>
  );
};

export default SignInPage;
