'use client';
import React, { ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { generateOpenGraphTitle, generateOpenGraphDescription } from '@/lib/action';
import { AIGenerationButton } from './AIGenerationButton';

interface AdvancedSEOFormFieldsProps {
    canonicalUrl: string;
    onCanonicalUrlChange: (e: ChangeEvent<HTMLInputElement>) => void;
    isAutoCanonical: boolean;
    setIsAutoCanonical: React.Dispatch<React.SetStateAction<boolean>>;
    ogTitle: string;
    onOgTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    setOgTitle: React.Dispatch<React.SetStateAction<string>>; 
    ogDescription: string;
    onOgDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    setOgDescription: React.Dispatch<React.SetStateAction<string>>;
    isGeneratingOgTitle: boolean;
    setIsGeneratingOgTitle: React.Dispatch<React.SetStateAction<boolean>>;
    isGeneratingOgDescription: boolean;
    setIsGeneratingOgDescription: React.Dispatch<React.SetStateAction<boolean>>;
    slug: string; 
    contentForAI: string;
    modelAi?: string;
}

export const AdvancedSEOFormFields: React.FC<AdvancedSEOFormFieldsProps> = ({
    canonicalUrl,
    onCanonicalUrlChange,
    isAutoCanonical,
    setIsAutoCanonical,
    ogTitle,
    onOgTitleChange,
    setOgTitle,
    ogDescription,
    onOgDescriptionChange,
    setOgDescription,
    isGeneratingOgTitle,
    setIsGeneratingOgTitle,
    isGeneratingOgDescription,
    setIsGeneratingOgDescription,
    slug,
    contentForAI,
    modelAi
}) => {
    const handleResetCanonical = () => {
        setIsAutoCanonical(true);
     
    };

    const handleGenerateOgTitle = async (content: string) => {
        try {
            const generated = await generateOpenGraphTitle(content,modelAi);
            if (generated) setOgTitle(generated);
            return generated;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const handleGenerateOgDesc = async (content: string) => {
        try {
            const generated = await generateOpenGraphDescription(content,modelAi);
            if (generated) setOgDescription(generated);
            return generated;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-100 pb-2">
                <Label className="text-lg font-bold text-gray-800">SEO Nâng cao</Label>
                <p className="text-xs text-gray-500 mt-1">Tuỳ chỉnh cách bài viết hiển thị trên mạng xã hội và Google.</p>
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="canonicalUrl" className="flex items-center justify-between text-sm font-semibold text-gray-700">
                    <span>URL Canonical</span>
                    {!isAutoCanonical && (
                        <Button type="button" variant="link" size="sm" className="text-blue-600 hover:text-blue-700 h-auto p-0 text-xs font-medium" onClick={handleResetCanonical}>
                            Đặt lại tự động
                        </Button>
                    )}
                </Label>
                <Input
                    id="canonicalUrl"
                    placeholder="Để trống để tạo tự động"
                    value={canonicalUrl}
                    onChange={onCanonicalUrlChange} 
                    className="h-10 px-3 text-sm bg-gray-50 border-gray-200 focus-visible:ring-purple-500 transition-all shadow-sm"
                />
                {isAutoCanonical && <p className="text-xs text-muted-foreground pt-0.5">Tự động tạo từ đường dẫn (slug).</p>}
            </div>
            <div className="space-y-1.5 mt-4">
                <Label htmlFor="ogTitle" className="flex items-center justify-between text-sm font-semibold text-gray-700">
                    <span>OG Title</span>
                    <AIGenerationButton
                        label="OG Title"
                        action={handleGenerateOgTitle}
                        isGenerating={isGeneratingOgTitle}
                        setIsGenerating={setIsGeneratingOgTitle}
                        contentForAI={contentForAI}
                        modelAi={modelAi}
                        requiresContent={true}
                    /> 
                </Label>
                <Input
                    id="ogTitle"
                    value={ogTitle}
                    onChange={onOgTitleChange}
                    placeholder="Tiêu đề hiển thị khi chia sẻ (Facebook, Zalo...)"
                    className="h-10 px-3 text-sm bg-white border-gray-200 focus-visible:ring-purple-500 transition-all shadow-sm"
                    maxLength={60}
                />
                 <p className="text-[11px] text-gray-500 pt-0.5">Còn lại {60 - (ogTitle?.length ?? 0)} ký tự</p>
            </div>
            <div className="space-y-1.5 mt-4">
                <Label htmlFor="ogDescription" className="flex items-center justify-between text-sm font-semibold text-gray-700">
                    <span>OG Description</span>
                    <AIGenerationButton
                        label="OG Description"
                        action={handleGenerateOgDesc}
                        isGenerating={isGeneratingOgDescription}
                        setIsGenerating={setIsGeneratingOgDescription}
                        contentForAI={contentForAI}
                        modelAi={modelAi}
                        requiresContent={true}
                    />
                </Label>
                <Textarea
                    id="ogDescription"
                    value={ogDescription}
                    onChange={onOgDescriptionChange}
                    rows={4}
                    placeholder="Mô tả hiển thị khi chia sẻ (Facebook, Zalo...)"
                    className="min-h-[100px] p-3 text-sm bg-white border-gray-200 focus-visible:ring-purple-500 transition-all shadow-sm resize-y"
                    maxLength={155}
                />
                <p className="text-[11px] text-gray-500 pt-0.5">Còn lại {155 - (ogDescription?.length ?? 0)} ký tự</p>
            </div>
        </div>
    );
};