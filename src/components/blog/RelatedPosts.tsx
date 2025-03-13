import React from 'react';
import { Blog } from '@/types/blog';
import Link from 'next/link';

interface RelatedPostsProps {
  posts: Blog[];
}

const RelatedPosts = ({ posts }: RelatedPostsProps) => {
  return (
    <div className="sticky top-6">
      <h3 className="text-lg font-semibold mb-4">Related Posts</h3>
      <div className="space-y-4">
        {posts.map((post) => (
          <Link 
            href={`/blog/${post.id}`} 
            key={post.id} 
            className="block group"
          >
            <div className="cursor-pointer">
              <img 
                src={post.image}
                alt={post.title}
                className="w-full h-32 object-cover rounded-lg mb-2"
              />
              <h4 className="font-medium group-hover:text-blue-600 transition-colors line-clamp-2">
                {post.title}
              </h4>
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <span>{post.author.name}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;
