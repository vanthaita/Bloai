'use client';

import React, { useCallback } from 'react';
import { Share, Eye as EyeIcon } from 'lucide-react';
import { FaTwitter, FaFacebook, FaLinkedin } from '@/components/icons';
import { BlogCore } from '@/types/helper.type';
import Link from 'next/link';
import { useBlogViews } from '@/hook/use-blog-view';

interface BlogShareSidebarProps {
  blog: BlogCore | null;
  initialViews?: number; 
}

const BlogShareSidebar: React.FC<BlogShareSidebarProps> = ({ blog, initialViews }) => {
    const { views } = useBlogViews(blog?.slug || '');
    const displayViews = views ?? initialViews ?? null;

    const handleShare = useCallback(() => {
        if (navigator.clipboard && window.location.href) {
        navigator.clipboard.writeText(window.location.href)
            .then(() => alert('Link copied to clipboard!'))
            .catch(err => console.error('Failed to copy link: ', err));
        } else {
        alert('Copying not supported in this browser.');
        }
    }, []);

    if (!blog) return null;

    const encodedUrl = encodeURIComponent(blog.canonicalUrl || window.location.href);
    const encodedTitle = encodeURIComponent(blog.title);

    return (
        <aside className="sticky top-40 hidden lg:block w-16 shrink-0 -ml-20 mr-4 h-[calc(100vh-10rem)] self-start">
        <div className="flex flex-col items-center justify-start pt-4 gap-8 h-full">
            <div className="flex flex-col items-center gap-4">
            <button
                onClick={handleShare}
                className="p-2 border-[1.5px] border-black hover:bg-black hover:text-white transition-colors group focus:outline-none rounded-none bg-white text-black"
                aria-label="Copy link to share this article"
                title="Copy Link"
            >
                <Share className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center gap-1 text-black font-bold uppercase tracking-widest mt-4" title="Lượt xem">
                <EyeIcon className="w-4 h-4 mb-1" />
                <span className="text-[10px]">
                {displayViews === null ? '...' : displayViews.toLocaleString()}
                </span>
            </div>

            <div className="h-px w-6 bg-black my-4" />

            <div className="flex flex-col gap-3">
                <Link
                href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                className="p-2 border-[1.5px] border-black hover:bg-black hover:text-white transition-colors rounded-none bg-white text-black"
                target="_blank"
                rel="noopener noreferrer nofollow"
                aria-label="Share on Twitter"
                title="Share on Twitter"
                >
                <FaTwitter className="w-4 h-4" />
                </Link>
                <Link
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                className="p-2 border-[1.5px] border-black hover:bg-black hover:text-white transition-colors rounded-none bg-white text-black"
                target="_blank"
                rel="noopener noreferrer nofollow"
                aria-label="Share on Facebook"
                title="Share on Facebook"
                >
                <FaFacebook className="w-4 h-4" />
                </Link>
                <Link
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                className="p-2 border-[1.5px] border-black hover:bg-black hover:text-white transition-colors rounded-none bg-white text-black"
                target="_blank"
                rel="noopener noreferrer nofollow"
                aria-label="Share on LinkedIn"
                title="Share on LinkedIn"
                >
                <FaLinkedin className="w-4 h-4" />
                </Link>
            </div>
            </div>
        </div>
    </aside>
  );
};

export default BlogShareSidebar;