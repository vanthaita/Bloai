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
    <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-3 bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 text-white p-8 sm:p-12 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8 h-full min-h-[300px] shadow-lg relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex-1 max-w-xl relative z-10">
        <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight mb-4 leading-tight text-white">
          Cập nhật tinh hoa AI mỗi tuần
        </h3>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Đăng ký bản tin của Bloai để không bỏ lỡ bất kỳ mô hình ngôn ngữ mới nào. Chúng tôi chắt lọc thông tin để bạn luôn đi trước thời đại.
        </p>
      </div>

      <div className="w-full md:w-auto flex-1 max-w-md relative z-10">
        {status === 'success' ? (
          <div className="bg-white/5 backdrop-blur-md text-white p-6 border border-white/10 rounded-2xl flex flex-col items-center justify-center text-center shadow-md">
            <span className="text-3xl mb-3">🎉</span>
            <h4 className="font-bold tracking-tight text-base mb-1">Đăng ký thành công</h4>
            <p className="text-xs text-slate-300 leading-relaxed">Cảm ơn bạn đã đồng hành cùng Bloai!</p>
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
                className="w-full h-12 bg-white/5 border border-white/10 rounded-full text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm px-5"
                disabled={status === 'loading'}
              />
            </div>
            {status === 'error' && (
              <p className="text-red-400 text-xs font-medium tracking-wide">{errorMessage}</p>
            )}
            <Button
              type="submit"
              disabled={status === 'loading' || !email}
              className="w-full h-12 bg-white text-slate-900 hover:bg-slate-50 border-0 rounded-full transition-all font-semibold text-sm mt-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
            >
              {status === 'loading' ? 'Đang xử lý...' : 'Đăng ký ngay'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
