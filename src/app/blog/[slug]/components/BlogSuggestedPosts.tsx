import React from 'react';
import AuthorCard from './BlogAuthorCard';
import SuggestedBlogCard from './SuggestedBlogCard';
import { Author, SuggestedBlog } from '@/types/helper.type';

interface BlogSuggestedPostsProps {
    author: Author | null;
    suggestedBlogs?: SuggestedBlog[] | null;
}

const BlogSuggestedPosts: React.FC<BlogSuggestedPostsProps> = ({ author, suggestedBlogs }) => {
    return (
        <aside className="md:block w-72 shrink-0 hidden self-start">
            <div className="sticky top-28 space-y-8">
                {author && (
                    <div className='bg-gradient-to-br from-gray-800 to-black p-1 rounded-2xl shadow-lg relative'>
                        <div className="p-4 bg-white rounded-xl">
                            <AuthorCard author={author} imageSize={80} showSocials={false} />
                        </div>
                        <div className='bg-black rounded-b-xl mt-0 py-2'>
                            <h2 className='text-white font-semibold text-lg text-center tracking-wide'>TÁC GIẢ</h2>
                        </div>
                    </div>
                )}

                {(suggestedBlogs && suggestedBlogs.length > 0) && (
                    <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-100'>
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">Bài viết liên quan</h2>
                        <div className='overflow-y-auto max-h-[calc(100vh-400px)] space-y-5 scroll-custom pr-2 -mr-2'>
                            {suggestedBlogs.map((post) => (
                                <SuggestedBlogCard key={post.slug} post={post} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default BlogSuggestedPosts;