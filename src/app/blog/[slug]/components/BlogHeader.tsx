'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useIsMobile } from '@/hook/use-mobile';
import { BlogCore } from '@/types/helper.type';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../components/ui/avatar';
import { FaUser } from '@/components/icons';
import { Breadcrumbs } from '@/components/blog/Breadcrumbs';

interface BlogHeaderProps {
    blog: BlogCore | null;
}

const BlogHeader: React.FC<BlogHeaderProps> = ({ blog }) => {
    const isMobile = useIsMobile();

    const blogTagsMemo = useMemo(() => {
        if (!blog?.tags) return [];
        const tagsToShow = isMobile ? 3 : 5;
        return blog.tags.slice(0, tagsToShow).map((tag: { name: string }, index: number) => (
            <div
                key={`${tag.name}-${index}`}
                className="px-3 py-1 text-xs font-medium text-blue-600 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
            >
                #{tag.name.toUpperCase()}
            </div>
        ));
    }, [blog?.tags, isMobile]);

    const remainingTagsCount = useMemo(() => {
        if (!blog?.tags) return 0;
        const tagsToShow = isMobile ? 3 : 5;
        return Math.max(0, blog.tags.length - tagsToShow);
    }, [blog?.tags, isMobile]);

    if (!blog) return null;

    return (
        <div className="pb-8 mb-10 border-b-[3px] border-black">
            <div className="mb-4">
                <Breadcrumbs items={[
                    { label: 'BLOG', href: '/blog' },
                    { label: blog.title }
                ]} />
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
                {blogTagsMemo}
                {remainingTagsCount > 0 && (
                    <Link
                        href="/tags"
                        className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest border-[1.5px] border-black bg-white text-black hover:bg-black hover:text-white transition-colors"
                        title="View all tags"
                        >
                        + {remainingTagsCount}
                    </Link>
                )}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-black mb-6 leading-[1.1] tracking-tight uppercase [overflow-wrap:anywhere] hyphens-auto">
                {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 text-black mb-8 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                {blog.author?.name && (
                    <Link href={`/author/${encodeURIComponent(blog.author.name.replace(/ /g, '-'))}`} className="flex items-center gap-2 hover:underline transition-all">
                        {blog.author.image && (
                             <Avatar className='h-6 w-6 rounded-none border border-black'>
                                <AvatarImage 
                                    src={blog.author.image || 'https://res.cloudinary.com/dq2z27agv/image/upload/q_auto,f_webp,w_auto/v1746885273/y3hpblcst5qn3j5aah1l.svg'} 
                                    alt={`${blog.author.name}'s avatar`}
                                    className="object-cover rounded-none"
                                />
                                <AvatarFallback className="bg-white text-black rounded-none">
                                {blog.author.name ? (
                                    blog.author.name.split(' ').map(n => n[0]).join('').substring(0, 2)
                                ) : (
                                    <FaUser className="w-3 h-3 text-black" />
                                )}
                                </AvatarFallback>
                            </Avatar>
                        )}
                        <span>{blog.author.name}</span>
                        <span className="h-1 w-1 bg-black rounded-none ml-2" />
                    </Link>
                )}
                <time dateTime={new Date(blog.publishDate).toISOString()} className="flex items-center gap-1.5">
                    {new Date(blog.publishDate).toLocaleDateString('vi-VN')}
                </time>
                {blog.readTime && (
                    <>
                      <span className="h-1 w-1 bg-black rounded-none" />
                      <span>{blog.readTime} PHÚT ĐỌC</span>
                    </>
                )}
            </div>
            <p className="text-lg md:text-xl text-black font-medium leading-relaxed border-l-[3px] border-black pl-5 italic">
                {blog.metaDescription}
            </p>
        </div>
    );
};

export default BlogHeader;