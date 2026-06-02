import { MetadataRoute } from 'next';
import { db } from '@/server/db';

function getSitemapBlogUrl(baseUrl: string, slug: string, canonicalUrl?: string | null) {
    const selfUrl = `${baseUrl}/blog/${slug}`;

    if (!canonicalUrl) {
        return selfUrl;
    }

    try {
        const baseOrigin = new URL(baseUrl).origin;
        const parsedCanonical = new URL(canonicalUrl, baseOrigin);

        if (parsedCanonical.origin !== baseOrigin) {
            return selfUrl;
        }

        if (parsedCanonical.pathname !== `/blog/${slug}`) {
            return selfUrl;
        }

        return parsedCanonical.toString();
    } catch {
        return selfUrl;
    }
}

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
        const sitemapUrl = getSitemapBlogUrl(baseUrl, blog.slug, blog.canonicalUrl);

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
