import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  
  const securityDisallow = [
    '/api/',
    '/auth/',
    '/dashboard/',
    '/new-post/',
    '/admin/',
  ];

  const contentDisallow = [
    '/private/',
    '/test/',
    '/tmp/',
    '/preview/',
  ];

  const crawlerSpecificDisallow = [
    '/drafts/',
    '/internal/',
  ];

  const defaultRules = {
    userAgent: '*',
    allow: '/',
    disallow: [
      ...securityDisallow,
      ...contentDisallow,
    ],
  };

  if (!baseUrl) {
    console.warn("NEXT_PUBLIC_SITE_URL is not defined. Using default robots config.");
    return { rules: defaultRules };
  }

  return {
    rules: [
      defaultRules,
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          ...securityDisallow,
          ...crawlerSpecificDisallow,
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          ...securityDisallow,
          ...crawlerSpecificDisallow,
          '/archive/',
        ],
        crawlDelay: 5,
      },
      {
        userAgent: 'coccocbot',
        allow: '/',
        disallow: [
          ...securityDisallow,
          ...crawlerSpecificDisallow,
          '/vip/',
        ],
        crawlDelay: 10, 
      }
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
    ],
    host: baseUrl,
  };
}