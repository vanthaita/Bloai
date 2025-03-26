'use client'
import React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Share, EyeIcon, ArrowUpIcon } from 'lucide-react';
import Image from 'next/image';
import { FaArrowUp, FaFacebook, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { api } from '@/trpc/react';
import { usePathname, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { NextSeo } from 'next-seo';
import { env } from '@/env';
import Spinner from '@/components/Snipper';
import { IconAlertCircle, IconUserOff } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hook/use-mobile';

export default function BlogPostPage() {
  const pathname = usePathname();
  const slug = pathname.split('/blog/')[1]?.split('/')[0] || '';
  const { data: blog, isLoading, error } = api.blog.getBlog.useQuery({ slug: slug! });
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false); 
  const [views, setViews] = useState<number>(0);
  const isMobile = useIsMobile();
  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    alert('Đã sao chép liên kết vào clipboard!');
  }, []);

  const truncate = useCallback((text: string, length: number) => {
    return text.length > length ? text.substring(0, length - 3) + '...' : text;
  }, []);

  const structuredData = useMemo(() => {
    if (!blog) return null;
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": blog.title,
      "image": blog.imageUrl ? [blog.imageUrl] : [],
      "datePublished": blog.publishDate,
      "dateModified": blog.updatedAt || blog.publishDate,
      "author": {
        "@type": "Person",
        "name": blog.author?.name,
        "url": `${env.NEXT_PUBLIC_APP_URL}/authors/${blog.author?.id}`
      },
      "publisher": {
        "@type": "Organization",
        "name": "BloAI",
        "logo": {
          "@type": "ImageObject",
          "url": `${env.NEXT_PUBLIC_APP_URL}/logo.png`
        }
      },
      "description": blog.metaDescription,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": blog.canonicalUrl
      }
    };
  }, [blog]);

  const blogPostSeo = useMemo(() => {
    if (!blog) return {};
    return {
      title: `${blog.title} | BloAI Technology Blog`,
      description: blog.metaDescription || truncate(blog.content, 160),
      canonical: blog.canonicalUrl || `${env.NEXT_PUBLIC_APP_URL}/blog/${blog.slug}`,
      openGraph: {
        type: 'article',
        title: blog.ogTitle || blog.title,
        description: blog.ogDescription || blog.metaDescription || truncate(blog.content, 300),
        url: blog.canonicalUrl || `${env.NEXT_PUBLIC_APP_URL}/blog/${blog.slug}`,
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
          publishedTime: blog.publishDate.toISOString(),
          modifiedTime: blog.updatedAt ? blog.updatedAt.toISOString() : blog.publishDate.toISOString(),
          authors: [blog.author?.name || 'BloAI Team'],
          tags: blog.tags.map(tag => tag.name),
        },
      },
    };
  }, [blog, truncate]);

  const blogTagsMemo = useMemo(() => (
    blog?.tags.slice(0, (isMobile ? 3 : 5)).map((tag, index) => (
      <span
        key={index}
        className="px-3 py-1 text-xs font-medium text-blue-600 rounded-full"
        style={{ wordBreak: 'break-word' }}
      >
        #{tag.name.toUpperCase()}
      </span>
    )) || []
  ), [blog?.tags]);

  useEffect(() => {
    if (!slug) return;
    const storedViews = localStorage.getItem(`blog-views-${slug}`);
    const initialViews = storedViews ? parseInt(storedViews, 10) : 0;
    setViews(initialViews);

    const viewIncrementInterval = setInterval(() => {
      setViews(prevViews => {
        const newViews = prevViews + Math.floor(Math.random() * 5);
        localStorage.setItem(`blog-views-${slug}`, newViews.toString());
        return newViews;
      });
    }, 5000);

    return () => clearInterval(viewIncrementInterval);
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) { 
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  if (isLoading) {
    return <div className='h-[calc(100vh-80px)] w-full flex justify-center items-center flex-col gap-2 '>
      <Spinner />
      <h1 className='font-bold text-2xl'>BloAI</h1>
    </div>
  }

  if (error || !blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 text-center">
        <div className="inline-flex items-center gap-2 text-red-600">
          <IconAlertCircle className="w-8 h-8 animate-pulse" />
          <span className="text-2xl font-bold">Lỗi tải dữ liệu</span>
        </div>
        <p className="max-w-md text-gray-600">
          Không thể tải bài viết. Vui lòng thử lại hoặc liên hệ hỗ trợ nếu lỗi vẫn tiếp diễn.
        </p>
        <div className="flex gap-3 mt-4">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Thử lại
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            Liên hệ hỗ trợ
          </Button>
        </div>
      </div>
    );
  }

  if (!blog.author) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 text-center">
        <div className="inline-flex items-center gap-2 text-amber-600">
          <IconUserOff className="w-8 h-8 animate-bounce" />
          <span className="text-2xl font-bold">Thiếu thông tin tác giả</span>
        </div>
        <p className="max-w-md text-gray-600">
          Bài viết này hiện chưa có thông tin tác giả. Vui lòng kiểm tra lại sau.
        </p>
        <Button
          variant="ghost"
          className="text-blue-600 hover:text-blue-700"
          onClick={() => router.back()}
        >
          ← Quay lại trang trước
        </Button>
      </div>
    );
  }

  return (
    <>
      <NextSeo {...blogPostSeo} />
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-12">
          <main className="flex-1 ">
            <div className="sticky top-28 hidden lg:block float-left -ml-20 mr-6 h-[calc(100vh-10rem)]">
              <div className="flex flex-col items-center gap-8 h-full">
                <div className="flex flex-col gap-6">
                  <button
                    onClick={handleShare}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                    aria-label="Chia sẻ bài viết"
                  >
                    <Share className="w-6 h-6 text-gray-600 group-hover:text-blue-600" />
                  </button>

                  <div className="flex flex-col items-center gap-2 text-gray-600">
                    <EyeIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">{views.toLocaleString()}</span>
                  </div>

                  <div className="h-px w-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent" />

                  <div className="flex flex-col gap-4">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Chia sẻ lên Twitter">
                      <FaTwitter className="w-5 h-5 text-gray-600 hover:text-[#1DA1F2]" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Chia sẻ lên Facebook">
                      <FaFacebook className="w-5 h-5 text-gray-600 hover:text-[#1877F2]" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Chia sẻ lên LinkedIn">
                      <FaLinkedin className="w-5 h-5 text-gray-600 hover:text-[#0A66C2]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <article className="max-w-3xl mx-auto">
              <div className="mb-8">
                
                <div className="flex gap-2 mb-6">
                  {blogTagsMemo}
                  {blog.tags.length > 5 && (
                    <span className="text-sm text-gray-500">
                      + {blog.tags.length - 5} thêm
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {blog.title}
                </h1>
                <div className="flex items-center gap-4 text-gray-500 mb-8 text-sm md:text-base">
                  <span className="flex items-center gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    {new Date(blog.publishDate).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="h-1 w-1 bg-gray-400 rounded-full" />
                  <span>{blog.author?.name}</span>
                </div>
              </div>

              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                {blog.metaDescription}
              </p>

              <div className="prose max-w-none text-gray-700 mb-12 prose-sm sm:prose-base lg:prose-lg">
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw]}
                  remarkPlugins={[remarkGfm]}
                  children={blog.content}
                />
              </div>


              <div className='w-full flex items-center justify-center'>
                <div className="flex flex-col justify-center items-center text-center mt-8">
                  <div className="flex gap-2 mb-6">
                    {blogTagsMemo}
                    {blog.tags.length > 5 && (
                      <span className="text-sm text-gray-500">
                        + {blog.tags.length - 5} thêm
                      </span>
                    )}
                  </div>
                  <Image
                    src={blog.author?.image || '/fallback-avatar.png'}
                    alt={blog.author?.name || 'Tên tác giả'}
                    width={146}
                    height={146}
                    className="rounded-full object-cover mb-4 border-4 border-white shadow-lg"
                    priority
                    quality={85}
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{blog.author?.name}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed max-w-md">
                    {blog.author?.bio || 'Không có tiểu sử.'}
                  </p>
                  <div className="flex gap-3 w-full items-center justify-center">
                    <div className="flex gap-2">
                      <a
                        href={`https://twitter.com/`}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Hồ sơ Twitter"
                      >
                        <FaTwitter className="w-5 h-5 " />
                      </a>
                      <a
                        href={`https://linkedin.com/in/`}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Hồ sơ LinkedIn"
                      >
                        <FaFacebook className="w-5 h-5 " />
                      </a>
                    </div>
                  </div>
                </div>

              </div>

            </article>
          </main>

          <aside className="hidden lg:block w-80 xl:w-96 shrink-0">
            <div className='bg-black p-1 rounded-2xl relative'>
              <div className="flex flex-row absolute w-full justify-between gap-4 right-0 p-1 top-[40%]">
                <div className='flex flex-col gap-y-[2px] items-start'>
                  {[15, 15, 20, 30, 20, 15, 10].map((width, index) => (
                    <div
                      className={`h-1 bg-black ${index === 3 ? 'w-[30px]' : `w-[${width}px]`}`}
                      key={index}
                    />
                  ))}
                </div>
                <div className='flex flex-col gap-y-[2px] items-end transform -scale-y-180'>
                  {[10, 15, 20, 30, 20, 15, 10].map((width, index) => (
                    <div
                      className={`h-1 bg-black ${index === 3 ? 'w-[30px]' : `w-[${width}px]`}`}
                      key={index}
                    />
                  ))}
                </div>
              </div>
              <div className="p-2 bg-white rounded-xl ">
                <div className="flex flex-col items-center text-center">
                  <Image
                    src={blog.author?.image || ''}
                    alt={blog.author?.name || 'Tên tác giả'}
                    width={96}
                    height={96}
                    className="rounded-full object-cover mb-4 border-4 border-white shadow-lg"
                    priority
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{blog.author?.name}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {blog.author?.bio || 'Không có tiểu sử.'}
                  </p>

                  <div className="flex gap-3 w-full items-center justify-center">
                    <div className="flex gap-2">
                      <a
                        href={`https://twitter.com/`}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Hồ sơ Twitter"
                      >
                        <FaTwitter className="w-5 h-5 " />
                      </a>
                      <a
                        href={`https://linkedin.com/in/`}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Hồ sơ LinkedIn"
                      >
                        <FaLinkedin className="w-5 h-5 " />
                      </a>
                    </div>
                  </div>
                </div>

              </div>
              <div className='bg-black top-28  rounded-b-xl mt-1'>
                <h2 className='text-white font-medium text-xl text-center'>VỀ TÔI</h2>
              </div>
            </div>
          </aside>
        </div>
      </div>
      {isVisible && (
        <button
            onClick={scrollToTop}
            className="fixed bottom-20 right-4 md:bottom-8 md:right-8 bg-blue-400 rounded-full p-3 shadow-md hover:bg-blue-500 transition-colors"
            aria-label='go to top'
          >
           <FaArrowUp className="text-neutral-950"/>
        </button>
      )}
    </>
  );
}