import React from 'react';
import { Comment } from '@/types/blog';

interface DiscussionProps {
  comments: Comment[];
}

const Discussion = ({ comments }: DiscussionProps) => {
  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold mb-6">Discussion</h2>
      
      {/* Comment form */}
      <div className="mb-8">
        <textarea 
          placeholder="Add to the discussion"
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                   resize-none transition-all"
          rows={4}
        />
        <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg 
                         hover:bg-blue-700 transition-colors">
          Comment
        </button>
      </div>

      {/* Comments list */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <img 
                src={comment.author.avatar} 
                alt={comment.author.name} 
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{comment.author.name}</span>
                  <span className="text-sm text-gray-500">• {comment.createdAt}</span>
                </div>
                <p className="text-gray-700">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Discussion;
