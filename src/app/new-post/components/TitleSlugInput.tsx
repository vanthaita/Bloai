'use client';
import React, { ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/Snipper';
import { generateTitleBlog } from '@/lib/action';
import { toast } from 'react-toastify';

interface TitleSlugInputProps {
    title: string;
    onTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    setTitle: React.Dispatch<React.SetStateAction<string>>; 
    slug: string;
    onSlugChange: (e: ChangeEvent<HTMLInputElement>) => void;
    isGeneratingSlugManually: boolean;
    onToggleManualSlug: () => void;
    isGeneratingTitle: boolean;
    setIsGeneratingTitle: React.Dispatch<React.SetStateAction<boolean>>;
    contentForAI: string;
}

export const TitleSlugInput: React.FC<TitleSlugInputProps> = ({
    title,
    onTitleChange,
    setTitle, 
    slug,
    onSlugChange,
    isGeneratingSlugManually,
    onToggleManualSlug,
    isGeneratingTitle,
    setIsGeneratingTitle,
    contentForAI,
}) => {

    const handleGenerateTitle = async () => {
       if (!contentForAI) {
            toast.info("Vui lòng nhập nội dung chính trước khi tạo bằng AI.");
            return;
        }
       setIsGeneratingTitle(true);
       try {
           const generatedTitle = await generateTitleBlog(contentForAI);
           if (generatedTitle) {
               setTitle(generatedTitle); 
               toast.success(`Tiêu đề đã được tạo bằng AI.`);
           } else {
               toast.warn(`AI không thể tạo Tiêu đề. Vui lòng thử lại hoặc viết thủ công.`);
           }
       } catch (error) {
            console.error(`Error generating Tiêu đề:`, error);
            toast.error(`Lỗi khi tạo Tiêu đề bằng AI.`);
       } finally {
           setIsGeneratingTitle(false);
       }
    };

    return (
        <>
            <div className="space-y-1.5">
                <Label htmlFor="title" className="flex items-center gap-2 text-base">
                    Tiêu đề *
                     <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 h-auto px-2 py-1 text-xs"
                        onClick={handleGenerateTitle}
                        disabled={isGeneratingTitle}
                        aria-label="Tạo Tiêu đề bằng AI"
                    >
                        {isGeneratingTitle ? (
                            <span className="flex items-center gap-1">
                                <Spinner className="h-3 w-3" />
                                Đang tạo...
                            </span>
                        ) : (
                            "Tạo AI"
                        )}
                    </Button>
                </Label>
                <Input
                    id="title"
                    placeholder="Nhập tiêu đề bài viết"
                    value={title}
                    onChange={onTitleChange}
                    className="text-lg font-medium"
                    maxLength={70}
                    required
                    aria-required="true"
                />
                <p className="text-xs text-muted-foreground">Còn lại {70 - title.length} ký tự (khuyến nghị SEO)</p>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="slug" className="flex items-center gap-2 text-base">
                    Đường dẫn (Slug) *
                    <button
                        type="button"
                        onClick={onToggleManualSlug}
                        className="text-xs text-blue-600 hover:underline focus:outline-none"
                    >
                        {isGeneratingSlugManually ? 'Tạo tự động' : 'Chỉnh sửa'}
                    </button>
                </Label>
                <Input
                    id="slug"
                    value={slug}
                    onChange={onSlugChange}
                    disabled={!isGeneratingSlugManually}
                    required
                    aria-required="true"
                    placeholder="duong-dan-bai-viet"
                />
            </div>
        </>
    );
};