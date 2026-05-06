'use client'; 
import React from 'react';
import { Label } from '@/components/ui/label';
import { env } from '@/env'; // Import env

interface SEOPreviewDisplayProps {
    title: string;
    slug: string;
    metaDescription: string;
}

export const SEOPreviewDisplay: React.FC<SEOPreviewDisplayProps> = ({
    title,
    slug,
    metaDescription,
}) => {
    const baseUrl = env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'; 
    const displayUrl = `${baseUrl}/blog/${slug || 'duong-dan-bai-viet'}`;

    return (
        <div className="space-y-4">
            <Label className="text-base font-bold text-gray-800 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Xem trước kết quả tìm kiếm Google
            </Label>
            
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md p-5 max-w-2xl">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                        <img src="/images/Logo/favicon.ico" alt="Favicon" className="w-4 h-4 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[14px] text-[#202124] font-medium leading-tight">Bloai Blog</span>
                        <span className="text-[12px] text-[#4d5156] leading-tight truncate max-w-[300px] sm:max-w-[400px]">{displayUrl}</span>
                    </div>
                </div>
                
                <h3 className="text-[20px] text-[#1a0dab] font-medium leading-snug hover:underline cursor-pointer truncate mb-1">
                    {title || 'Tiêu đề bài viết sẽ hiển thị ở đây'}
                </h3>
                
                <p className="text-[14px] text-[#4d5156] leading-normal line-clamp-2">
                    {metaDescription || 'Đoạn Meta Description (Mô tả bài viết) sẽ xuất hiện tại đây. Nó giúp người tìm kiếm hiểu nội dung chính của trang web. Hãy viết thật thu hút và chứa từ khóa nhé.'}
                </p>
            </div>
        </div>
    );
};