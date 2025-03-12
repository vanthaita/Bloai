import React from 'react';
import { FaEye, FaHeart, FaComment } from 'react-icons/fa';
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import Link from 'next/link';

const posts = [
  {
    id: 1,
    title: '15 Advanced JavaScript Tricks for Experienced Developers',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    author: 'John Doe',
    readTime: '4 min read',
    views: 159,
    likes: 8,
    comments: 3,
    tags: ['JavaScript', 'Programming']
  },
  {
    id: 2,
    title: 'How to Build a Local RAG with DeepSeek-R1, LangChain, and Ollama',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    author: 'Jane Smith',
    readTime: '6 min read',
    views: 245,
    likes: 12,
    comments: 5,
    tags: ['AI', 'Machine Learning']
  },
  {
    id: 3,
    title: 'This AI deepfake tool is WAY too real. Full body animation',
    imageUrl: 'https://picsum.photos/400/300?random=3',
    author: 'Mike Johnson',
    readTime: '3 min read',
    views: 532,
    likes: 24,
    comments: 8,
    tags: ['AI', 'Technology']
  },
  {
    id: 4,
    title: '50+ HOURS REACT.JS 19 MONSTER CLASS',
    imageUrl: 'https://picsum.photos/400/300?random=4',
    author: 'Sarah Wilson',
    readTime: '8 min read',
    views: 421,
    likes: 18,
    comments: 6,
    tags: ['React', 'JavaScript']
  },
  {
    id: 5,
    title: 'Time will never be the same!',
    imageUrl: 'https://picsum.photos/400/300?random=5',
    author: 'Alex Brown',
    readTime: '5 min read',
    views: 312,
    likes: 15,
    comments: 4,
    tags: ['Technology', 'Future']
  },
  {
    id: 6,
    title: 'The Accent Oracle',
    imageUrl: 'https://picsum.photos/400/300?random=6',
    author: 'Chris Davis',
    readTime: '7 min read',
    views: 189,
    likes: 9,
    comments: 3,
    tags: ['AI', 'Language']
  }
];

interface BlogGridProps {
  expanded?: boolean;
}

export function BlogGrid({ expanded = false }: BlogGridProps) {
  return (
    <BentoGrid expanded={expanded}>
      {posts.map((post) => (
        <Link href={`/blog/${post.id}`} key={post.id}>
          <BentoGridItem className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
            <div className="relative">
              <img 
                src={post.imageUrl} 
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 left-2 flex gap-2">
                {post.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span>{post.author}</span>
                <span className="mx-2">•</span>
                <span>{post.readTime}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <FaEye className="text-blue-500" />
                  <span>{post.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaHeart className="text-blue-500" />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaComment className="text-blue-500" />
                  <span>{post.comments}</span>
                </div>
              </div>
            </div>
          </BentoGridItem>
        </Link>
      ))}
    </BentoGrid>
  );
}