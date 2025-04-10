'use client';
import React, { useState, useCallback, ChangeEvent, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { generateSEOKeywords } from '@/lib/action';
import { toast } from 'react-toastify'; 
import Spinner from '@/components/Snipper';
import { Button } from '@/components/ui/button';

interface TagsManagementInputProps {
    tags: string[];
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
    isGeneratingKeywords: boolean;
    setIsGeneratingKeywords: React.Dispatch<React.SetStateAction<boolean>>;
    contentForAI: string;
}

export const TagsManagementInput: React.FC<TagsManagementInputProps> = ({
    tags,
    setTags,
    isGeneratingKeywords,
    setIsGeneratingKeywords,
    contentForAI,
}) => {
    const [tagInput, setTagInput] = useState('');

    const handleTagKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        if (['Enter', ','].includes(e.key) && tagInput.trim()) {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (tags.length < 15 && !tags.includes(newTag)) {
                setTags(prevTags => [...prevTags, newTag]);
            }
            setTagInput('');
        }
    }, [tagInput, tags, setTags]);

    const removeTag = useCallback((indexToRemove: number) => {
        setTags(prevTags => prevTags.filter((_, index) => index !== indexToRemove));
    }, [setTags]);

    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setTagInput(e.target.value);
    }, []);

    const handleGenerateKeywords = async () => {
       if (!contentForAI) {
            toast.info("Vui lòng nhập nội dung chính trước khi tạo bằng AI.");
            return;
        }
       setIsGeneratingKeywords(true);
       try {
           const generatedString = await generateSEOKeywords(contentForAI);
           if (generatedString) {
               const generatedTags = generatedString.split(/,\s*/).map(tag => tag.trim()).filter(Boolean);
               setTags(prevTags => {
                   const combined = [...prevTags, ...generatedTags];
                   const unique = Array.from(new Set(combined));
                   return unique.slice(0, 15);
               });
               toast.success(`Từ khóa SEO đã được tạo bằng AI.`);
           } else {
               toast.warn(`AI không thể tạo Từ khóa SEO.`);
           }
       } catch (error) {
            console.error(`Error generating Từ khóa SEO:`, error);
            toast.error(`Lỗi khi tạo Từ khóa SEO bằng AI.`);
       } finally {
           setIsGeneratingKeywords(false);
       }
    };


    return (
        <div className="space-y-1.5">
            <Label htmlFor="tagInput" className="flex items-center gap-2 text-sm">
                Từ khóa SEO (Tags)
                 <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 h-auto px-2 py-1 text-xs"
                    onClick={handleGenerateKeywords}
                    disabled={isGeneratingKeywords}
                >
                    {isGeneratingKeywords ? <><Spinner className="h-3 w-3 mr-1" /> Đang tạo...</> : "Tạo AI"}
                </Button>
            </Label>
            <Input
                id="tagInput"
                placeholder="Nhập tag và nhấn Enter/dấu phẩy"
                value={tagInput}
                onChange={handleInputChange}
                onKeyDown={handleTagKeyDown}
                className="text-sm"
                aria-label="Thêm từ khóa SEO hoặc tag"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((tag, index) => (
                    <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive/20 hover:text-destructive transition-colors text-xs px-2 py-0.5"
                        onClick={() => removeTag(index)}
                        title={`Xóa tag "${tag}"`}
                    >
                        {tag} <span aria-hidden="true" className="ml-1">×</span>
                    </Badge>
                ))}
            </div>
            <p className="text-xs text-muted-foreground">{tags.length}/15 tags (khuyến nghị)</p>
        </div>
    );
};