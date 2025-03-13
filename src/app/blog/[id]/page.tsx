'use client'
import React from 'react';
import RelatedPosts from '@/components/blog/RelatedPosts';
import BlogContent from '@/components/blog/BlogContent';
import Discussion from '@/components/blog/Discussion';
import { Blog } from '@/types/blog';
import { usePathname } from 'next/navigation'
export default async function BlogPost() {
  const pathname = usePathname(); 
  const segments = pathname.split('/');
  const id = segments[segments.length - 1];
  if (!id) {
    return <div>Invalid blog ID</div>;
  }

  // try {
  //   // const blogData = await fetchBlogData(id);
  //   // const relatedPosts = await fetchRelatedPosts(id);

  //   if (!blogData) {
  //     return <div>Blog not found</div>;
  //   }

  //   return (
  //     <div className="flex min-h-screen">
  //       {/* Main content */}
  //       <div className="flex-1 max-w-4xl mx-auto px-4 py-6">
  //         <BlogContent blog={blogData} />
  //         <Discussion comments={blogData.comments} />
  //       </div>

  //       {/* Right sidebar - Related posts */}
  //       <div className="hidden lg:block w-80 p-6 border-l">
  //         <RelatedPosts posts={relatedPosts} />
  //       </div>
  //     </div>
  //   );
  // } catch (error) {
  //   console.error('Error fetching blog data:', error);
  //   return <div>Error loading blog</div>;
  // }
  return <>
    <p>Test</p>
  </>
}
