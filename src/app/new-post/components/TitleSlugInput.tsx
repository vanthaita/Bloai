'use client';
import React, { ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateTitleBlog } from '@/lib/action';
import { AIGenerationButton } from './AIGenerationButton';

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
    modelAi?: string;
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
    modelAi,
}) => {

    const handleGenerateTitle = async (content: string) => {
        try {
            const generatedTitle = await generateTitleBlog(content,modelAi);
            if (generatedTitle) setTitle(generatedTitle);
            return generatedTitle;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    return (
        <>
            <div className="space-y-1.5">
                <Label htmlFor="title" className="flex items-center justify-between text-base font-semibold text-gray-800">
                    <span className="flex items-center gap-1.5">
                        Tiêu đề <span className="text-red-500">*</span>
                    </span>
                    <AIGenerationButton
                        label="Tiêu đề"
                        action={handleGenerateTitle}
                        isGenerating={isGeneratingTitle}
                        setIsGenerating={setIsGeneratingTitle}
                        contentForAI={contentForAI}
                        modelAi={modelAi}
                    />
                </Label>
                <Input
                    id="title"
                    placeholder="Nhập tiêu đề bài viết thật ấn tượng..."
                    value={title}
                    onChange={onTitleChange}
                    className="text-lg font-medium bg-white border-gray-200 focus-visible:ring-purple-500 focus-visible:border-purple-500 shadow-sm transition-all py-6"
                    maxLength={70}
                    required
                    aria-required="true"
                />
                <p className="text-xs text-muted-foreground">Dưới 60 ký tự</p>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="slug" className="flex items-center justify-between text-base font-semibold text-gray-800 mt-4">
                    <span className="flex items-center gap-1.5">
                        Đường dẫn (Slug) <span className="text-red-500">*</span>
                    </span>
                    <button
                        type="button"
                        onClick={onToggleManualSlug}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded transition-colors focus:outline-none"
                    >
                        {isGeneratingSlugManually ? 'Tạo tự động' : 'Chỉnh sửa thủ công'}
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
                    className="bg-gray-50 border-gray-200 focus-visible:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                />
            </div>
        </>
    );
};