'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AIModel {
  id: string;
  name: string;
  description: string;
  maxTokens: number;
  bestFor?: string[];
  useCase?: string[];
  knowledgeCutoff?: string;
  rateLimit?: number;
  freeRateLimit?: { rpm: number; reqPerDay: number };
  inputPrice?: number;
  outputPrice?: number;
}

type AIContextType = {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  availableModels: AIModel[];
  isModelLoading: boolean;
};

const AIContext = createContext<AIContextType | undefined>(undefined);
const defaultModels: AIModel[] = [
  {
    id: 'gemini-2.5-flash-lite',
    name: 'Gemini 2.5 Flash Lite',
    description: 'Mô hình siêu nhẹ và siêu nhanh, tối ưu cho tốc độ phản hồi tức thì.',
    maxTokens: 8192,
    bestFor: ['Ultra Fast Inference', 'Simple Tasks'],
    useCase: ['Generate quick SEO tags', 'Short descriptions'],
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    description: 'Mô hình nhanh và linh hoạt của Google, cân bằng tốt giữa tốc độ và độ chính xác.',
    maxTokens: 8192,
    bestFor: ['Fast Inference', 'SEO Optimization', 'Content Generation'],
    useCase: ['Generate SEO meta tags', 'Enhance blog content', 'Fast content summarization'],
  },
  {
    id: 'gemini-2.0-flash-lite',
    name: 'Gemini 2.0 Flash Lite',
    description: 'Mô hình gọn nhẹ phiên bản 2.0, tốc độ cực cao dành cho các tác vụ không quá phức tạp.',
    maxTokens: 8192,
    bestFor: ['High Speed Inference'],
    useCase: ['Quick keyword extraction', 'Short text generation'],
  },
  {
    id: 'gemini-flash-latest',
    name: 'Gemini Flash Latest',
    description: 'Bản Flash mới nhất được Google cập nhật tự động.',
    maxTokens: 8192,
    bestFor: ['Latest Features', 'Fast Inference'],
    useCase: ['General AI generation'],
  },
  {
    id: 'gemini-3.1-flash-lite-preview',
    name: 'Gemini 3.1 Flash Lite Preview',
    description: 'Bản thử nghiệm 3.1 siêu tốc, công nghệ mới nhất.',
    maxTokens: 8192,
    bestFor: ['Cutting-edge Speed'],
    useCase: ['Experimental fast generation'],
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    description: 'Mô hình mạnh mẽ của Google cho các tác vụ suy luận phức tạp và tạo nội dung chuyên sâu.',
    maxTokens: 8192,
    bestFor: ['Complex Reasoning', 'Deep Content Analysis', 'Advanced SEO'],
    useCase: ['Generate complex articles', 'Deep SEO analysis', 'Fact checking'],
  }
];

export const AIProvider = ({ children }: { children: ReactNode }) => {
    const [selectedModel, setSelectedModel] = useState<string>('gemini-2.5-flash-lite');
    const [isModelLoading, setIsModelLoading] = useState(false);
    
    return (
        <AIContext.Provider
        value={{
            selectedModel,
            setSelectedModel,
            availableModels: defaultModels,
            isModelLoading,
        }}
        >
        {children}
        </AIContext.Provider>
    );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};