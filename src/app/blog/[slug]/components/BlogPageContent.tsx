'use client';
import React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { Share, Eye as EyeIcon } from 'lucide-react';
import { FaArrowUp, FaFacebook, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { env } from '@/env';
import { IconUserOff } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hook/use-mobile';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import Spinner from '@/components/Snipper';
import { CldImage } from 'next-cloudinary';

const DynamicReactMarkdown = dynamic(
    () => import('react-markdown').then(mod => {
        return mod.default;
    }),
    {
        loading: () => <div className='prose max-w-none'><p>Loading content...</p></div>,
        ssr: false
    }
);


interface BlogPageContentProps {
    blog: any | null | undefined;
    suggestedBlogs?: any | null | undefined;
}

interface Author {
    id?: string | number;
    name?: string;
    image?: string;
    bio?: string;
}

interface Blog {
    slug: string;
    title: string;
    imageUrl?: string;
    publishDate: string | Date;
    updatedAt?: string | Date;
    author: Author | null;
    metaDescription: string;
    canonicalUrl: string;
    tags: { name: string }[];
    content: string;
}

interface AuthorCardProps {
    author: Author | null;
    className?: string;
    imageSize?: number;
    showSocials?: boolean;
}
interface SuggestedBlog {
    slug: string;
    title: string;
    imageUrl?: string;
    imageAlt?: string;
    publishDate: Date;
    readTime: number;
    metaDescription: string;
    author: {
      name?: string;
      image?: string;
    };
    tags: { name: string }[];
}
  

const AuthorCard: React.FC<AuthorCardProps> = ({
    author,
    className = '',
    imageSize = 96,
    showSocials = true,
}) => {
    if (!author) return null;

    return (
        <div className={`flex flex-col items-center text-center ${className}`}>
            <Image
                src={author.image || '/fallback-avatar.png'}
                alt={author.name || 'Author Avatar'}
                width={imageSize}
                height={imageSize}
                className="rounded-full object-cover mb-4 border-4 border-white shadow-lg"
                priority={imageSize > 80}
                quality={80}
            />
            <h3 className="text-xl font-bold text-gray-900 mb-2">{author.name || 'Unknown Author'}</h3>
            <p className="text-gray-600 mb-6 leading-relaxed max-w-md">
                {author.bio || 'No bio available.'}
            </p>
            {showSocials && (
                 <div className="flex gap-3 w-full items-center justify-center">
                    <div className="flex gap-2">
                        <Link
                            href={`https://twitter.com/`}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Author's Twitter Profile"
                        >
                            <FaTwitter className="w-5 h-5 " />
                        </Link>
                        <Link
                             href={`https://facebook.com/`}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Author's Facebook Profile"
                        >
                            <FaFacebook className="w-5 h-5 " />
                        </Link>
                        <Link
                            href={`https://linkedin.com/in/`}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Author's LinkedIn Profile"
                        >
                            <FaLinkedin className="w-5 h-5 " />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};


const BlogPostPageContent: React.FC<BlogPageContentProps> = ({ blog, suggestedBlogs = [] }) => {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);
    const [views, setViews] = useState<number>(0);
    const isMobile = useIsMobile();

    const handleShare = useCallback(() => {
        if (navigator.clipboard && window.location.href) {
            navigator.clipboard.writeText(window.location.href)
                .then(() => alert('Đã sao chép liên kết vào clipboard!'))
                .catch(err => console.error('Failed to copy link: ', err));
        } else {
            alert('Không thể sao chép liên kết trên trình duyệt này.');
        }
    }, []);


    const structuredData = useMemo(() => {
        if (!blog) return null;
        const mainEntity = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": blog.title,
            "image": blog.imageUrl ? [blog.imageUrl] : [],
            "datePublished": blog.publishDate,
            "dateModified": blog.updatedAt || blog.publishDate,
            "author": blog.author ? {
                "@type": "Person",
                "name": blog.author.name,
                "url": blog.author.id ? `${env.NEXT_PUBLIC_APP_URL}/authors/${blog.author.id}` : undefined
            } : undefined,
            "publisher": {
                "@type": "Organization",
                "name": "BloAI",
                "logo": {
                    "@type": "ImageObject",
                    "url": `https://res.cloudinary.com/dq2z27agv/image/upload/v1742958723/aeaxx8zqeqvhosqew1ka.webp`
                }
            },
            "description": blog.metaDescription,
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": blog.canonicalUrl
            }
        }
        const suggestedItems = suggestedBlogs?.map((post: { title: any; slug: any; imageUrl: any; publishDate: any; author: { name: any; }; metaDescription: any; }) => ({
            "@type": "Article",
            "headline": post.title,
            "url": `${env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`,
            "image": post.imageUrl ? [post.imageUrl] : [],
            "datePublished": post.publishDate,
            "author": post.author?.name ? {
              "@type": "Person",
              "name": post.author.name
            } : undefined,
            "description": post.metaDescription
        }));
        return {
            ...mainEntity,
            "isRelatedTo": suggestedItems?.length ? suggestedItems : undefined
          };
    }, [blog]);


    const blogTagsMemo = useMemo(() => {
        const tagsToShow = isMobile ? 3 : 5;
        return blog?.tags?.slice(0, tagsToShow).map((tag: any, index: number) => (
            <span
                key={index}
                className="px-3 py-1 text-xs font-medium text-blue-600 rounded-full bg-blue-50 hover:bg-blue-100"
                style={{ wordBreak: 'break-word' }}
            >
                #{tag.name.toUpperCase()}
            </span>
        )) || [];
     }, [blog?.tags, isMobile]);

     const remainingTagsCount = useMemo(() => {
        const tagsToShow = isMobile ? 3 : 5;
        return Math.max(0, (blog?.tags?.length || 0) - tagsToShow);
     },[blog?.tags, isMobile]);

    useEffect(() => {
        if (!blog?.slug) return;

        let isActive = true;
        const storageKey = `blog-views-${blog.slug}`;

        const storedViews = localStorage.getItem(storageKey);
        const initialViews = storedViews ? parseInt(storedViews, 10) : 0;
        if (isActive) {
            setViews(initialViews);
        }

        const viewIncrementInterval = setInterval(() => {
            if (!isActive) return;

            setViews(prevViews => {
                const currentViews = typeof prevViews === 'number' && !isNaN(prevViews) ? prevViews : 0;
                const increment = Math.floor(Math.random() * 3) + 1;
                const newViews = currentViews + increment;
                try {
                    localStorage.setItem(storageKey, newViews.toString());
                } catch (error) {
                    console.error("Error saving to localStorage:", error);
                }
                return newViews;
            });
        }, 8000);

        return () => {
            isActive = false;
            clearInterval(viewIncrementInterval);
        };
    }, [blog?.slug]);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!blog) {
        return (
            <div className='h-[calc(100vh-80px)] w-full flex justify-center items-center flex-col gap-4 p-4 text-center'>
                <Spinner />
                <h1 className='font-bold text-2xl text-gray-700'>Loading Blog Post...</h1>
                <p className="text-gray-500">Please wait a moment.</p>
            </div>
        );
    }

     if (!blog.author) {
         return (
             <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 text-center p-4">
                 <div className="inline-flex items-center gap-2 text-amber-600">
                     <IconUserOff className="w-8 h-8" />
                     <span className="text-xl font-semibold">Author Information Unavailable</span>
                 </div>
                 <p className="max-w-md text-gray-600">
                     We couldn't load the author details for this post. You can still read the content.
                 </p>
                 <Button
                     variant="ghost"
                     className="text-blue-600 hover:text-blue-700 mt-2"
                     onClick={() => router.back()}
                 >
                     ← Go Back
                 </Button>
             </div>
         );
     }

    return (
        <>
            {structuredData && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
            )}
            <meta name="description" content={blog.metaDescription} />
            <meta property="og:description" content={blog.metaDescription} />
            <meta name="twitter:description" content={blog.metaDescription} />
            {suggestedBlogs?.map((post: { slug: React.Key | null | undefined; title: any; metaDescription: any; }, index: any) => (
                <React.Fragment key={post.slug}>
                <link rel="prefetch" href={`/blog/${post.slug}`} as="document" />
                <meta 
                    name={`suggested:post_${index}`} 
                    content={`${post.title}|${post.metaDescription}`} 
                />
                </React.Fragment>
            ))}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex gap-x-8 lg:gap-x-12">

                    <aside className="sticky top-28 hidden lg:block w-16 shrink-0 -ml-20 mr-4 h-[calc(100vh-10rem)]">
                        <div className="flex flex-col items-center justify-start pt-4 gap-8 h-full">
                            <div className="flex flex-col items-center gap-6">
                                <button
                                    onClick={handleShare}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors group focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                                    aria-label="Copy link to share"
                                    title="Copy Link"
                                >
                                    <Share className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                                </button>

                                <div className="flex flex-col items-center gap-1 text-gray-500" title="Views">
                                    <EyeIcon className="w-5 h-5" />
                                    <span className="text-xs font-medium">{views > 0 ? views.toLocaleString() : '...'}</span>
                                </div>

                                <div className="h-px w-6 bg-gradient-to-r from-transparent via-gray-300 to-transparent my-2" />

                                <div className="flex flex-col gap-3">
                                     <a
                                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(blog.canonicalUrl)}&text=${encodeURIComponent(blog.title)}`}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Share on Twitter"
                                        title="Share on Twitter"
                                    >
                                        <FaTwitter className="w-5 h-5 text-gray-500 hover:text-[#1DA1F2]" />
                                    </a>

                                    <a
                                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(blog.canonicalUrl)}`}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Share on Facebook"
                                         title="Share on Facebook"
                                    >
                                        <FaFacebook className="w-5 h-5 text-gray-500 hover:text-[#1877F2]" />
                                    </a>

                                    <a
                                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(blog.canonicalUrl)}`}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Share on LinkedIn"
                                         title="Share on LinkedIn"
                                    >
                                        <FaLinkedin className="w-5 h-5 text-gray-500 hover:text-[#0A66C2]" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <main className="flex-1 min-w-0">
                        <article className="max-w-3xl mx-auto">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {blogTagsMemo}
                                {remainingTagsCount > 0 && (
                                    <Link href='/categories'>
                                        <span className="text-xs text-gray-500 self-center underline">
                                            + {remainingTagsCount} more
                                        </span>
                                    </Link>
                                )}
                            </div>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                                {blog.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-500 mb-8 text-sm md:text-base">
                                {blog.author?.name && (
                                    <>
                                        <span>By {blog.author.name}</span>
                                        <span className="h-1 w-1 bg-gray-400 rounded-full" />
                                    </>
                                )}
                                <span className="flex items-center gap-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                    {new Date(blog.publishDate).toLocaleDateString('vi-VN', {
                                        year: 'numeric', month: 'long', day: 'numeric'
                                    })}
                                </span>
                            </div>

                            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed border-l-4 border-gray-200 pl-4">
                                {blog.metaDescription}
                            </p>
                            <div className="prose prose-slate max-w-none lg:prose-lg prose-img:rounded-lg prose-img:shadow-sm prose-a:text-blue-600 hover:prose-a:text-blue-800 mb-12">
                                <DynamicReactMarkdown
                                    rehypePlugins={[rehypeRaw]}
                                    remarkPlugins={[remarkGfm]}
                                >
                                    {blog.content}
                                </DynamicReactMarkdown>
                            </div>

                            <hr className="my-12"/>
                            <div className='w-full flex items-center justify-center'>
                                <AuthorCard author={blog.author} imageSize={120} />
                            </div>
                        </article>
                    </main>

                    <aside className="md:block w-72 shrink-0 hidden">
                        <div className="sticky top-28 space-y-8">
                        <div className='bg-gradient-to-br from-gray-800 to-black p-1 rounded-2xl shadow-lg relative'>
                            <div className="p-4 bg-white rounded-xl">
                            <AuthorCard author={blog.author} imageSize={80} />
                            </div>
                            <div className='bg-black rounded-b-xl mt-0 py-2'>
                            <h2 className='text-white font-semibold text-lg text-center tracking-wide'>TÁC GIẢ</h2>
                            </div>
                        </div>

                        {suggestedBlogs.length > 0 && (
                            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="bg-gradient-to-br from-gray-800 to-black px-4 py-3">
                                    <h2 className="text-white font-semibold text-lg text-center tracking-wide">
                                    BÀI VIẾT LIÊN QUAN
                                    </h2>
                                </div>
                            <div className="p-4 space-y-4 border-4 border-black rounded-b-xl">
                                {suggestedBlogs.map((post: any) => (
                                <article key={post.slug} className="group">
                                    <Link href={`/blog/${post.slug}`} className="block" prefetch={false}>
                                    <div className="flex gap-3">
                                        {post.imageUrl && (
                                        <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden relative">
                                            <CldImage
                                                width={600}
                                                height={400}
                                                src={post.imageUrl || 'your-default-placeholder-public-id'}
                                                alt={post.title || 'Blog post image'}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                                loading="lazy"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                                                crop="fill"
                                                gravity="auto"
                                                quality="auto:best"
                                                format="auto"
                                            />
                                        </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {post.title}
                                        </h3>
                                        <div className="flex items-center mt-1 text-xs text-gray-500">
                                            <span>
                                            {new Date(post.publishDate).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                            </span>
                                            <span className="mx-1">•</span>
                                            <span>{post.readTime} min read</span>
                                        </div>
                                        </div>
                                    </div>
                                    </Link>
                                </article>
                                ))}
                            </div>
                            </div>
                        )}
                        </div>
                    </aside>
                </div>
            </div>

            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-300 ease-in-out"
                    aria-label='Scroll to top'
                    title="Scroll to top"
                >
                    <FaArrowUp className="w-5 h-5" />
                </button>
            )}
        </>
    );
}

export default BlogPostPageContent;