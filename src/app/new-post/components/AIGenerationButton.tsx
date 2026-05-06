'use client'
import React, { memo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/Snipper';
import { toast } from 'react-toastify';
import { Wand2 } from 'lucide-react';

interface AIGenerationButtonProps {
    label: string;
    action: (content: string, modelAi?: string) => Promise<string | null | undefined>;
    isGenerating: boolean;
    setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
    contentForAI: string; 
    disabled?: boolean;
    modelAi?: string;
    requiresContent?: boolean; 
}

const AIGenerationButtonComponent: React.FC<AIGenerationButtonProps> = ({
    label,
    action,
    isGenerating,
    setIsGenerating,
    contentForAI,
    modelAi,
    disabled = false,
    requiresContent = true,
}) => {
    const handleClick = useCallback(async () => {
        if (requiresContent && !contentForAI) {
            toast.info("Vui lòng nhập nội dung chính trước khi tạo bằng AI.");
            return;
        }
        setIsGenerating(true);
        try {
            const generated = await action(contentForAI, modelAi);
            if (generated) {
                toast.success(`${label} đã được tạo thành công bằng AI.`);
            } else {
                toast.warn(`AI không thể tạo ${label}. Vui lòng thử lại hoặc viết thủ công.`);
            }
        } catch (error) {
            console.error(`Error generating ${label}:`, error);
            toast.error(`Lỗi khi tạo ${label} bằng AI: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsGenerating(false);
        }
    }, [action, contentForAI, setIsGenerating, label, requiresContent, modelAi]);

    return (
        <Button
            type="button"
            variant="outline"
            size="sm"
            className="group relative h-8 px-4 text-xs font-semibold bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 text-purple-700 hover:text-purple-800 hover:border-purple-300 hover:shadow-md transition-all overflow-hidden rounded-full"
            onClick={handleClick}
            disabled={isGenerating || disabled}
            aria-label={`Tạo ${label} bằng AI`}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-[150%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
            {isGenerating ? (
                <span className="flex items-center gap-1.5 relative z-10">
                    <Spinner className="h-3.5 w-3.5 text-purple-600" />
                    <span>Đang xử lý...</span>
                </span>
            ) : (
                <span className="flex items-center gap-1.5 relative z-10">
                    <Wand2 className="w-3.5 h-3.5" />
                    Tạo bằng AI
                </span>
            )}
        </Button>
    );
};

export const AIGenerationButton = memo(AIGenerationButtonComponent);
AIGenerationButton.displayName = 'AIGenerationButton';