const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
const { Blob } = require('buffer'); 
const os = require("os");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API);
import { uploadImageToCloudinary } from './uploadImageUrl';
import { aiEnhanceContentBlogForSEO } from './gemini';

interface ImageGenerationOptions {
  prompt: string;
  model?: string;
  fileName?: string;
  thinkingBudget?: number;
  cloudinaryOptions?: {
    quality?: number | 'auto';
    width?: number;
    format?: 'webp' | 'auto';
  };
}

interface BlogGenerationResult {
  content: string;
  images?: {
    prompt: string;
    url: string;
  }[];
}

export async function aiGenerateImage(
  prompt: string,
  options: {}
): Promise<{ url: string; markdown: string }> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp-image-generation",
    generationConfig: {
      responseModalities: ["Text", "Image"]
    }
  });

  let imageUrl = '';
  let markdown = '';
  let tempFilePath = '';

  try {
    const enhancedPromptDefault = `
    **TECHNICAL IMAGE GENERATION SPECIFICATION**

    1. **CORE REQUIREMENTS**:
      - Output Format: PNG with transparent background (when applicable)
      - Resolution: 1920x1080 (16:9) or 1200x630 (social media) based on context
      - Color Profile: sRGB IEC61966-2.1
      - DPI: 300 for print-ready quality
      - Noise Level: <3% in flat color areas

    2. **TECHNICAL COMPOSITION**:
      - Subject Focus: Primary element must occupy 60-70% of frame
      - Rule of Thirds: Key elements aligned to intersection points
      - Negative Space: Minimum 20% for text/UI elements when needed
      - Depth of Field: f/2.8 to f/8 equivalent for optimal focus

    3. **STYLE PARAMETERS**:
      - Default: Photorealistic rendering
      - Alternative Styles (if specified):
        * Technical Diagram: Isometric 3D with 0.5px stroke
        * Infographic: Flat design with material shadows
        * UI Mockup: Modern skeuomorphic with subtle gradients
      - Texture: Subtle noise/grain (2-3% opacity) to avoid artificial look

    4. **TEXT HANDLING (STRICT)**:${
      prompt.includes('text') || prompt.includes('label') ? `
      - Font Family: 'Inter' or 'SF Pro' style (clean tech aesthetic)
      - Font Weight: Medium (500) for body, Bold (700) for headings
      - Contrast Ratio: Minimum 4.5:1 against background
      - Padding: 10% minimum around text elements
      - Anti-aliasing: Subpixel rendering enabled` : `
      - NO TEXT ELEMENTS unless explicitly requested in prompt`
    }

    5. **TECHNICAL LIGHTING**:
      - Three-point lighting setup (key: 6500K, fill: 5500K, back: 4500K)
      - Shadow Detail: Maintain texture in darkest areas (RGB > 15,15,15)
      - Highlight Control: No blown-out areas (RGB < 245,245,245)

    6. **COLOR SCIENCE**:
      - Gamut: Full sRGB coverage
      - Black Point: RGB 15,15,15 minimum
      - White Point: RGB 245,245,245 maximum
      - Vibrance: +10-15% over natural for digital appeal

    7. **QUALITY CONTROL**:
      - Edge Definition: No visible pixelation at 200% zoom
      - Compression: Lossless encoding
      - Artifact Inspection: Zero JPEG-like artifacts
      - Banding Test: Smooth gradients (256+ steps)

    8. **CONTEXTUAL INTERPRETATION**:
      - Tech Products: Show accurate port/button placement
      - Code Visualizations: Use industry-standard syntax highlighting
      - Data Visualizations: Follow WCAG 2.1 contrast guidelines

    **USER PROMPT ANALYSIS**:
    "${prompt}"

    **EXECUTION PARAMETERS**:
    1. Priority: Technical Accuracy (70%) > Aesthetic Quality (30%)
    2. Literal Interpretation Score: ${calculateLiteralInterpretationScore(prompt)}/10
    3. Safety Filter: Active (NSFW probability <0.1%)
    4. Region Lock: EN-US locale settings

    **OUTPUT VALIDATION**:
    - Verify against technical specifications above
    - Confirm no hallucinated elements
    - Ensure brand-safe composition
    `;

    function calculateLiteralInterpretationScore(prompt: string): number {
      const techKeywords = ['diagram', 'screenshot', 'architecture', 'code'];
      return techKeywords.some(kw => prompt.includes(kw)) ? 9 : 6;
    }

    const response = await model.generateContent(prompt);
    
    for (const part of response.response.candidates[0].content.parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, "base64");
        
        const tempDir = path.join(os.tmpdir(), 'bloai-images');
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
        }
        
        const fileName = `temp-image-${Date.now()}.png`;
        tempFilePath = path.join(tempDir, fileName);
        
        await fs.promises.writeFile(tempFilePath, buffer);
        
        // const fileStats = await fs.promises.stat(tempFilePath);
        
        const blob = new Blob([buffer], { type: 'image/png' });
        const file = new File([blob], fileName, {
          type: 'image/png',
          lastModified: Date.now()
        });
        const uploadResult = await uploadImageToCloudinary(file, options);
        imageUrl = uploadResult as string;
        markdown = `![${prompt}](${uploadResult})`;
      }
    }
    return { url: imageUrl, markdown };
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  } finally {
    if (tempFilePath) {
      try {
        if (fs.existsSync(tempFilePath)) {
          await fs.promises.unlink(tempFilePath);
          console.log(`Temporary file ${tempFilePath} deleted`);
        }
      } catch (err) {
        console.error(`Error deleting temporary file: ${err}`);
      }
    }
  }
}

async function processImagePrompts(
  content: string,
  options: {
    signal?: AbortSignal;
    imageOptions?: Partial<ImageGenerationOptions>;
  } = {}
) {
  const imagePromptRegex = /!\[(.*?)\]\((.*?)\)/g;
  const matches = [...content.matchAll(imagePromptRegex)];
  let processedContent = content;

  for (const match of matches) {
    const [fullMatch, altText, prompt] = match;
    
    try {
      const { url } = await aiGenerateImage(prompt as string, {
        quality: 'auto',
        format: 'webp',
        width: 1200,
        ...options.imageOptions
      });

      if (url) {
        processedContent = processedContent.replace(
          fullMatch, 
          `![${altText}](${url})`
        );
      }
    } catch (error) {
      console.error(`Failed to process image prompt: ${prompt}`, error);
      processedContent = processedContent.replace(
        fullMatch,
        `![${altText}](${prompt})`
      );
    }
  }

  return processedContent;
}

export const generateCompleteBlogPost = async (
  content: string,
  options: {
    signal?: AbortSignal;
    imageOptions?: Partial<ImageGenerationOptions>;
  } = {}
) => {
  try {
    const seoContent = await aiEnhanceContentBlogForSEO(content, { 
      signal: options.signal || new AbortController().signal 
    });

    if (!seoContent) {
      throw new Error('Failed to generate SEO content');
    }

    return await processImagePrompts(seoContent, options);
  } catch (error) {
    console.error('Error generating complete blog post:', error);
    throw error;
  }
};

