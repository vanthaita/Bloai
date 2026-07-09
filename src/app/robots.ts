import { MetadataRoute } from 'next';
import { getCanonicalSiteUrl } from '@/lib/seo-url';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getCanonicalSiteUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/new-post/',
          '/admin/',
          '/unsubscribe/',
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
