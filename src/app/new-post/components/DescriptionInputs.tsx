'use client';
import React, { ChangeEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { generateMetaDescription } from '@/lib/action'; 
import { AIGenerationButton } from './AIGenerationButton';


interface DescriptionInputsProps {
    metaDescription: string;
    onMetaDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    setMetaDescription: React.Dispatch<React.SetStateAction<string>>; 
    isGeneratingExcerpt: boolean;
    setIsGeneratingExcerpt: React.Dispatch<React.SetStateAction<boolean>>;
    isGeneratingMetaDesc: boolean;
    setIsGeneratingMetaDesc: React.Dispatch<React.SetStateAction<boolean>>;
    isSEOValid: boolean;
    modelAi?: string;
    contentForAI: string;
}

export const DescriptionInputs: React.FC<DescriptionInputsProps> = ({
    metaDescription,
    onMetaDescriptionChange,
    setMetaDescription,
    isGeneratingMetaDesc,
    setIsGeneratingMetaDesc,
    isSEOValid,
    contentForAI,
    modelAi,
}) => {



    const handleGenerateMetaDesc = async () => {
        try {
            const generated = await generateMetaDescription(contentForAI,modelAi);
            if (generated) {
                setMetaDescription(generated);
            }
            return generated;
        } catch (error) {
            console.error(`Error generating Meta Mô tả:`, error);
            return null;
        }
    };


    return (
        <>
            <div className="space-y-1.5">

                <Label htmlFor="metaDescription" className="flex items-center justify-between text-base font-semibold text-gray-800 mt-4">
                    <span className="flex items-center gap-1.5">
                        Meta Mô tả <span className="text-red-500">*</span>
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-medium ${metaDescription.length >= 120 && metaDescription.length <= 160 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {metaDescription.length}/160
                        </span>
                    </span>
                    <AIGenerationButton
                        label="Meta Mô tả"
                        action={handleGenerateMetaDesc}
                        isGenerating={isGeneratingMetaDesc}
                        setIsGenerating={setIsGeneratingMetaDesc}
                        contentForAI={contentForAI}
                        modelAi={modelAi}
                        requiresContent={true}
                    />
                </Label>
                <Textarea
                    id="metaDescription"
                    value={metaDescription}
                    onChange={onMetaDescriptionChange}
                    className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-3 text-sm focus-visible:ring-purple-500 focus-visible:border-purple-500 transition-all shadow-sm resize-y min-h-[100px]"
                    rows={4}
                    maxLength={160}
                    placeholder="Viết một đoạn mô tả ngắn gọn, hấp dẫn, tối ưu SEO (từ 120-160 ký tự)..."
                    required
                    aria-required="true"
                />
                {!isSEOValid && metaDescription.length > 0 && (metaDescription.length < 120 || metaDescription.length > 160) && (
                    <p className="text-xs text-red-600">Độ dài Meta Description chưa tối ưu (cần dưới 160 ký tự).</p>
                )}
            </div>
        </>
    );
};