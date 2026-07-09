import { MetadataRoute } from 'next';
import { db } from '@/server/db';
import { getCanonicalBlogUrl, getCanonicalSiteUrl } from '@/lib/seo-url';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = getCanonicalSiteUrl();

    const blogs = await db.blog.findMany({
        select: {
            slug: true,
            updatedAt: true,
            canonicalUrl: true,
            content: true,
            imageUrl: true,
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
        if (!blog.content?.trim() || !blog.imageUrl?.trim()) continue;

        const sitemapUrl = getCanonicalBlogUrl(blog.slug, blog.canonicalUrl);

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
