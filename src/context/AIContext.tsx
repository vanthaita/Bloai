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
    id: 'qwen-3-235b-a22b-instruct-2507',
    name: 'Cerebras Qwen 3 235B',
    description: 'Mô hình hiệu năng cao trên nền tảng Cerebras, chuyên xử lý suy luận nhanh, ngữ cảnh sâu và tối ưu hóa SEO mạnh mẽ.',
    maxTokens: 8192,
    bestFor: ['Fast Inference', 'SEO Optimization', 'Content Generation'],
    useCase: ['Generate SEO meta tags', 'Enhance blog content', 'Fast content summarization'],
  }
];

export const AIProvider = ({ children }: { children: ReactNode }) => {
    const [selectedModel, setSelectedModel] = useState<string>('qwen-3-235b-a22b-instruct-2507');
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