import React from 'react';

interface BlogPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

const BlogPreviewModal: React.FC<BlogPreviewModalProps> = ({ isOpen, onClose, title, description }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="mb-4">{description}</p>
        <button onClick={onClose} className="bg-blue-600 text-white px-4 py-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default BlogPreviewModal; 