import type { Metadata, ResolvingMetadata } from 'next';
import { api } from '@/trpc/server';
import BlogPostPageContent from './components/BlogPageContent';

const truncate = (text: string, length: number) => {
    return text.length > length ? text.substring(0, length - 3) + '...' : text;
};
type Props = {
    params: Promise<{ slug: string }>
}
export async function generateMetadata(
    { params } : Props,
): Promise<Metadata> {
    const { slug } = await params;

    const blog = await api.blog.getBlog({ slug });

    if (!blog) {
        return {
            title: 'Blog Post Not Found | BloAI Technology Blog',
            description: 'Blog post not found.',
        };
    }

    const blogPostSeo = {
        title: `${blog.title} | BloAI Technology Blog`,
        description: blog.metaDescription || truncate(blog.content, 160),
        canonical: blog.canonicalUrl || `${process.env.NEXT_PUBLIC_APP_URL}/blog/${blog.slug}`,
        openGraph: {
            type: 'article' as const,
            title: blog.ogTitle || blog.title,
            description: blog.ogDescription || blog.metaDescription || truncate(blog.content, 300),
            url: blog.canonicalUrl || `${process.env.NEXT_PUBLIC_APP_URL}/blog/${blog.slug}`,
            images: blog.ogImageUrl ? [{
                url: blog.ogImageUrl,
                width: 1200,
                height: 630,
                alt: blog.title,
            }] : (blog.imageUrl ? [{
                url: blog.imageUrl,
                width: 1200,
                height: 630,
                alt: blog.title,
            }] : []),
            article: {
                publishedTime: blog.publishDate?.toISOString(),
                modifiedTime: blog.updatedAt?.toISOString() || blog.publishDate?.toISOString(),
                authors: [blog.author?.name || 'BloAI Team'],
                tags: blog.tags.map((tag: { name: string }) => tag.name),
            },
        },
    };

    return {
        title: blogPostSeo.title,
        description: blogPostSeo.description,
        alternates: {
            canonical: blogPostSeo.canonical,
        },
        openGraph: blogPostSeo.openGraph,
    };
}


export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const blog = await api.blog.getBlog({ slug });
    if (!blog) {
        return <div>Blog Post Not Found</div>;
    }

    return <BlogPostPageContent blog={blog} />;
}