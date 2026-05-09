import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl) {
    console.warn("NEXT_PUBLIC_SITE_URL is not defined. Using default robots config.");
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: '/api/',
      },
    };
  }
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/new-post/',
        ],
      },
      // Chặn các bot thu thập dữ liệu để train AI (bảo vệ bản quyền bài viết)
      {
        userAgent: ['GPTBot', 'CCBot', 'ClaudeBot', 'anthropic-ai', 'Omgilibot', 'Omgili', 'FacebookBot', 'Bytespider'],
        disallow: '/',
      },
      // Cho phép các bot của công cụ tìm kiếm AI (để được trích dẫn nguồn và kéo traffic)
      {
        userAgent: ['PerplexityBot', 'ChatGPT-User', 'Google-Extended'],
        allow: '/',
      }
    ],
    // Only real XML sitemaps here — RSS feeds should NOT be listed as sitemaps
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-images.xml`,
    ],

  };
}