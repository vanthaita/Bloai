'use client';
import React, { useState, useCallback, useEffect, ChangeEvent } from 'react';
import { Dropzone } from '@/components/Dropzone'; 
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { TrashIcon } from 'lucide-react';
import { AIGenerationButton } from './AIGenerationButton';
import { generateImage } from '@/lib/action';

interface ThumbnailUploaderProps {
    thumbnail: File | null;
    onThumbnailChange: (file: File | null) => void;
    imageAlt: string;
    onImageAltChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    isSEOValid: boolean; 
    existingThumbnailUrl: string; 
    content?: string;
    modelAi?: string;
    checkIsImageGenerated?: boolean,
    setCheckIsImageGenerated: (isGenerated: boolean) => void;
    setExistingThumbnailUrl: (thumbnailUrl: string) => void
}

export const ThumbnailUploader: React.FC<ThumbnailUploaderProps> = ({
    thumbnail,
    onThumbnailChange,
    imageAlt,
    onImageAltChange,
    isSEOValid,
    existingThumbnailUrl,
    content,
    modelAi,
    setCheckIsImageGenerated,
    setExistingThumbnailUrl,
}) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);

    useEffect(() => {
        let objectUrl: string | null = null;
        
        if (thumbnail) {
            objectUrl = URL.createObjectURL(thumbnail);
            setPreviewUrl(objectUrl);
        } 
        else if (existingThumbnailUrl) {
            setPreviewUrl(existingThumbnailUrl);
        }
        else {
            setPreviewUrl(null);
        }

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [thumbnail, existingThumbnailUrl]); 

    const handleFileDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0 && acceptedFiles[0]) {
            onThumbnailChange(acceptedFiles[0]);
        } else {
            onThumbnailChange(null); 
        }
    }, [onThumbnailChange]);

    const handleRemoveThumbnail = useCallback(() => {
        onThumbnailChange(null);
    }, [onThumbnailChange]);

    const handleGenerateImage = useCallback(async () => {
        if (!content) return;
        
        setIsGeneratingImage(true);
        try {
            const url = await generateImage(content, modelAi);
            if (url) {
                const response = await fetch(url);
                const blob = await response.blob();
                const file = new File([blob], 'ai-generated-thumbnail.png', {
                    type: blob.type,
                    lastModified: Date.now()
                });
                onThumbnailChange(file);
                setCheckIsImageGenerated(true);
                setExistingThumbnailUrl(url);
            }
            return url
        } catch (error) {
            console.error('Error generating image:', error);
            return null;
        } finally {
            setIsGeneratingImage(false);
        }
    }, [content, onThumbnailChange, modelAi]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mt-4">
            {/* Cột trái: Dropzone */}
            <div className="flex flex-col space-y-2">
                <div className='flex justify-between items-center h-9'>
                    <Label htmlFor="thumbnail-dropzone" className="text-base font-semibold text-gray-800 flex items-center gap-1.5">
                        Ảnh thu nhỏ <span className="text-red-500">*</span>
                    </Label>
                    <AIGenerationButton
                        label="Tạo ảnh"
                        action={handleGenerateImage}
                        isGenerating={isGeneratingImage}
                        setIsGenerating={setIsGeneratingImage}
                        contentForAI={content as string}
                        modelAi={modelAi}
                        requiresContent={true}
                    />
                </div>
                <div className="flex flex-col">
                    <div className="aspect-video w-full">
                        <Dropzone
                            id="thumbnail-dropzone"
                            onDrop={handleFileDrop}
                            accept="image/png, image/jpeg, image/webp, image/avif"
                            maxFiles={1}
                            maxSize={5 * 1024 * 1024} 
                            aria-label="Tải lên ảnh thu nhỏ"
                        />
                    </div>
                    {!isSEOValid && !thumbnail && !existingThumbnailUrl && (
                        <p className="text-xs text-red-600 pt-1.5">Vui lòng chọn ảnh thu nhỏ.</p>
                    )}
                </div>
            </div>

            {/* Cột phải: Preview */}
            <div className="flex flex-col space-y-2">
                <div className='flex items-center h-9'>
                    <span className="text-sm font-semibold text-gray-700">Xem trước ảnh</span>
                </div>
                
                {previewUrl ? (
                    <div className="flex flex-col space-y-3">
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
                            <img 
                                src={previewUrl} 
                                alt="Xem trước ảnh thu nhỏ" 
                                className="object-cover w-full h-full" 
                            />
                            {thumbnail && (
                                <Button 
                                    variant="destructive" 
                                    size="icon" 
                                    className="absolute top-2 right-2 h-7 w-7 rounded-full shadow-md hover:scale-105 transition-transform" 
                                    onClick={handleRemoveThumbnail}
                                    aria-label="Xóa ảnh thu nhỏ đã chọn"
                                >
                                    <TrashIcon className="w-3.5 h-3.5" />
                                </Button>
                            )}
                        </div>
                        <div className="space-y-1.5 pt-1">
                            <Label htmlFor="imageAlt" className="flex items-center justify-between text-sm font-semibold text-gray-700">
                                <span>Alt Text (SEO)</span>
                                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${imageAlt.length > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {imageAlt.length}/125
                                </span>
                            </Label>
                            <Textarea
                                id="imageAlt"
                                placeholder="Mô tả hình ảnh cho SEO..."
                                value={imageAlt}
                                onChange={onImageAltChange}
                                rows={2}
                                className="resize-none text-sm bg-white border-gray-200 focus-visible:ring-purple-500 shadow-sm transition-all"
                                maxLength={125}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <div className="aspect-video w-full flex items-center justify-center border border-dashed border-gray-200 rounded-xl text-gray-400 text-sm bg-gray-50/50 shadow-sm">
                            <span className="flex items-center gap-2">
                                Chưa có ảnh thu nhỏ
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};