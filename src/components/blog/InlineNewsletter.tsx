'use client';

import React, { useState } from 'react';
import { api } from '@/trpc/react';
import { Button } from '@/components/ui/button';

export function InlineNewsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const subscribeMutation = api.blog.subscribeToNewsletter.useMutation({
    onSuccess: () => {
      setStatus('success');
      setEmail('');
    },
    onError: (error) => {
      setStatus('error');
      setErrorMessage(error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    subscribeMutation.mutate({ email });
  };

  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-3 bg-black text-white p-8 sm:p-12 border-2 border-black flex flex-col md:flex-row items-center justify-between gap-8 h-full min-h-[300px]">
      <div className="flex-1 max-w-xl">
        <h3 className="text-xl sm:text-3xl font-extrabold tracking-widest uppercase mb-4 leading-tight">
          Cập nhật tinh hoa AI mỗi tuần
        </h3>
        <p className="text-gray-400 font-medium text-sm sm:text-base leading-relaxed">
          Đăng ký bản tin của Bloai để không bỏ lỡ bất kỳ mô hình ngôn ngữ mới nào. Chúng tôi chắt lọc thông tin để bạn luôn đi trước thời đại.
        </p>
      </div>

      <div className="w-full md:w-auto flex-1 max-w-md">
        {status === 'success' ? (
          <div className="bg-white text-black p-6 border-2 border-white flex flex-col items-center justify-center text-center">
            <span className="text-2xl mb-2">🎉</span>
            <h4 className="font-bold uppercase tracking-widest text-sm mb-1">Đăng ký thành công</h4>
            <p className="text-xs text-gray-600 font-medium">Cảm ơn bạn đã đồng hành cùng Bloai!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
            <div className="relative">
              <input
                type="email"
                placeholder="Nhập email của bạn..."
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                className="w-full h-12 bg-transparent border-b-2 border-gray-600 text-white placeholder:text-gray-500 focus:outline-none focus:border-white transition-colors text-sm sm:text-base font-medium px-2"
                disabled={status === 'loading'}
              />
            </div>
            {status === 'error' && (
              <p className="text-red-400 text-xs font-medium tracking-wide">{errorMessage}</p>
            )}
            <Button
              type="submit"
              disabled={status === 'loading' || !email}
              className="w-full h-12 bg-white text-black border-2 border-white rounded-none hover:bg-black hover:text-white transition-all uppercase tracking-widest font-bold text-xs mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Đang xử lý...' : 'Đăng ký ngay'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
