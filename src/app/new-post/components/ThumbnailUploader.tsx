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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-1.5">
                <div className='flex gap-2 items-center'>
                    <Label htmlFor="thumbnail-dropzone" className="text-base">Ảnh thu nhỏ *</Label>
                    <AIGenerationButton
                        label="Tạo ảnh"
                        action={handleGenerateImage}
                        isGenerating={isGeneratingImage}
                        setIsGenerating={setIsGeneratingImage}
                        contentForAI={content as string}
                        requiresContent={true}
                    />
                </div>
                <Dropzone
                    id="thumbnail-dropzone"
                    onDrop={handleFileDrop}
                    accept="image/png, image/jpeg, image/webp, image/avif"
                    maxFiles={1}
                    maxSize={5 * 1024 * 1024} 
                    aria-label="Tải lên ảnh thu nhỏ"
                />
                {!isSEOValid && !thumbnail && !existingThumbnailUrl && (
                    <p className="text-xs text-red-600 pt-1">Vui lòng chọn ảnh thu nhỏ.</p>
                )}
            </div>
            <div className="space-y-4">
                {previewUrl ? (
                    <div className="relative space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Xem trước:</p>
                        <div className="relative aspect-video rounded-lg overflow-hidden border border-dashed border-muted">
                            <img 
                                src={previewUrl} 
                                alt="Xem trước ảnh thu nhỏ" 
                                className="object-cover w-full h-full" 
                            />
                            {thumbnail && (
                                <Button 
                                    variant="destructive" 
                                    size="icon" 
                                    className="absolute top-1 right-1 h-6 w-6" 
                                    onClick={handleRemoveThumbnail}
                                    aria-label="Xóa ảnh thu nhỏ đã chọn"
                                >
                                    <TrashIcon className="w-3.5 h-3.5" />
                                </Button>
                            )}
                        </div>
                        <div className="space-y-1.5 pt-2">
                            <Label htmlFor="imageAlt" className="flex items-center gap-2 text-base">
                                Alt Text (SEO) <span className="text-xs text-muted-foreground">({imageAlt.length}/125 ký tự)</span>
                            </Label>
                            <Textarea
                                id="imageAlt"
                                placeholder="Mô tả hình ảnh cho SEO..."
                                value={imageAlt}
                                onChange={onImageAltChange}
                                rows={2}
                                className="resize-none text-sm"
                                maxLength={125}
                            />
                            <p className="text-xs text-muted-foreground">Mô tả ngắn gọn nội dung ảnh.</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full min-h-[150px] border border-dashed rounded-lg text-muted-foreground text-sm bg-muted/40">
                        Xem trước ảnh thu nhỏ
                    </div>
                )}
            </div>
        </div>
    );
};