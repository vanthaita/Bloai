import React from 'react';
import Image from 'next/image';

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
      <div className="relative w-full h-40 overflow-hidden rounded-t-lg">
        <Image src={imageUrl} alt="Post image" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
      </div>
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
