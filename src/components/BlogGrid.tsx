import React from 'react';
import { FaEye, FaHeart, FaComment, FaBookOpen } from 'react-icons/fa';
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import Link from 'next/link';
interface Post {
  id: string | number,
  title: string,
  imageUrl:  string,
  author:  string,
  readTime:  string,
  views: number,
  likes: number,
  comments: number,
  tags: string[]
}
type BlogGridProps = {
  expanded: boolean,
  posts: Post[]
}

const tagColors: { [key: string]: string } = {
  'JavaScript': 'bg-amber-500/80',
  'AI': 'bg-purple-600/80',
  'React': 'bg-cyan-600/80',
  'Next.js': 'bg-black/80',
  'Web Dev': 'bg-emerald-600/80',
  'Featured': 'bg-rose-600/80',
  'Trending': 'bg-orange-500/80',
  'Technology': 'bg-blue-600/80'
};

export function BlogGrid({ expanded = false, posts }: BlogGridProps) {
  return (
    <BentoGrid expanded={expanded} className="max-w-8xl mx-auto px-4">
      {posts.map((post) => (
        <Link href={`/blog/${post.id}`} key={post.id}>
          <BentoGridItem className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden hover:shadow-2xl transition-all cursor-pointer group relative border border-gray-100 dark:border-gray-800">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={post.imageUrl} 
                alt={post.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent" />
              
              <div className="absolute top-3 left-3 flex gap-2">
                {post.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className={`px-3 py-1 ${tagColors[tag] || 'bg-gray-800/80'} text-white text-xs font-semibold rounded-full backdrop-blur-sm`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {post.title}
              </h2>

              <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center space-x-1">
                  <FaBookOpen className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </span>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">{post.author}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <FaEye className="w-5 h-5 text-blue-500/80" />
                    <span>{post.views >= 1000 ? `${(post.views/1000).toFixed(1)}k` : post.views}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FaHeart className="w-5 h-5 text-rose-500/80" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FaComment className="w-5 h-5 text-emerald-500/80" />
                    <span>{post.comments}</span>
                  </div>
                </div>
                {post.tags.includes('Featured') && (
                  <div className="px-3 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 text-xs font-medium rounded-full">
                    Featured
                  </div>
                )}
              </div>
            </div>

            {post.tags.includes('Trending') && (
              <div className="absolute top-0 right-0 bg-orange-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                TRENDING
              </div>
            )}
          </BentoGridItem>
        </Link>
      ))}
    </BentoGrid>
  );
}