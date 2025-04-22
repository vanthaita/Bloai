'use client';
import React, { useCallback, useState } from 'react';
import { Label } from '@/components/ui/label';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { EditorWrapper } from './EditorWrapper';
import { AIGenerationButton } from './AIGenerationButton';
import { generateEnhanceContentBlogForSEO } from '@/lib/action';
import { processMarkdownImages } from '@/lib/uploadImageUrl';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface ContentEditorWithContextProps {
    content: string;
    onContentChange: (value: string | undefined) => void;
    readTime: number;
    isGeneratingEnhanceContent?: boolean;
    setIsGeneratingEnhanceContent?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ContentEditorWithContext: React.FC<ContentEditorWithContextProps> = ({
    content,
    onContentChange,
    readTime,
    isGeneratingEnhanceContent = false,
    setIsGeneratingEnhanceContent = () => {},
}) => {
    const [isProcessing,setIsProcessing] = useState(false); 
    const insertMarkdown = useCallback((format: string) => {
        const examples: Record<string, string> = {
            bold: '**chữ đậm**', italic: '*chữ nghiêng*', link: '[tiêu đề](https://)',
            code: '`mã`', image: '![alt](https://)', list: '\n- Mục danh sách',
        };
        onContentChange((content ?? '') + ` ${examples[format] ?? ''}`);
    }, [onContentChange, content]);
    const handlegenerateEnhanceContentBlogForSEO = async (content: string): Promise<string | null> => {
        try {
            setIsGeneratingEnhanceContent(true);
            const generated = await generateEnhanceContentBlogForSEO(content);
            if (generated) {
                onContentChange(generated);
                return generated;
            }
            return null;
        } catch (error) {
            console.error(error);
            return null;
        } finally {
            setIsGeneratingEnhanceContent(false);
        }
    };
    const handleContentChangeWithImageProcessing = async () => {
        try {
          setIsProcessing(true);
          const processedContent = await processMarkdownImages(content);
          onContentChange(processedContent.processedContent);
          toast.success('Xử lý ảnh hoàn tất!');
        } catch (error) {
          toast.error('Có lỗi khi xử lý ảnh');
          console.error(error);
        } finally {
          setIsProcessing(false);
        }
    };
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <Label htmlFor="content-editor" id="content-editor-label" className="flex items-center gap-2 text-base">
                    Nội dung * <span className="text-sm text-muted-foreground">(~{readTime} phút đọc)</span>
                </Label>
                
                <div className="flex items-center gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button 
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="text-blue-600 hover:text-blue-700 h-auto px-2 py-1 text-xs"
                                    onClick={handleContentChangeWithImageProcessing}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? 'Đang xử lý...' : 'Xử lý URL ảnh'}
                                    <HelpCircle className="w-4 h-4 text-muted-foreground" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[300px]">
                                <p className="text-sm">
                                    Tự động chuyển đổi URL ảnh trong bài viết sang định dạng tối ưu.
                                    Hỗ trợ các URL từ các dịch vụ lưu trữ ảnh phổ biến.
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    
                    <AIGenerationButton
                        label="Nội dung"
                        action={handlegenerateEnhanceContentBlogForSEO}
                        isGenerating={isGeneratingEnhanceContent}
                        setIsGenerating={setIsGeneratingEnhanceContent}
                        contentForAI={content}
                        requiresContent={false}
                    />
                    <span className="text-xs text-gray-600 font-medium dark:text-gray-300">
                        Cải thiện chất lượng bài viết
                    </span>
                </div>
            </div>
            
            <ContextMenu>
                <ContextMenuTrigger>
                    <EditorWrapper
                        value={content}
                        onChange={onContentChange}
                        aria-labelledby="content-editor-label"
                    />
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem onSelect={() => insertMarkdown('bold')}>Đậm</ContextMenuItem>
                    <ContextMenuItem onSelect={() => insertMarkdown('italic')}>Nghiêng</ContextMenuItem>
                    <ContextMenuItem onSelect={() => insertMarkdown('link')}>Liên kết</ContextMenuItem>
                    <ContextMenuItem onSelect={() => insertMarkdown('image')}>Hình ảnh</ContextMenuItem>
                    <ContextMenuItem onSelect={() => insertMarkdown('code')}>Mã</ContextMenuItem>
                    <ContextMenuItem onSelect={() => insertMarkdown('list')}>Danh sách</ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        </div>
    );
};