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
} from '@/lib/gemini'
import { db } from '@/server/db'

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

export async function generateMetaDescription(content: string) {
  if (!content) return '';
  return await aiGenerateMetaDescription(content.slice(0, 5000));
}

export async function generateSEOKeywords(content: string) {
  if (!content) return '';
  
  const existingKeywords = await getExistingKeywords();
  const generated = await aiGenerateSEOKeywords(content.slice(0, 5000), existingKeywords); 
  generatedKeywordsCache = generated || '';
  return generated;
}

export async function generateOpenGraphTitle(content: string) {
  if (!content) return '';
  return await aiGenerateOpenGraphTitle(content.slice(0, 5000), generatedKeywordsCache);
}

export async function generateOpenGraphDescription(content: string) {
  if (!content) return '';
  return await aiGenerateOpenGraphDescription(content.slice(0, 5000), generatedKeywordsCache);
}

export async function generateTitleBlog(content: string) {
  if (!content) return '';
  return await aiGenerateTitleBlog(content.slice(0, 5000), generatedKeywordsCache);
}

export async function generateExcerpt(content: string) {
  if (!content) return '';
  return await aiGenerateExcerpt(content.slice(0, 5000), generatedKeywordsCache);
}

export async function generateEnhanceContentBlogForSEO(content: string) {
  if (!content) return '';
  
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    
    const contentToProcess = content.length > 10000 
      ? content.slice(0, 5000) + '...' + content.slice(-5000)
      : content;

    const generated = await aiEnhanceContentBlogForSEO(contentToProcess, {
      signal: controller.signal
    });
    
    clearTimeout(timeout);
    return generated;
  } catch (error) {
    console.error('Content generation failed:', error);
    return content;
  }
}

export async function generateFactAndknowledge(title: string) {
  if (!title) return '';
  return await aiGenerateFactAndknowledge(title.slice(0, 200));
}