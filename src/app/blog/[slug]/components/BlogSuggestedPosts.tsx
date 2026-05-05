import React from 'react';
import AuthorCard from './BlogAuthorCard';
import SuggestedBlogCard from './SuggestedBlogCard';
import { Author, SuggestedBlog } from '@/types/helper.type';

interface BlogSuggestedPostsProps {
    author: Author | null;
    suggestedBlogs?: SuggestedBlog[] | null;
}

const BlogSuggestedPosts: React.FC<BlogSuggestedPostsProps> = ({ author, suggestedBlogs }) => {
    if (!suggestedBlogs || suggestedBlogs.length === 0) return null;

    return (
        <section className="w-full">
            <h2 className="text-2xl font-bold text-black uppercase tracking-widest mb-8 border-b-[3px] border-black pb-2 inline-block">
                Bài viết liên quan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {suggestedBlogs.map((post) => (
                    <SuggestedBlogCard key={post.slug} post={post} />
                ))}
            </div>
        </section>
    );
};

export default BlogSuggestedPosts;