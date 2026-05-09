'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';

const SignInPage = () => {
  const [error, setError] = useState('');
  const callbackUrl = '/';

  const handleGoogleLogin = async () => {
    try {
      await signIn('google', { callbackUrl });
    } catch (error) {
      setError('Xác thực với Google không thành công');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full max-w-md p-8"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 font-mono">
          Chào mừng trở lại
        </h1>
        <p className="text-gray-600">
          Đăng nhập để tiếp tục hành trình của bạn
        </p>
      </div>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </motion.div>
      )}

      <div className="flex justify-center mt-6">
        <button
          onClick={handleGoogleLogin}
          className="btn google w-full h-12 rounded-lg flex justify-center items-center space-x-2 font-medium border border-gray-200 bg-[#e8e8e8] cursor-pointer transition-all hover:border-blue-500"
        >
          <FcGoogle className="text-xl" />
          <span>Đăng nhập với Google</span>
        </button>
      </div>
    </motion.div>
  );
};

export default SignInPage;