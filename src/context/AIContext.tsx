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
    id: 'gemini-2.5-flash-preview-04-17',
    name: 'Gemini 2.5 Flash Preview 04-17',
    description: 'Model nhanh nhất cho các tác vụ đơn giản, phù hợp xử lý số lượng lớn dữ liệu (ví dụ: nhiều file PDF), tác vụ độ trễ thấp, khối lượng lớn cần suy nghĩ, và các ứng dụng agentic.',
    maxTokens: 1048576,
    bestFor: ['Large scale processing', 'Low latency, high volume tasks', 'Agentic use cases'],
    useCase: ['Reason over complex problems', 'Show the thinking process of the model', 'Call tools natively'],
    knowledgeCutoff: 'Jan 2025',
    rateLimit: 1000,
    freeRateLimit: { rpm: 10, reqPerDay: 500 },
    inputPrice: 0.15,
    outputPrice: 3.50,
  },
  {
    id: 'gemini-2.5-pro-preview-03-25',
    name: 'Gemini 2.5 Pro Preview 03-25',
    description: 'Model mạnh mẽ cho các tác vụ phức tạp như lập trình, suy luận, và hiểu đa phương thức.',
    maxTokens: 1048576, 
    bestFor: ['Coding', 'Reasoning', 'Multimodal understanding'],
    useCase: ['Reason over complex problems', 'Tackle difficult code, math and STEM problems', 'Use the long context for analyzing large datasets, codebases or documents'],
    knowledgeCutoff: 'Jan 2025',
    rateLimit: 150,
    freeRateLimit: { rpm: 5, reqPerDay: 25 },
    inputPrice: 1.25,
    outputPrice: 10.00,
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    description: 'Model phù hợp cho hiểu đa phương thức, streaming realtime, và sử dụng công cụ gốc.',
    maxTokens: 1048576,
    bestFor: ['Multimodal understanding', 'Realtime streaming', 'Native tool use'],
    useCase: ['Process 10,000 lines of code', 'Call tools natively, like Search', 'Stream images and video in realtime'],
    knowledgeCutoff: 'Aug 2024',
    rateLimit: 2000,
    freeRateLimit: { rpm: 15, reqPerDay: 1500 },
    inputPrice: 0.10,
    outputPrice: 0.40,
  },
  {
    id: 'gemini-2.0-flash-lite',
    name: 'Gemini 2.0 Flash-Lite',
    description: 'Model phù hợp cho ngữ cảnh dài, streaming realtime, và sử dụng công cụ gốc.',
    maxTokens: 1048576,
    bestFor: ['Long Context', 'Realtime streaming', 'Native tool use'],
    useCase: ['Process 10,000 lines of code', 'Call tools natively', 'Stream images and video in realtime'],
    knowledgeCutoff: 'Aug 2024',
    rateLimit: 4000,
    freeRateLimit: { rpm: 30, reqPerDay: 1500 },
    inputPrice: 0.075,
    outputPrice: 0.30,
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    description: 'Model nhanh nhất cho các tác vụ đơn giản, phù hợp xử lý hình ảnh, video, và âm thanh.',
    maxTokens: 1000000,
    bestFor: ['Image understanding', 'Video understanding', 'Audio understanding'],
    useCase: ['Process 3,000 images at a time', 'Look through 1 hour long videos', 'Listen to hours of audio'],
    knowledgeCutoff: 'Sep 2024',
    rateLimit: 2000,
    freeRateLimit: { rpm: 15, reqPerDay: 1500 },
    inputPrice: 0.075,
    outputPrice: 0.30,
  },
  {
    id: 'gemini-1.5-flash-8b',
    name: 'Gemini 1.5 Flash-8B',
    description: 'Model có độ trễ thấp, đa ngôn ngữ, và tóm tắt tốt.',
    maxTokens: 1000000,
    bestFor: ['Low latency', 'Multilingual', 'Summarization'],
    useCase: ['Realtime data transformation', 'Realtime translation', 'Summarize 8 average length English novels worth of text'],
    knowledgeCutoff: 'Sep 2024',
    rateLimit: 4000,
    freeRateLimit: { rpm: 15, reqPerDay: 1500 },
    inputPrice: 0.0375,
    outputPrice: 0.15,
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    description: 'Model có độ trễ thấp, đa ngôn ngữ, và tóm tắt tốt.',
    maxTokens: 2000000,
    bestFor: ['Low latency', 'Multilingual', 'Summarization'],
    useCase: ['Realtime data transformation', 'Realtime translation', 'Summarize 8 average length English novels worth of text'],
    knowledgeCutoff: 'Sep 2024',
    rateLimit: 4000,
    freeRateLimit: { rpm: 15, reqPerDay: 1500 },
    inputPrice: 0.0375,
    outputPrice: 0.15,
  },
];



export const AIProvider = ({ children }: { children: ReactNode }) => {
    const [selectedModel, setSelectedModel] = useState<string>('gemini-1.5-flash');
    const [isModelLoading, setIsModelLoading] = useState(false);
    console.log(selectedModel)
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