import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '@/trpc/server';
import BlogPostClientWrapper from './components/BlogPostClientWrapper'; 
import { Blog, SuggestedBlog } from '@/types/helper.type';

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    const { slug } = await params;

    const blog = await api.blog.getBlog({ slug });

    if (!blog) {
        return {
            title: 'Blog Post Not Found | BloAI Technology Blog',
            description: 'The blog post you are looking for could not be found.',
        };
    }
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'; 
    const blogUrl = blog.canonicalUrl || `${appUrl}/blog/${blog.slug}`;

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
        const uniqueTags = Array.from(new Set(prioritizedTags.map(t => t.name)))
        .slice(0, count);
        if (uniqueTags.length < count) {
            const defaultTags = ['AI', 'Machine Learning', 'Technology', 'Tutorial', 'Guide'];
            const needed = count - uniqueTags.length;
            return [...uniqueTags, ...defaultTags.slice(0, needed)].join(', ');
        }
        return uniqueTags.join(', ');
    };
  
    const keywords = getTopKeywords(blog.tags ?? [], 5);
    console.log('key:', keywords);
    const blogPostSeo = {
        title: `${blog.title} | BloAI Technology Blog`,
        description: blog.metaDescription,
        keywords: keywords,
        canonical: blogUrl,
        openGraph: {
            type: 'article' as const,
            title: blog.ogTitle || blog.title,
            description: blog.ogDescription || blog.metaDescription || '', 
            url: blogUrl,
            images: blog.ogImageUrl ? [{
                url: blog.ogImageUrl,
                width: 1200, 
                height: 630,
                alt: blog.ogTitle || blog.title,
            }] : (blog.imageUrl ? [{
                url: blog.imageUrl,
                width: 1200, 
                height: 630,
                alt: blog.title,
            }] : []),
            article: {
                publishedTime: blog.publishDate?.toISOString(),
                modifiedTime: blog.updatedAt?.toISOString() || blog.publishDate?.toISOString(),
                authors: blog.author?.name ? [blog.author.name] : ['BloAI Team'],
                tags: blog.tags?.map((tag: { name: string }) => tag.name) ?? [], 
            },
        },
        twitter: {
            card: "summary_large_image",
            title: blog.ogTitle || blog.title,
            description: blog.ogDescription || blog.metaDescription || '',
            images: blog.ogImageUrl ? [blog.ogImageUrl] : (blog.imageUrl ? [blog.imageUrl] : []),
            site: "@Bloai_Team"
        },
    };

    return {
        title: blogPostSeo.title,
        description: blogPostSeo.description,
        keywords: blogPostSeo.keywords,
        alternates: {
            canonical: blogPostSeo.canonical,
        },
        openGraph: blogPostSeo.openGraph,
        twitter: blogPostSeo.twitter,
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params; 

    const [blog, suggestedBlogsResult] = await Promise.all([
        api.blog.getBlog({ slug }),
        api.blog.getSuggestedBlogs({ slug, limit: 6 }) 
    ]);

    if (!blog) {
        notFound();
    }

    const suggestedBlogs = suggestedBlogsResult ?? []; 

  
    return (
        <BlogPostClientWrapper
            blogData={blog as Blog} 
            suggestedBlogsData={suggestedBlogs as SuggestedBlog[]} 
        />
    );
}
