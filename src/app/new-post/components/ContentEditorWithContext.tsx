'use client';
import React, { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { HelpCircle } from 'lucide-react';
import { generateEnhanceContentBlogForSEO } from '@/lib/action';
import { processMarkdownImages } from '@/lib/uploadImageUrl';

const ContextMenu = dynamic(() => import('@/components/ui/context-menu').then(mod => ({ default: mod.ContextMenu })));
const ContextMenuContent = dynamic(() => import('@/components/ui/context-menu').then(mod => ({ default: mod.ContextMenuContent })));
const ContextMenuItem = dynamic(() => import('@/components/ui/context-menu').then(mod => ({ default: mod.ContextMenuItem })));
const ContextMenuTrigger = dynamic(() => import('@/components/ui/context-menu').then(mod => ({ default: mod.ContextMenuTrigger })));
const EditorWrapper = dynamic(() => import('./EditorWrapper').then(mod => ({ default: mod.EditorWrapper })));
const AIGenerationButton = dynamic(() => import('./AIGenerationButton').then(mod => ({ default: mod.AIGenerationButton })));
const Tooltip = dynamic(() => import('@/components/ui/tooltip').then(mod => ({ default: mod.Tooltip })));
const TooltipContent = dynamic(() => import('@/components/ui/tooltip').then(mod => ({ default: mod.TooltipContent })));
const TooltipProvider = dynamic(() => import('@/components/ui/tooltip').then(mod => ({ default: mod.TooltipProvider })));
const TooltipTrigger = dynamic(() => import('@/components/ui/tooltip').then(mod => ({ default: mod.TooltipTrigger })));

interface ContentEditorWithContextProps {
    content: string;
    onContentChange: (value: string | undefined) => void;
    readTime: number;
    isGeneratingEnhanceContent?: boolean;
    setIsGeneratingEnhanceContent?: React.Dispatch<React.SetStateAction<boolean>>;
    modelAi?: string;
}

export const ContentEditorWithContext: React.FC<ContentEditorWithContextProps> = ({
    content,
    onContentChange,
    readTime,
    isGeneratingEnhanceContent = false,
    setIsGeneratingEnhanceContent = () => {},
    modelAi,
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
            const generated = await generateEnhanceContentBlogForSEO(content,modelAi);
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
        <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between h-9">
                <Label htmlFor="content-editor" id="content-editor-label" className="flex items-center gap-1.5 text-base font-semibold text-gray-800">
                    Nội dung <span className="text-red-500">*</span>
                    <span className="text-[11px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full ml-2">(~{readTime} phút đọc)</span>
                </Label>
                
                <div className="flex items-center gap-3">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button 
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-3 text-xs font-medium text-gray-600 hover:text-gray-900 border-gray-200 hover:bg-gray-50 rounded-full transition-all flex items-center gap-1.5"
                                    onClick={handleContentChangeWithImageProcessing}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? 'Đang xử lý...' : 'Xử lý URL ảnh'}
                                    <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[300px] text-xs">
                                <p>Tự động tải lên các ảnh bên ngoài (link http) vào Cloudinary để tối ưu tốc độ tải trang.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    
                    <div className="h-4 w-[1px] bg-gray-200 mx-1"></div>

                    <AIGenerationButton
                        label="Cải thiện nội dung"
                        action={handlegenerateEnhanceContentBlogForSEO}
                        isGenerating={isGeneratingEnhanceContent}
                        setIsGenerating={setIsGeneratingEnhanceContent}
                        contentForAI={content}
                        modelAi={modelAi}
                        requiresContent={false}
                    />
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