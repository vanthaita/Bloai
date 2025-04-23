import axios from 'axios';
import { env } from '@/env';

function isValidImageUrl(url: string): boolean {
  return /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(url) && 
         (/\.(png|jpg|jpeg|gif|webp|svg)(\?.*)?$/i.test(url) || 
          /\/image\/|\.(jpg|png|gif)(\?|$)|%2F(image|img)/i.test(url));
}
function transformCloudinaryUrl(url: string, options: {
    quality?: number | 'auto';
    width?: number;
    format?: 'webp' | 'auto';
  }): string {
    const urlParts = url.split('/upload/');
    const transformations: string[] = [];
  
    if (options.quality) transformations.push(`q_${options.quality}`);
    if (options.format) transformations.push(`f_${options.format}`);
    if (options.width) transformations.push(`w_${options.width}`);
  
    const transformationString = transformations.join(',');
  
    return `${urlParts[0]}/upload/${transformationString}/${urlParts[1]}`;
  }
  
export async function uploadImageToCloudinary(
    imageUrl: string,
    options: {
      quality?: number | 'auto';
      width?: number;
      format?: 'webp' | 'auto';
    } = {}
  ): Promise<string | null> {
    console.debug(`[uploadImageToCloudinary] Starting upload for ${imageUrl}`);
    
    if (!isValidImageUrl(imageUrl)) {
      console.warn(`[uploadImageToCloudinary] Invalid image URL: ${imageUrl}`);
      return null;
    }
  
    if (!env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
      console.error('[uploadImageToCloudinary] Missing Cloudinary configuration!');
      return null;
    }
  
    try {
      const payload = {
        file: imageUrl,
        upload_preset: env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      };
  
      const apiUrl = `https://api.cloudinary.com/v1_1/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
      const response = await axios.post(apiUrl, payload);
  
      if (!response.data?.secure_url) {
        console.warn('[uploadImageToCloudinary] No secure_url in response');
        return null;
      }
  
      const { secure_url, public_id } = response.data;
  
      const transformedUrl = transformCloudinaryUrl(secure_url, {
        quality: options.quality,
        format: options.format,
        width: options.width,
      });
  
      return transformedUrl;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('[uploadImageToCloudinary] Axios Error:', {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          responseData: error.response?.data,
          config: {
            url: error.config?.url,
            data: error.config?.data
          }
        });
      } else {
        console.error('[uploadImageToCloudinary] Unexpected Error:', error);
      }
      return null;
    }
  }
  

export async function processMarkdownImages(content: string): Promise<{
  processedContent: string;
  failedUrls: string[];
}> {
  console.debug('[processMarkdownImages] Starting processing');
  
  if (!content) {
    return { processedContent: content, failedUrls: [] };
  }

  const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
  const matches = [...content.matchAll(imageRegex)];
  let processedContent = content;
  const failedUrls: string[] = [];
  const processedUrls = new Map<string, string>();

  console.debug(`[processMarkdownImages] Found ${matches.length} images`);

  for (const match of matches) {
    const [fullMatch, altText, imageUrl] = match;
    
    try {
      if (!imageUrl) continue;
      if (imageUrl.startsWith('data:')) continue;
      if (imageUrl.includes('res.cloudinary.com')) continue;

      console.debug(`[processMarkdownImages] Processing: ${imageUrl}`);

      let newUrl = processedUrls.get(imageUrl);
      if (!newUrl) {
        newUrl = await uploadImageToCloudinary(imageUrl, {
          quality: 'auto',
          format: 'webp',
          width: 1200,
        }) as string;
        if (newUrl) processedUrls.set(imageUrl, newUrl);
      }

      if (newUrl) {
        processedContent = processedContent.replace(
          fullMatch,
          `![${altText}](${newUrl})`
        );
      } else {
        failedUrls.push(imageUrl);
        console.warn(`[processMarkdownImages] Failed to process: ${imageUrl}`);
      }
    } catch (error) {
      failedUrls.push(imageUrl!);
      console.error(`[processMarkdownImages] Error processing ${imageUrl}:`, error);
    }
  }

  console.debug('[processMarkdownImages] Completed', {
    processed: processedUrls.size,
    failed: failedUrls.length
  });

  return {
    processedContent,
    failedUrls,
  };
}