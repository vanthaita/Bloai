'use client';
import React, { ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { generateOpenGraphTitle, generateOpenGraphDescription } from '@/lib/action';
import { toast } from 'react-toastify';
import Spinner from '@/components/Snipper'; 

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
}) => {
    const handleResetCanonical = () => {
        setIsAutoCanonical(true);
     
    };

    const handleGenerateOgTitle = async () => {
       if (!contentForAI) {
            toast.info("Vui lòng nhập nội dung chính trước khi tạo bằng AI.");
            return;
        }
       setIsGeneratingOgTitle(true);
       try {
           const generated = await generateOpenGraphTitle(contentForAI);
           if (generated) {
               setOgTitle(generated);
               toast.success(`OG Title đã được tạo bằng AI.`);
           } else {
               toast.warn(`AI không thể tạo OG Title.`);
           }
       } catch (error) {
            console.error(`Error generating OG Title:`, error);
            toast.error(`Lỗi khi tạo OG Title bằng AI.`);
       } finally {
           setIsGeneratingOgTitle(false);
       }
    };

    const handleGenerateOgDesc = async () => {
        if (!contentForAI) {
            toast.info("Vui lòng nhập nội dung chính trước khi tạo bằng AI.");
            return;
        }
       setIsGeneratingOgDescription(true);
       try {
           const generated = await generateOpenGraphDescription(contentForAI);
           if (generated) {
               setOgDescription(generated);
               toast.success(`OG Description đã được tạo bằng AI.`);
           } else {
               toast.warn(`AI không thể tạo OG Description.`);
           }
       } catch (error) {
            console.error(`Error generating OG Description:`, error);
            toast.error(`Lỗi khi tạo OG Description bằng AI.`);
       } finally {
           setIsGeneratingOgDescription(false);
       }
    };

    return (
        <div className="space-y-4">
            <Label className="text-lg font-semibold">SEO Nâng cao</Label>
            <div className="space-y-1.5">
                <Label htmlFor="canonicalUrl" className="flex items-center gap-2 text-sm">
                    URL Canonical
                    {!isAutoCanonical && (
                        <Button type="button" variant="link" size="sm" className="text-blue-600 hover:text-blue-700 h-auto p-0 text-xs" onClick={handleResetCanonical}>
                            Đặt lại tự động
                        </Button>
                    )}
                </Label>
                <Input
                    id="canonicalUrl"
                    placeholder="Để trống để tạo tự động"
                    value={canonicalUrl}
                    onChange={onCanonicalUrlChange} 
                    className="text-sm"
                />
                {isAutoCanonical && <p className="text-xs text-muted-foreground">Tự động tạo từ đường dẫn (slug).</p>}
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="ogTitle" className="flex items-center gap-2 text-sm">
                    OG Title
                     <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 h-auto px-2 py-1 text-xs"
                        onClick={handleGenerateOgTitle}
                        disabled={isGeneratingOgTitle}
                    >
                        {isGeneratingOgTitle ? <><Spinner className="h-3 w-3 mr-1" /> Đang tạo...</> : "Tạo AI"}
                    </Button>
                </Label>
                <Input
                    id="ogTitle"
                    value={ogTitle}
                    onChange={onOgTitleChange}
                    placeholder="Tiêu đề hiển thị khi chia sẻ mạng xã hội"
                    className="text-sm"
                    maxLength={60}
                />
                 <p className="text-xs text-muted-foreground">Còn lại {60 - (ogTitle?.length ?? 0)} ký tự</p>
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="ogDescription" className="flex items-center gap-2 text-sm">
                    OG Description
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 h-auto px-2 py-1 text-xs"
                        onClick={handleGenerateOgDesc}
                        disabled={isGeneratingOgDescription}
                    >
                        {isGeneratingOgDescription ? <><Spinner className="h-3 w-3 mr-1" /> Đang tạo...</> : "Tạo AI"}
                    </Button>
                </Label>
                <Textarea
                    id="ogDescription"
                    value={ogDescription}
                    onChange={onOgDescriptionChange}
                    rows={2}
                    placeholder="Mô tả hiển thị khi chia sẻ mạng xã hội"
                    className="text-sm"
                    maxLength={155}
                />
                <p className="text-xs text-muted-foreground">Còn lại {155 - (ogDescription?.length ?? 0)} ký tự</p>
            </div>
        </div>
    );
};