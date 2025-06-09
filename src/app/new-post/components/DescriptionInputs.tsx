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
                <Label htmlFor="metaDescription" className="flex items-center gap-2 text-base">
                    Meta Mô tả *
                    <span className={`text-xs ${metaDescription.length >= 120 && metaDescription.length <= 165 ? 'text-green-600' : 'text-yellow-600'}`}>
                        ({metaDescription.length}/165 ký tự)
                    </span>
                    <AIGenerationButton
                        label="Meta Mô tả"
                        action={handleGenerateMetaDesc}
                        isGenerating={isGeneratingMetaDesc}
                        setIsGenerating={setIsGeneratingMetaDesc}
                        contentForAI={contentForAI}
                        requiresContent={true}
                    />
                </Label>
                <Textarea
                    id="metaDescription"
                    value={metaDescription}
                    onChange={onMetaDescriptionChange}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    rows={3}
                    maxLength={160}
                    placeholder="Tối ưu cho SEO, khoảng 120-160 ký tự."
                    required
                    aria-required="true"
                />
                {!isSEOValid && metaDescription.length > 0 && (metaDescription.length < 120 || metaDescription.length > 160) && (
                    <p className="text-xs text-red-600">Độ dài Meta Description chưa tối ưu (cần 120-160 ký tự).</p>
                )}
            </div>
        </>
    );
};