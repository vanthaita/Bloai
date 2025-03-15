import { Blog } from '@/types/blog';
import { FaEye, FaHeart, FaComment } from 'react-icons/fa';

interface BlogContentProps {
  blog: Blog;
}

const BlogContent = ({ blog }: BlogContentProps) => {
  if (!blog?.tags) {
    return null;
  }
  return (
    <article className="max-w-none mb-12">
      <div className="relative h-[500px] group mb-8">
        <img 
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-lg" />
        
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <div className="flex gap-2 mb-4">
            {blog.tags.map((tag, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-primary-600 text-white text-sm font-medium rounded"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-4xl font-bold mb-4 group-hover:text-primary-600 transition-colors">
            {blog.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <img 
                src={blog.author.avatar}
                alt={blog.author.name}
                className="w-8 h-8 rounded-full"
              />
              <span>{blog.author.name}</span>
            </div>
            <span>•</span>
            <span>{blog.readTime}</span>
            <span>•</span>
            <span>{blog.publishDate}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 mb-8 text-sm text-content-secondary">
        <div className="flex items-center gap-2">
          <FaComment className="text-primary-500" />
          <span>{blog.comments.length} comments</span>
        </div>
      </div>

      <div 
        className="prose prose-lg max-w-none prose-headings:text-content-primary prose-p:text-content-secondary
          prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-content-primary prose-code:text-primary-600 prose-code:bg-primary-50
          prose-pre:bg-gray-900 prose-pre:text-gray-100
          prose-img:rounded-lg prose-img:shadow-md"
        dangerouslySetInnerHTML={{ __html: blog.content }} 
      />

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        {blog.comments.map((comment) => (
          <div key={comment.id} className="mb-4">
            <div className="flex items-center gap-2">
              <img 
                src={comment.author.avatar}
                alt={comment.author.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="font-bold">{comment.author.name}</span>
              <span className="text-sm text-gray-500">{comment.createdAt}</span>
            </div>
            <p className="text-content-secondary mt-2">{comment.content}</p>
          </div>
        ))}
      </div>
    </article>
  );
};

export default BlogContent;