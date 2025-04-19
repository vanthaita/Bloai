'use server'
import {
    // aiGenerateSEOTags,
    aiGenerateMetaDescription,
    aiGenerateSEOKeywords,
    aiGenerateOpenGraphTitle,
    aiGenerateOpenGraphDescription,
    aiGenerateTitleBlog,
    aiGenerateExcerpt,
    aiEnhanceContentBlogForSEO,
    aiGenerateHtmlForEmail,
} from '@/lib/gemini'
import { db } from '@/server/db'
import { BlogNotificationProps } from './notifySubscribers'

export async function generateMetaDescription(content: string) {
  const generated = await aiGenerateMetaDescription(content)
  return generated
}

// export async function generateSEOTags(content: string) {
//   const generated = await aiGenerateSEOTags(content)
//   return generated
// }

let generatedKeywords: string = '';
export async function generateSEOKeywords(content: string) {
  const tagsList = db.tag.findMany();
  const existingKeywords = (await tagsList).map((tag) => {
    return tag.name;
  });
  const generated = await aiGenerateSEOKeywords(content, existingKeywords); 
  generatedKeywords = generated || ''
  console.log(generatedKeywords)
  return generated;
}


export async function generateOpenGraphTitle(content: string) {
  const generated = await aiGenerateOpenGraphTitle(content, generatedKeywords)
  return generated
}

export async function generateOpenGraphDescription(content: string) {
  const generated = await aiGenerateOpenGraphDescription(content,generatedKeywords)
  return generated
}

export async function generateTitleBlog(content: string) {
  const generated = await aiGenerateTitleBlog(content,generatedKeywords)
  return generated
}

export async function generateExcerpt(content: string) {
  const generated = await aiGenerateExcerpt(content,generatedKeywords)
  return generated
}
export async function generateEnhanceContentBlogForSEO(content: string) {
  const generated = await aiEnhanceContentBlogForSEO(content);
  return generated
}

export async function generateHtmlForEmail(dataEmail: BlogNotificationProps) {
  const generated = await aiGenerateHtmlForEmail(dataEmail);
  console.log(generated);
  return generated
}