import React from 'react';
import RelatedPosts from '@/components/blog/RelatedPosts';
import BlogContent from '@/components/blog/BlogContent';
import Discussion from '@/components/blog/Discussion';
import { Blog } from '@/types/blog';

// Thêm params để lấy id từ URL
interface PageProps {
  params: {
    id: string;
  }
}

// Tạm thời mock data, sau này sẽ fetch từ API/Database
async function fetchBlogData(id: string): Promise<Blog> {
  // Mock data
  return {
    id,
    title: "Chat with posts using AI",
    content: "Lorem ipsum dolor sit amet...",
    author: {
      name: "John Doe",
      avatar: "/avatar.jpg"
    },
    publishDate: "2024-03-15",
    readTime: "5 min read",
    image: "/blog-hero.jpg",
    comments: []
  };
}

async function fetchRelatedPosts(id: string): Promise<Blog[]> {
  // Mock data
  return [
    {
      id: "1",
      title: "Related Post 1",
      content: "...",
      author: {
        name: "Jane Smith",
        avatar: "/avatar.jpg"
      },
      publishDate: "2024-03-14",
      readTime: "3 min read",
      image: "/related-1.jpg",
      comments: []
    },
    // Thêm các related posts khác...
  ];
}

export default async function BlogPost({ params }: PageProps) {
  // Đảm bảo params.id tồn tại trước khi sử dụng
  if (!params?.id) {
    return <div>Invalid blog ID</div>;
  }

  try {
    const blogData = await fetchBlogData(params.id);
    const relatedPosts = await fetchRelatedPosts(params.id);

    if (!blogData) {
      return <div>Blog not found</div>;
    }

    return (
      <div className="flex min-h-screen">
        {/* Main content */}
        <div className="flex-1 max-w-4xl mx-auto px-4 py-6">
          <BlogContent blog={blogData} />
          <Discussion comments={blogData.comments} />
        </div>
        
        {/* Right sidebar - Related posts */}
        <div className="hidden lg:block w-80 p-6 border-l">
          <RelatedPosts posts={relatedPosts} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return <div>Error loading blog</div>;
  }
}
