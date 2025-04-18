'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { FiLoader } from 'react-icons/fi';

interface SubmissionAreaProps {
    isSEOValid: boolean;
    isSubmitting: boolean;
    onSubmit: () => void;
    isUpdateMode: boolean;
}

export const SubmissionArea: React.FC<SubmissionAreaProps> = ({
    isSEOValid,
    isSubmitting,
    onSubmit,
    isUpdateMode
}) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 w-full">
            <div className="text-sm text-muted-foreground">
                {isSEOValid ? (
                    <span className="text-green-600 font-medium">✓ Tối ưu SEO cơ bản</span>
                ) : (
                    <span className="text-yellow-600 font-medium">⚠ Kiểm tra lại SEO</span>
                )}
            </div>
            <div className="flex gap-3">
                <Button onClick={onSubmit} className='bg-black text-white hover:bg-gray-800' disabled={isSubmitting || !isSEOValid} aria-disabled={isSubmitting || !isSEOValid}>
                    {isSubmitting ? (
                        <><FiLoader className="animate-spin mr-2" size={18} /> Đang xuất bản...</>
                    ) : ( `${isUpdateMode ? 'Cập Nhật Ngay' : 'Xuất bản Ngay' }` )}
                </Button>
            </div>
        </div>
    );
};