import { MetadataRoute } from 'next';
import { db } from '@/server/db'; 

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!baseUrl) {
        throw new Error("Missing NEXT_PUBLIC_SITE_URL environment variable for sitemap generation.");
    }

    type SitemapBlog = {
        slug: string;
        updatedAt: Date;
    };

    let blogs: SitemapBlog[] = [];
    try {
        blogs = await db.blog.findMany({
        select: {
            slug: true,       
            updatedAt: true,  
        },
        orderBy: {
            updatedAt: 'desc', 
        },
        });
    } catch (error) {
        console.error("Failed to fetch blogs for sitemap:", error);
        return []; 
    }

    const blogUrls = blogs.map((blog) => ({
        url: `${baseUrl}/blog/${blog.slug}`, 
        lastModified: blog.updatedAt,   
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    const staticUrls: MetadataRoute.Sitemap = [
        {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 1.0,
        },
        {
        url: `${baseUrl}/landing`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.9,
        },
    ];
  return [...staticUrls, ...blogUrls];
}