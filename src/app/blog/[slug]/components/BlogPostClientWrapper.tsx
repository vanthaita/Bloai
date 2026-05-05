'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { IconEdit, IconUserOff } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import Loading from '@/components/loading';


import BlogMetadata from './BlogMetadata';
import BlogShareSidebar from './BlogShareSidebar';
import BlogHeader from './BlogHeader';
import BlogTableOfContents from './BlogTableOfContents';
import BlogContentRenderer from './BlogContentRenderer';
import BlogAuthorBioSection from './BlogAuthorBioSection';
import BlogSuggestedPosts from './BlogSuggestedPosts';
import { BackToTop } from '@/components/BackToTop';
import { Author, Blog, Heading, slugify, SuggestedBlog } from '@/types/helper.type';
import { useCurrentUser } from '@/hook/use-current-user';
import BlogComments from './BlogComment';
import Link from 'next/link';


interface BlogPostClientWrapperProps {
    blogData: Blog | null | undefined;
    suggestedBlogsData?: SuggestedBlog[] | null | undefined;
}

const BlogPostClientWrapper: React.FC<BlogPostClientWrapperProps> = ({
    blogData: blog,
    suggestedBlogsData: suggestedBlogs = []
}) => {
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [isMounted, setIsMounted] = useState(false);
    const currentUser = useCurrentUser();
    const [isAuthor, setIsAuthor] = useState(false);
    const router = useRouter();
    const extractedHeadings = useMemo(() => {
        if (!blog?.content || typeof blog.content !== 'string') {
            return [];
        }
        const headingRegex = /^(#{1,3})\s+(.+)/gm;
        const matches = Array.from(blog.content.matchAll(headingRegex) as IterableIterator<RegExpMatchArray>);
        const tempHeadings: Heading[] = [];
        const uniqueIds = new Set<string>();

        matches.forEach((match, index) => {
            const level = (match[1]?.length ?? 1) as 1 | 2 | 3;
            const text = match[2]?.trim() ?? '';
            if (!text) return;

            let id = slugify(text);
            if (!id) id = `heading-${index}`;

            let counter = 1;
            const originalId = id;
            while (uniqueIds.has(id)) {
                id = `${originalId}-${counter}`;
                counter++;
            }
            uniqueIds.add(id);

            tempHeadings.push({ level, text, id });
        });
        return tempHeadings;
    }, [blog?.content]);

    useEffect(() => {
        setHeadings(extractedHeadings);
    }, [extractedHeadings]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (blog?.author && currentUser?.id) {
            setIsAuthor(blog.author.id === currentUser.id);
        } else {
            setIsAuthor(false);
        }
    }, [blog?.author, currentUser?.id]);

    if (!isMounted) {
        return <Loading />;
    }

    if (!blog) {
        return <Loading />;
    }

    const author = blog.author as Author | null;

    if (!author) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center p-6 bg-white border-2 border-black max-w-2xl mx-auto my-12">
                <div className="inline-flex items-center gap-2 text-black">
                    <IconUserOff stroke={1.5} className="w-10 h-10" />
                    <span className="text-2xl font-bold uppercase tracking-widest">Không tìm thấy Tác giả</span>
                </div>
                <p className="max-w-md text-gray-700 font-medium">
                    Không thể tải thông tin tác giả cho bài viết này.
                </p>
                <Button asChild
                    variant="outline"
                    className="text-black border-2 border-black rounded-none hover:bg-black hover:text-white mt-4 uppercase tracking-widest font-bold"
                >
                    <Link href='/'>
                        ← Quay lại Trang chủ
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <>
            <BlogMetadata blog={blog} suggestedBlogs={suggestedBlogs} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {isAuthor && (
                    <div className="flex justify-end mb-6">
                        <Button
                            variant="outline"
                            className="gap-2 rounded-none border-[1.5px] border-black hover:bg-black hover:text-white font-bold uppercase tracking-widest"
                            onClick={() => router.push(`/new-post?blogSlug=${blog.slug}`)}
                        >
                            <IconEdit size={18} />
                            Chỉnh Sửa Bài Viết
                        </Button>
                    </div>
                )}
                <div className="flex flex-col lg:flex-row gap-x-8 lg:gap-x-12">
                    <BlogShareSidebar blog={blog} />
                    <main className="flex-1 min-w-0 max-w-3xl mx-auto lg:max-w-none w-full">
                        <article>
                            <BlogHeader blog={blog} />

                            {/* TOC moved to right sidebar on desktop, but should still show on mobile. Let's render it here only for mobile */}
                            <div className="block lg:hidden mt-6">
                                <BlogTableOfContents headings={headings} />
                            </div>

                            <BlogContentRenderer content={blog.content} headings={headings} />
                            <hr className="my-12 border-t-2 border-black" />
                            <BlogAuthorBioSection author={author} />
                            <BlogComments slug={blog.slug} />
                        </article>
                    </main>
                    <div className='hidden lg:block lg:w-[30%] shrink-0'>
                        <div className="sticky top-40 space-y-8">
                            <BlogTableOfContents headings={headings} />
                            {/* Newsletter Box */}
                            <div className="border-[1.5px] border-black p-6 bg-white">
                                <h3 className="font-bold uppercase tracking-widest text-black text-lg mb-2">
                                    NHẬN TIN TỨC AI
                                </h3>
                                <p className="text-sm font-medium text-black mb-4">
                                    Đăng ký để không bỏ lỡ các xu hướng và bài viết mới nhất từ BloAI.
                                </p>
                                <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); alert("Đăng ký thành công!"); }}>
                                    <input
                                        type="email"
                                        placeholder="Email của bạn..."
                                        className="w-full border-[1.5px] border-black px-4 py-3 rounded-none focus:outline-none focus:ring-1 focus:ring-black"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="w-full bg-black text-white border-[1.5px] border-black font-bold uppercase tracking-widest py-3 hover:bg-white hover:text-black transition-colors rounded-none"
                                    >
                                        ĐĂNG KÝ
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-16 border-t-2 border-black">
                    <BlogSuggestedPosts author={author} suggestedBlogs={suggestedBlogs} />
                </div>
            </div>

            <BackToTop />
        </>
    );
};

export default BlogPostClientWrapper;   