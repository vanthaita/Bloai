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
        <aside className="w-full lg:w-72 shrink-0 self-start">
            <div className="lg:sticky lg:top-28 space-y-8">
                <div className="block lg:hidden">
                    {(suggestedBlogs && suggestedBlogs.length > 0) && (
                        <div className='bg-white p-2 rounded-xl shadow-md border border-gray-200 mb-8'>
                            <div className='flex items-center mb-5'>
                                <div className='w-1.5 h-6 bg-[#3A6B4C] rounded-full mr-3'></div>
                                <h2 className="text-xl font-bold text-gray-900">Bài viết liên quan</h2>
                            </div>
                            <div className='space-y-5'>
                                {suggestedBlogs.map((post, index) => (
                                    <React.Fragment key={post.slug}>
                                        <SuggestedBlogCard post={post} />
                                        {index < suggestedBlogs.length - 1 && (
                                            <div className='border-t border-gray-100'></div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

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

                <div className="hidden lg:block">
                    {(suggestedBlogs && suggestedBlogs.length > 0) && (
                        <div className='bg-white p-2 rounded-xl shadow-md border border-gray-200'>
                            <div className='flex items-center mb-5'>
                                <div className='w-1.5 h-6 bg-[#3A6B4C] rounded-full mr-3'></div>
                                <h2 className="text-xl font-bold text-gray-900">Bài viết liên quan</h2>
                            </div>
                            <div className='overflow-y-auto max-h-[calc(100vh-150px)] space-y-5 scroll-custom pr-2 -mr-2'>
                                {suggestedBlogs.map((post, index) => (
                                    <React.Fragment key={post.slug}>
                                        <SuggestedBlogCard post={post} />
                                        {index < suggestedBlogs.length - 1 && (
                                            <div className='border-t border-gray-100'></div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default BlogSuggestedPosts;