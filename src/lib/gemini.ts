import { env } from '@/env'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(env.GOOGLE_GEMINI_API)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

const generateSEOContent = async (prompt: string) => {
  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    return text.replace(/[*"]/g, '').trim()
  } catch (error) {
    console.error('AI Generation Error:', error)
    return null
  }
}

export const aiGenerateSEOTags = async (content: string) => {
  const prompt = `
    Analyze this content and generate EXACTLY 7 SEO meta tags following these STRICT rules:
    "${content}"
    
    - Format: comma-separated lowercase keywords
    - Include: 2 primary keywords (1-2 words), 3 secondary keywords (2-3 words), 2 long-tail phrases (4-5 words)
    - Optimize using TF-IDF analysis of content
    - Incorporate semantic keyword variations
    - Competitor gap analysis for untapped keywords
    - Character limit: 155-160 total
    - Exclude: explanations, markdown, numbering
    - Forbidden phrases: "best", "top", "guide"
    
    Example Output: react development, component architecture, state management, performance optimization, react hooks best practices, redux toolkit configuration
  `
  return generateSEOContent(prompt)
}

export const aiGenerateMetaDescription = async (content: string) => {
  const prompt = `
    Create ONE meta description EXCLUSIVELY meeting these REQUIREMENTS:
    "${content}"
    
    - STRICTLY enforce 157-160 character count (use CHARCOUNT tool)
    - Structure: 
      1. [Power Verb] + [Primary Keyword] + [Numerical Value] + [Benefit] (60-70 chars)
      2. [Secondary Keyword] + [Solution] + [Time Reference] (70-80 chars)
      3. [Action-Oriected CTA] (20-25 chars)
    - Power Verbs: Master|Unlock|Elevate|Transform|Optimize
    - Must include: Primary keyword in first 10 words + current year + metric percentage
    - Validation Steps:
      a. Check character count
      b. Remove filler words (very, really, basically)
      c. Replace phrases >5 words with hyphens
      d. Verify CTA exists
    - Auto-reject any output over 160 characters
    - Example SUCCESS: "Master 7 React optimization techniques reducing load times by 50%. Discover 2024 best practices for component architecture and state management. Implement now." (158 chars)
    - Example REJECTED: "Learn how to improve your React applications with various optimization methods..." (171 chars)
  `
  return generateSEOContent(prompt)
}

export const aiGenerateSEOKeywords = async (content: string) => {
  const prompt = `
    Generate EXACTLY 15 SEO keywords from content analysis:
    "${content}"
    
    - Format: comma-separated lowercase
    - Ratio: 40% short-tail (1-2 words), 40% medium-tail (3-4 words), 20% long-tail (5+ words)
    - Include: semantic LSI keywords, user intent modifiers ("how to", "tutorial"), freshness markers ("2024", "new")
    - Exclude: duplicate root keywords, brand terms
    - Prioritize: keywords with 1k-10k monthly searches (Ahrefs data)
    - Cluster related keywords by topic
    
    Example Output: react performance, optimize react components, react memoization 2024, reduce rerenders, webpack config react, lazy loading components, react concurrent mode
  `
  return generateSEOContent(prompt)
}

export const aiGenerateOpenGraphTitle = async (content: string) => {
  const prompt = `
    Generate ONE Open Graph title meeting these SPECS:
    "${content}"
    
    - STRICTLY enforce 68-72 character count (use CHARCOUNT tool)
    - Include: Primary keyword + secondary keyword
    - Add 1 relevant emoji (technology category)
    - Power word combo: "[Emoji] Ultimate Guide to... | Master... in 2024"
    - Title case formatting
    - Exclude: dates except current year, author names
    - Click-through trigger: question/numbers/controversial angle
    
    Example Output: 🚀 Master React Performance: 7 Optimization Techniques Developers Swear By
  `
  return generateSEOContent(prompt)
}

export const aiGenerateOpenGraphDescription = async (content: string) => {
  const prompt = `
    Create ONE Open Graph description with:
    "${content}"
    
    - Start with eyebrow text: [Category] | [Duration] Read | [Expert Level]
    - First sentence: controversial statement/industry statistic
    - Include: 3 key benefits, 1 surprising fact
    - Add 1-2 relevant emojis
    - Character limit: 185-195
    - CTA: "Click to discover..." | "Learn the secret..."
    - Exclude: generic phrases, author bios
    
    Example Output: Frontend Development | 12min Read | Expert Level 🔥 Discover why 68% of React apps suffer performance issues and 7 proven solutions we implement at tech giants. Click to transform your workflow.
  `
  return generateSEOContent(prompt)
}

export const aiGenerateTitleBlog = async (content: string) => {
  const prompt = `
    Generate ONE SEO-optimized blog title following STRICT guidelines:
    "${content}"
    
    - Include: Primary keyword + secondary keyword + power word
    - Title case with proper capitalization
    - Add current year in parentheses
    - Character range: 65-75
    - Controversial angle: "Secrets...", "Mistakes...", "Never Do..."
    - Add content qualifier: "Complete Guide" | "Step-by-Step" | "Case Study"
    - Exclude: vague adjectives, clickbait phrases
    
    Example Output: React Performance Optimization: 7 Costly Mistakes Developers Make (2024 Case Study)
  `
  return generateSEOContent(prompt)
}

export const aiSummaryContent = async (content: string) => {
  const prompt = `
    Create ONE social media summary with:
    "${content}"
    
    - Start with hook: "BREAKING: " | "ALERT: " | "NEW: "
    - Include: statistic, controversial claim, benefit list
    - Hashtag strategy: 1 industry # + 1 niche # 
    - Add emoji pair: 🚀🔥 | 💡👨💻 | ⚡🤯
    - Character limit: 240-250
    - CTA: "Retweet if..." | "Tag a developer who..."
    - Exclude: links, author mentions
    
    Example Output: BREAKING: 2024 React benchmarks reveal 7 optimization techniques cutting load times by 62% 🚀🔥 Learn the secrets big tech doesn't share. #WebDev #ReactPerformance Tag a developer who needs this!
  `
  return generateSEOContent(prompt)
}

export const aiGenerateExcerpt = async (content: string) => {
  const prompt = `
    Generate ONE blog excerpt containing:
    "${content}"
    
    - First 5 words: create urgency/time sensitivity
    - Include: 1 research statistic, 2 pain points, 3 solutions
    - Add bracket qualifier: [Updated 2024] | [Case Study]
    - Character limit: 125-135
    - Reading level: 9th grade
    - Exclude: passive voice, technical jargon
    
    Example Output: [Updated 2024] Struggling with React performance? 82% of apps suffer slow renders. Discover 7 expert-tested optimization strategies for cleaner code and faster load times.
  `
  return generateSEOContent(prompt)
}