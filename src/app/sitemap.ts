import { MetadataRoute } from 'next';
import { db } from '@/server/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!baseUrl) {
        throw new Error("Missing NEXT_PUBLIC_APP_URL environment variable for sitemap generation.");
    }

    const blogs = await db.blog.findMany({
        select: {
            slug: true,
            updatedAt: true,
            canonicalUrl: true,
        },
        orderBy: { updatedAt: 'desc' },
    }).catch(error => {
        console.error("Blog fetch error:", error);
        return [];
    });

    // Only include the canonical URL for each blog post.
    // If canonicalUrl points to an external domain, skip it — only include internal URLs.
    const seenUrls = new Set<string>();
    const blogEntries: MetadataRoute.Sitemap = [];

    for (const blog of blogs) {
        const internalUrl = `${baseUrl}/blog/${blog.slug}`;
        const canonicalUrl = blog.canonicalUrl;

        // Determine the URL to put in the sitemap:
        // - If no canonical set, use the standard slug URL
        // - If canonical is internal (same domain), use the canonical
        // - If canonical is external (different domain), use the standard slug URL
        let sitemapUrl = internalUrl;
        if (canonicalUrl) {
            const isInternal = canonicalUrl.startsWith(baseUrl) || canonicalUrl.startsWith('/');
            if (isInternal) {
                sitemapUrl = canonicalUrl.startsWith('/') ? `${baseUrl}${canonicalUrl}` : canonicalUrl;
            }
            // If canonical is external, we still include our page URL in the sitemap
        }

        // Deduplicate — don't include the same URL twice
        if (seenUrls.has(sitemapUrl)) continue;
        seenUrls.add(sitemapUrl);

        blogEntries.push({
            url: sitemapUrl,
            lastModified: blog.updatedAt || new Date(),
            priority: 0.8,
            changeFrequency: 'weekly' as const,
        });
    }

    // Static pages — all publicly indexable pages on the site
    const staticUrls: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/tags`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/landing`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/faqs`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ];

    return [
        ...staticUrls,
        ...blogEntries,
    ];
}