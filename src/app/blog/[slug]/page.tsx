import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '@/trpc/server';
import BlogPostClientWrapper from './components/BlogPostClientWrapper'; 
import { Blog, SuggestedBlog } from '@/types/helper.type';
import { unstable_cache } from 'next/cache';
import Link from 'next/link';
import { db } from '@/server/db';
import { getCanonicalBlogUrl } from '@/lib/seo-url';

export const revalidate = 3600; // ISR: revalidate every hour for better performance

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
    const blogs = await db.blog.findMany({
        select: { slug: true },
        orderBy: { publishDate: 'desc' },
    }).catch((error) => {
        console.error("Failed to generate blog static params:", error);
        return [];
    });

    return blogs.map((blog) => ({
        slug: blog.slug,
    }));
}

const getCachedBlog = unstable_cache(
    async (slug: string) => {
        console.log(`*** Actually Fetching Blog for slug: ${slug} (via cache wrapper) ***`);
        return db.blog.findUnique({
            where: { slug },
            select: {
                id: true,
                title: true,
                slug: true,
                content: true,
                imageUrl: true,
                imageAlt: true,
                publishDate: true,
                updatedAt: true,
                readTime: true,
                canonicalUrl: true,
                metaDescription: true,
                ogTitle: true,
                ogDescription: true,
                ogImageUrl: true,
                authorId: true,
                tags: { select: { id: true, name: true } },
                author: { select: { id: true, name: true, image: true } },
                comments: {
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        author: { select: { id: true, name: true, image: true } },
                    },
                    orderBy: { createdAt: "desc" },
                },
            },
        });
    },
    ['blog-by-slug'], 
    {
        tags: ['blog'], 
    }
);
export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    const { slug } = await params;

    const blog = await getCachedBlog(slug);

    if (!blog) {
        notFound();
    }
    const blogUrl = getCanonicalBlogUrl(blog.slug, blog.canonicalUrl);

    const getTopKeywords = (tags: { name: string; relevance?: number }[], count = 5) => {
        if (!tags || tags.length === 0) {
            return 'AI, Technology, Machine Learning, Blog, Tutorial';
        }
        const sortedTags = [...tags].sort((a, b) => {
            if (a.relevance !== undefined && b.relevance !== undefined) {
                return b.relevance - a.relevance;
            }
            return a.name.localeCompare(b.name);
        });

        const filteredTags = sortedTags.filter(tag => {
            const lowerName = tag.name.toLowerCase();
            const genericTags = ['general', 'blog', 'article', 'post', 'tech', 'technology'];
            return !genericTags.includes(lowerName);
        });
        const prioritizedTags = filteredTags.sort((a, b) => b.name.length - a.name.length);
        const uniqueTagsMap = new Map<string, string>();
        prioritizedTags.forEach(tag => {
             if (!uniqueTagsMap.has(tag.name.toLowerCase())) {
                 uniqueTagsMap.set(tag.name.toLowerCase(), tag.name);
             }
         });
        const uniqueTags = Array.from(uniqueTagsMap.values()).slice(0, count);


        if (uniqueTags.length < count) {
            const defaultTags = ['AI', 'Machine Learning', 'Technology', 'Tutorial', 'Guide'];
            const needed = count - uniqueTags.length;
            defaultTags.forEach(tag => {
                if (uniqueTags.length < count && !uniqueTagsMap.has(tag.toLowerCase())) {
                     uniqueTags.push(tag);
                     uniqueTagsMap.set(tag.toLowerCase(), tag); 
                 }
             });
        }
        return Array.from(new Set(uniqueTags.slice(0, count).map(tag => tag.trim()))).join(', ');
    };


    const keywords = getTopKeywords(blog.tags || [], 5); 
    
    // Fallbacks and truncations for SEO
    // Template adds " | Bloai Blog" (~13 chars), so keep title ≤47 chars to stay under 60 total
    const maxTitleLength = 47;
    const truncatedTitle = blog.title.length > maxTitleLength 
        ? `${blog.title.substring(0, maxTitleLength - 3)}...` 
        : blog.title;

    // Meta description must be 120–155 chars
    const maxDescLength = 155;
    const truncateDesc = (text: string) =>
        text.length > maxDescLength ? `${text.substring(0, maxDescLength - 3)}...` : text;
        
    const defaultDescription = `Đọc bài viết: ${blog.title}. Cập nhật kiến thức AI và công nghệ mới nhất trên Bloai Blog.`;
    const finalDescription = truncateDesc(blog.metaDescription || defaultDescription);
    const finalOgTitle = blog.ogTitle || truncatedTitle;
    const finalOgDescription = truncateDesc(blog.ogDescription || finalDescription);

    const blogPostSeo = {
        title: truncatedTitle,
        description: finalDescription,
        keywords: keywords,
        canonical: blogUrl,
        openGraph: {
            type: 'article' as const,
            title: finalOgTitle,
            description: finalOgDescription,
            // og:url must always match the canonical URL
            url: blogUrl,
            siteName: 'Bloai Blog',
            images: blog.ogImageUrl ? [{
                url: blog.ogImageUrl,
                width: 1200, 
                height: 630,
                alt: finalOgTitle,
            }] : (blog.imageUrl ? [{
                url: blog.imageUrl,
                width: 1200, 
                height: 630,
                alt: blog.title,
            }] : [{
                url: 'https://www.bloai.blog/images/Logo/android-chrome-512x512.png',
                width: 1200,
                height: 630,
                alt: finalOgTitle,
            }]),
            article: {
                publishedTime: blog.publishDate instanceof Date ? blog.publishDate.toISOString() : undefined,
                modifiedTime: (blog.updatedAt instanceof Date ? blog.updatedAt.toISOString() : 
                              (blog.publishDate instanceof Date ? blog.publishDate.toISOString() : undefined)),
                authors: blog.author?.name ? [blog.author.name] : ['BloAI Team'],
                tags: blog.tags?.map((tag: { name: string }) => tag.name) ?? [], 
            },
        },
        twitter: {
            card: 'summary_large_image' as const,
            title: finalOgTitle,
            description: finalOgDescription,
            images: blog.ogImageUrl 
                ? [blog.ogImageUrl] 
                : (blog.imageUrl 
                    ? [blog.imageUrl] 
                    : ['https://www.bloai.blog/images/Logo/android-chrome-512x512.png']),
            site: '@Bloai_Team',
            creator: '@Bloai_Team',
        },
    };

    return {
        title: blogPostSeo.title,
        description: blogPostSeo.description,
        keywords: blogPostSeo.keywords,
        alternates: {
            canonical: blogPostSeo.canonical,
            languages: {
                'vi-VN': blogPostSeo.canonical,
                'x-default': blogPostSeo.canonical,
            }
        },
        openGraph: {
            ...blogPostSeo.openGraph,
            url: blogPostSeo.canonical,
        },
        twitter: blogPostSeo.twitter,
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params; 

    const blog = await getCachedBlog(slug);

    if (!blog) {
        notFound();
    }

    const suggestedBlogsResult = await api.blog.getSuggestedBlogs({ slug, limit: 6 });
    const suggestedBlogs = (suggestedBlogsResult ?? []) as SuggestedBlog[]; 

    return (
        <>
            <BlogPostClientWrapper
                blogData={blog as Blog} 
                suggestedBlogsData={suggestedBlogs} 
            />
            {/* 
              * Server-rendered related posts — these <a> links appear in the
              * initial HTML so crawlers can discover & follow them without JS.
              * This is the key fix for the "orphan page" SEO issue.
              * Visually hidden via sr-only so users don't see a duplicate section.
              */}
            {suggestedBlogs.length > 0 && (
                <nav aria-label="Bài viết liên quan" className="sr-only">
                    <h2>Bài viết liên quan</h2>
                    <ul>
                        {suggestedBlogs.map((post) => (
                            <li key={post.slug}>
                                <Link href={`/blog/${post.slug}`}>
                                    {post.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </>
    );
}
