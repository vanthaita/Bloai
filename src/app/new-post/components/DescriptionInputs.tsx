'use client';
import React, { ChangeEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { generateExcerpt, generateMetaDescription } from '@/lib/action'; 
import { toast } from 'react-toastify'; 
import Spinner from '@/components/Snipper';
import { Button } from '@/components/ui/button';


interface DescriptionInputsProps {
    description: string;
    onDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    setDescription: React.Dispatch<React.SetStateAction<string>>;
    metaDescription: string;
    onMetaDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    setMetaDescription: React.Dispatch<React.SetStateAction<string>>; 
    isGeneratingExcerpt: boolean;
    setIsGeneratingExcerpt: React.Dispatch<React.SetStateAction<boolean>>;
    isGeneratingMetaDesc: boolean;
    setIsGeneratingMetaDesc: React.Dispatch<React.SetStateAction<boolean>>;
    isSEOValid: boolean;
    contentForAI: string;
}

export const DescriptionInputs: React.FC<DescriptionInputsProps> = ({
    description,
    onDescriptionChange,
    setDescription,
    metaDescription,
    onMetaDescriptionChange,
    setMetaDescription,
    isGeneratingExcerpt,
    setIsGeneratingExcerpt,
    isGeneratingMetaDesc,
    setIsGeneratingMetaDesc,
    isSEOValid,
    contentForAI,
}) => {

    const handleGenerateExcerpt = async () => {
       if (!contentForAI) {
            toast.info("Vui lòng nhập nội dung chính trước khi tạo bằng AI.");
            return;
        }
       setIsGeneratingExcerpt(true);
       try {
           const generated = await generateExcerpt(contentForAI);
           if (generated) {
               setDescription(generated);
               toast.success(`Mô tả ngắn đã được tạo bằng AI.`);
           } else {
               toast.warn(`AI không thể tạo Mô tả ngắn.`);
           }
       } catch (error) {
            console.error(`Error generating Mô tả ngắn:`, error);
            toast.error(`Lỗi khi tạo Mô tả ngắn bằng AI.`);
       } finally {
           setIsGeneratingExcerpt(false);
       }
    };

     const handleGenerateMetaDesc = async () => {
       if (!contentForAI) {
            toast.info("Vui lòng nhập nội dung chính trước khi tạo bằng AI.");
            return;
        }
       setIsGeneratingMetaDesc(true);
       try {
           const generated = await generateMetaDescription(contentForAI);
           if (generated) {
               setMetaDescription(generated);
               toast.success(`Meta Mô tả đã được tạo bằng AI.`);
           } else {
               toast.warn(`AI không thể tạo Meta Mô tả.`);
           }
       } catch (error) {
            console.error(`Error generating Meta Mô tả:`, error);
            toast.error(`Lỗi khi tạo Meta Mô tả bằng AI.`);
       } finally {
           setIsGeneratingMetaDesc(false);
       }
    };


    return (
        <>
            <div className="space-y-1.5">
                <Label htmlFor="description" className="flex items-center gap-2 text-base">
                    Mô tả ngắn (Excerpt)
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 h-auto px-2 py-1 text-xs"
                        onClick={handleGenerateExcerpt}
                        disabled={isGeneratingExcerpt}
                    >
                        {isGeneratingExcerpt ? <><Spinner className="h-3 w-3 mr-1" /> Đang tạo...</> : "Tạo AI"}
                    </Button>
                </Label>
                <Textarea
                    id="description"
                    placeholder="Viết một đoạn mô tả ngắn gọn, hấp dẫn về bài viết..."
                    rows={3}
                    value={description}
                    onChange={onDescriptionChange}
                    maxLength={300}
                />
                <p className="text-xs text-muted-foreground">Còn lại {300 - description.length} ký tự</p>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="metaDescription" className="flex items-center gap-2 text-base">
                    Meta Mô tả *
                    <span className={`text-xs ${metaDescription.length >= 120 && metaDescription.length <= 160 ? 'text-green-600' : 'text-yellow-600'}`}>
                        ({metaDescription.length}/160 ký tự)
                    </span>
                     <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 h-auto px-2 py-1 text-xs"
                        onClick={handleGenerateMetaDesc}
                        disabled={isGeneratingMetaDesc}
                    >
                        {isGeneratingMetaDesc ? <><Spinner className="h-3 w-3 mr-1" /> Đang tạo...</> : "Tạo AI"}
                    </Button>
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