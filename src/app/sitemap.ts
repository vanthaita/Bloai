import { MetadataRoute } from 'next';
import { db } from '@/server/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!baseUrl) {
        throw new Error("Missing NEXT_PUBLIC_SITE_URL environment variable for sitemap generation.");
    }

    const [blogs, tags, featuredBlogs, authors] = await Promise.all([
        db.blog.findMany({
            select: {
                slug: true,
                updatedAt: true,
                featured: true,
            },
            orderBy: { updatedAt: 'desc' },
        }).catch(error => {
            console.error("Blog fetch error:", error);
            return [];
        }),
        
        db.tag.findMany({
            select: { name: true }, 
        }).catch(error => {
            console.error("Tag fetch error:", error);
            return [];
        }),

        db.blog.findMany({
            where: { featured: true },
            select: { slug: true, updatedAt: true },
        }).catch(error => {
            console.error("Featured blogs fetch error:", error);
            return [];
        }),

        db.user.findMany({
            select: { id: true }, 
        }).catch(error => {
            console.error("Authors fetch error:", error);
            return [];
        }),
    ]);

    const generateEntries = (
        items: Array<{ 
            slug?: string
            name?: string 
            id?: string 
            updatedAt?: Date 
            featured?: boolean 
        }>,
        path: string,
        priority: number,
        changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'weekly'
    ) => items.map(item => ({
        url: `${baseUrl}/${path}/${item.slug || item.name || item.id}`,
        lastModified: item.updatedAt || new Date(), 
        priority,
        changeFrequency,
    }));
    const staticUrls: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/landing`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/categories`,
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
    ];

    return [
        ...staticUrls,
        ...generateEntries(blogs, 'blog', 0.8),
        ...generateEntries(featuredBlogs, 'blog', 0.85),
        ...generateEntries(tags, 'tags', 0.7),
        ...generateEntries(authors, 'author', 0.6, 'monthly'),
    ];
}