'use client';
import React, { useState, useCallback, ChangeEvent, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { generateSEOKeywords } from '@/lib/action';
import { AIGenerationButton } from './AIGenerationButton';
import { Check, X, Plus, Sparkles, Info } from 'lucide-react';

interface TagItem {
    tag: string;
    isExisting: boolean;
}

interface TagsManagementInputProps {
    tags: string[];
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
    isGeneratingKeywords: boolean;
    setIsGeneratingKeywords: React.Dispatch<React.SetStateAction<boolean>>;
    contentForAI: string;
    modelAi?: string;
}

export const TagsManagementInput: React.FC<TagsManagementInputProps> = ({
    tags,
    setTags,
    isGeneratingKeywords,
    setIsGeneratingKeywords,
    contentForAI,
    modelAi
}) => {
    const [tagInput, setTagInput] = useState('');
    const [suggestions, setSuggestions] = useState<TagItem[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // ─── Thêm tag thủ công ───────────────────────────────────────────────────
    const addTag = useCallback((value: string) => {
        const newTag = value.trim().toLowerCase();
        if (!newTag) return;
        if (tags.length >= 15) return;
        if (tags.includes(newTag)) return;
        setTags(prev => [...prev, newTag]);
    }, [tags, setTags]);

    const handleTagKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        if (['Enter', ','].includes(e.key) && tagInput.trim()) {
            e.preventDefault();
            addTag(tagInput);
            setTagInput('');
        }
    }, [tagInput, addTag]);

    const removeTag = useCallback((indexToRemove: number) => {
        setTags(prev => prev.filter((_, i) => i !== indexToRemove));
    }, [setTags]);

    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setTagInput(e.target.value);
    }, []);

    // ─── AI Generate ─────────────────────────────────────────────────────────
    const handleGenerateKeywords = async () => {
        try {
            const rawResult = await generateSEOKeywords(contentForAI, modelAi);
            if (!rawResult) return null;

            // Thử parse JSON từ AI
            let parsed: TagItem[] = [];
            try {
                // Trích JSON array từ response (phòng trường hợp AI thêm text thừa)
                const jsonMatch = rawResult.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                    parsed = JSON.parse(jsonMatch[0]) as TagItem[];
                }
            } catch {
                // Fallback: AI trả về chuỗi phân cách dấu phẩy
                parsed = rawResult
                    .split(/,\s*/)
                    .map(t => t.trim())
                    .filter(Boolean)
                    .map(t => ({ tag: t.toLowerCase(), isExisting: false }));
            }

            if (parsed.length > 0) {
                // Lọc bỏ tags đã có trong danh sách hiện tại
                const filtered = parsed.filter(
                    item => !tags.includes(item.tag.toLowerCase())
                );
                setSuggestions(filtered);
                setShowSuggestions(true);
            }

            return rawResult;
        } catch (error) {
            console.error('Error generating tags:', error);
            return null;
        }
    };

    // ─── Chấp nhận / từ chối suggestions ────────────────────────────────────
    const acceptSuggestion = useCallback((item: TagItem) => {
        addTag(item.tag);
        setSuggestions(prev => prev.filter(s => s.tag !== item.tag));
    }, [addTag]);

    const rejectSuggestion = useCallback((item: TagItem) => {
        setSuggestions(prev => prev.filter(s => s.tag !== item.tag));
    }, []);

    const acceptAllSuggestions = useCallback(() => {
        const toAdd = suggestions
            .map(s => s.tag.toLowerCase())
            .filter(t => !tags.includes(t));

        setTags(prev => {
            const combined = [...prev, ...toAdd];
            const unique = Array.from(new Set(combined));
            return unique.slice(0, 15);
        });
        setSuggestions([]);
        setShowSuggestions(false);
    }, [suggestions, tags, setTags]);

    const dismissSuggestions = useCallback(() => {
        setSuggestions([]);
        setShowSuggestions(false);
    }, []);

    // ─── Màu badge theo loại tag ─────────────────────────────────────────────
    const tagColor = (idx: number) => {
        const colors = [
            'bg-blue-100 text-blue-800 border-blue-200',
            'bg-purple-100 text-purple-800 border-purple-200',
            'bg-green-100 text-green-800 border-green-200',
            'bg-amber-100 text-amber-800 border-amber-200',
            'bg-rose-100 text-rose-800 border-rose-200',
        ];
        return colors[idx % colors.length];
    };

    const remaining = 15 - tags.length;

    return (
        <div className="space-y-3">
            {/* Header */}
            <Label htmlFor="tagInput" className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="w-4 h-4 text-purple-500" />
                Từ khóa SEO (Tags)
                <span className={`ml-auto text-xs font-normal px-2 py-0.5 rounded-full ${
                    remaining === 0 ? 'bg-red-100 text-red-600' :
                    remaining <= 3 ? 'bg-amber-100 text-amber-600' :
                    'bg-gray-100 text-gray-500'
                }`}>
                    {tags.length}/15
                </span>
            </Label>

            {/* Input + AI button */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Input
                        id="tagInput"
                        placeholder={remaining > 0 ? 'Nhập tag → Enter hoặc dấu phẩy' : 'Đã đủ 15 tags'}
                        value={tagInput}
                        onChange={handleInputChange}
                        onKeyDown={handleTagKeyDown}
                        disabled={remaining === 0}
                        className="text-sm pr-16"
                        aria-label="Thêm từ khóa SEO"
                    />
                    {tagInput.trim() && remaining > 0 && (
                        <button
                            type="button"
                            onClick={() => { addTag(tagInput); setTagInput(''); }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                            <Plus className="w-3 h-3" /> Thêm
                        </button>
                    )}
                </div>
                <AIGenerationButton
                    label="Tags AI"
                    action={handleGenerateKeywords}
                    isGenerating={isGeneratingKeywords}
                    setIsGenerating={setIsGeneratingKeywords}
                    contentForAI={contentForAI}
                    requiresContent={true}
                />
            </div>

            {/* Current Tags */}
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag, index) => (
                        <span
                            key={`${tag}-${index}`}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border cursor-pointer group transition-all ${tagColor(index)}`}
                            onClick={() => removeTag(index)}
                            title={`Bỏ tag "${tag}"`}
                        >
                            {tag}
                            <X className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                        </span>
                    ))}
                </div>
            )}

            {/* AI Suggestions Panel */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="rounded-lg border border-purple-200 bg-purple-50/60 p-3 space-y-2.5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                            <span className="text-xs font-semibold text-purple-700">
                                AI gợi ý {suggestions.length} tags
                            </span>
                            <span className="flex items-center gap-0.5 text-xs text-gray-400 ml-1">
                                <Info className="w-3 h-3" />
                                Click ✓ để thêm, ✗ để bỏ qua
                            </span>
                        </div>
                        <div className="flex gap-1.5">
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="h-6 px-2 text-xs border-purple-300 text-purple-700 hover:bg-purple-100"
                                onClick={acceptAllSuggestions}
                                disabled={remaining === 0}
                            >
                                <Check className="w-3 h-3 mr-1" /> Chọn tất cả
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
                                onClick={dismissSuggestions}
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                        {suggestions.map((item, idx) => (
                            <div
                                key={`${item.tag}-${idx}`}
                                className={`inline-flex items-center gap-0.5 pl-2 pr-0.5 py-0.5 rounded-full text-xs font-medium border ${
                                    item.isExisting
                                        ? 'bg-green-50 text-green-700 border-green-200'
                                        : 'bg-white text-gray-700 border-gray-200'
                                }`}
                            >
                                {item.isExisting && (
                                    <span className="text-[10px] text-green-500 mr-0.5" title="Tag đã có trong DB">●</span>
                                )}
                                {item.tag}
                                <button
                                    type="button"
                                    onClick={() => acceptSuggestion(item)}
                                    disabled={remaining === 0 || tags.includes(item.tag.toLowerCase())}
                                    className="ml-0.5 p-0.5 rounded-full hover:bg-green-100 text-green-600 disabled:opacity-30 transition-colors"
                                    title="Thêm tag này"
                                >
                                    <Check className="w-3 h-3" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => rejectSuggestion(item)}
                                    className="p-0.5 rounded-full hover:bg-red-100 text-red-400 transition-colors"
                                    title="Bỏ qua"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <p className="text-[11px] text-gray-400 flex items-center gap-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
                        Tag có sẵn trong hệ thống — giúp liên kết bài viết với nội dung hiện có
                    </p>
                </div>
            )}

            {/* No suggestions left message */}
            {showSuggestions && suggestions.length === 0 && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Đã xử lý tất cả gợi ý
                </p>
            )}

            {/* Help text */}
            <p className="text-xs text-muted-foreground">
                {remaining > 0
                    ? `Còn ${remaining} tag nữa. Tags ảnh hưởng trực tiếp đến SEO và gợi ý bài viết liên quan.`
                    : '✓ Đã đủ 15 tags tối ưu.'}
            </p>
        </div>
    );
};