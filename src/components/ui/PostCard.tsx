import React from 'react';

interface PostCardProps {
  title: string;
  description: string;
  views: number;
  likes: number;
  comments: number;
  imageUrl: string;
}

const PostCard = ({ title, description, views, likes, comments, imageUrl }: PostCardProps) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <img src={imageUrl} alt="Post image" className="w-full h-40 object-cover rounded-t-lg" />
      <h2 className="text-xl font-bold mt-4">{title}</h2>
      <p className="text-gray-600">{description}</p>
      <div className="flex justify-between mt-4 text-sm text-gray-500">
        <span>{views} Views</span>
        <span>{likes} Likes</span>
        <span>{comments} Comments</span>
      </div>
    </div>
  );
};

export default PostCard;
