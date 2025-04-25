'use server'
import {
    aiGenerateMetaDescription,
    aiGenerateSEOKeywords,
    aiGenerateOpenGraphTitle,
    aiGenerateOpenGraphDescription,
    aiGenerateTitleBlog,
    aiGenerateExcerpt,
    aiEnhanceContentBlogForSEO,
    aiGenerateFactAndknowledge,
    aiGeneratePromptForImage,
} from '@/lib/gemini'
import { db } from '@/server/db'
import { aiGenerateImage } from './image-gemini';

let generatedKeywordsCache: string = '';

async function getExistingKeywords() {
    try {
        const tagsList = await db.tag.findMany({
            select: { name: true },
            take: 100
        });
        return tagsList.map(tag => tag.name);
    } catch (error) {
        console.error('Failed to fetch tags:', error);
        return [];
    }
}

export async function generateMetaDescription(content: string, modelAi?: string) {
    if (!content) return '';
    return await aiGenerateMetaDescription(content.slice(0, 5000), generatedKeywordsCache, modelAi);
}

export async function generateSEOKeywords(content: string, modelAi?: string) {
    if (!content) return '';

    const existingKeywords = await getExistingKeywords();
    const generated = await aiGenerateSEOKeywords(content.slice(0, 5000), existingKeywords, modelAi);
    generatedKeywordsCache = generated || '';
    return generated;
}

export async function generateOpenGraphTitle(content: string, modelAi?: string) {
    if (!content) return '';
    return await aiGenerateOpenGraphTitle(content.slice(0, 5000), generatedKeywordsCache, modelAi);
}

export async function generateOpenGraphDescription(content: string, modelAi?: string) {
    if (!content) return '';
    return await aiGenerateOpenGraphDescription(content.slice(0, 5000), generatedKeywordsCache, modelAi);
}

export async function generateTitleBlog(content: string, modelAi?: string) {
    if (!content) return '';
    return await aiGenerateTitleBlog(content.slice(0, 5000), generatedKeywordsCache, modelAi);
}

export async function generateExcerpt(content: string, modelAi?: string) {
    if (!content) return '';
    return await aiGenerateExcerpt(content.slice(0, 5000), generatedKeywordsCache, modelAi);
}

export async function generateEnhanceContentBlogForSEO(content: string, modelAi?: string) {
    if (!content) return '';

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 25000);

        const contentToProcess = content.length > 10000
            ? content.slice(0, 5000) + '...' + content.slice(-5000)
            : content;

        const generated = await aiEnhanceContentBlogForSEO(contentToProcess, {
            signal: controller.signal
        }, modelAi);
        clearTimeout(timeout);
        return generated;
    } catch (error) {
        console.error('Content generation failed:', error);
        return content;
    }
}

export async function generateFactAndknowledge(title: string, modelAi?: string) {
    if (!title) return '';
    return await aiGenerateFactAndknowledge(title.slice(0, 200), modelAi);
}

export async function generateImage(content: string, modelAi?: string): Promise<string | undefined> {
    if (!content) return undefined;

    try {
        const promptContent = await aiGeneratePromptForImage(content,modelAi);
        if (!promptContent) {
            throw new Error("Failed to generate image prompt");
        }
        console.log("Prompt: ",promptContent);
        const { url } = await aiGenerateImage(promptContent, {
            quality: 'auto',
            format: 'webp',
            width: 1200,
        });
        if (!url) {
            throw new Error("Image generation failed");
        }
        return url;
    } catch (error) {
        console.error("Error generating image:", error);
        return undefined;
    }
}