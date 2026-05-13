import React from 'react';
import Link from 'next/link';
import { SuggestedBlog } from '@/types/helper.type';
import { OptimizedImage } from '@/components/OptimizedImage';

interface SuggestedBlogCardProps {
    post: SuggestedBlog;
}

const SuggestedBlogCard: React.FC<SuggestedBlogCardProps> = ({ post }) => {
    return (
        <article key={post.slug} className="group h-full border-[1.5px] border-black bg-white hover:-translate-y-1 transition-transform">
            <Link
                href={`/blog/${post.slug}`}
                className="flex flex-col h-full"
                aria-label={`Đọc bài viết: ${post.title}`}
            >
                {post.imageUrl && (
                    <div className="w-full aspect-video relative border-b-[1.5px] border-black overflow-hidden bg-white">
                        <OptimizedImage
                            src={post.imageUrl}
                            alt={post.imageAlt || `Thumbnail for ${post.title}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 480px) calc(100vw - 32px), (max-width: 1024px) calc(50vw - 24px), 400px"
                        />
                    </div>
                )}
                <div className="flex flex-col flex-1 p-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-black mb-3 line-clamp-2 group-hover:text-gray-600 transition-colors">
                        {post.title}
                    </h3>
                    <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-bold uppercase tracking-widest text-black">
                        <time dateTime={new Date(post.publishDate).toISOString()}>
                            {new Date(post.publishDate).toLocaleDateString('vi-VN')}
                        </time>
                        <span className="w-1 h-1 bg-black rounded-none"></span>
                        <span>{post.readTime} PHÚT ĐỌC</span>
                    </div>
                </div>
            </Link>
        </article>
    );
};

export default SuggestedBlogCard;