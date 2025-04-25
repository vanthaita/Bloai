'use client'
import { uploadImageToCloudinary } from '@/lib/uploadImageUrl';
import dynamic from 'next/dynamic'
import { useCallback, useState, useRef } from 'react'
import { toast } from 'react-toastify';

type Props = {
    value: string | undefined;
    onChange: (value: string | undefined) => void;
    'aria-labelledby'?: string;
}

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  {
    ssr: false, 
    loading: () => (
      <div className="h-[500px] w-full animate-pulse bg-gray-100 rounded-md border" />
    )
  }
)

export const EditorWrapper = ({ value, onChange, 'aria-labelledby': ariaLabelledby }: Props) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
        handleFileUpload(files[0] as any)
    }
}


  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        handleFileUpload(e.target.files[0] as any)
    }
  }
  const isCheckImageUrlUploaded = (altText: string) => {
    if (!value) {
      return false;
    }
    const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
    const matches = [...value.matchAll(imageRegex)];
    return matches.some(match => {
      const existingAltText = match[1]; 
      return existingAltText === altText;
    });
  }
  const handleFileUpload = useCallback(async (file: File) => {
    setIsUploading(true);
  
  try {
    if (isCheckImageUrlUploaded(file.name)) {
      toast.warning(`Ảnh "${file.name}" đã tồn tại trong nội dung`);
      return;
    }
    const tempMarkdown = `[Uploading ${file.name}...]`;
    const newValue = value ? `${value}\n${tempMarkdown}` : tempMarkdown;
    onChange(newValue);
    const cloudinaryUrl = await uploadImageToCloudinary(
      file,
      {
        quality: 'auto',
        format: 'webp',
        width: 1200,
      }
    );

    if (!cloudinaryUrl) {
      throw new Error('Không nhận được URL từ Cloudinary');
    }

    const markdownImage = `![${file.name}](${cloudinaryUrl})`;
    const finalValue = value ? 
      `${value}\n${markdownImage}`.replace(tempMarkdown, markdownImage) : 
      markdownImage;
      
    onChange(finalValue);
    toast.success(`Tải lên ảnh "${file.name}" thành công!`);
  } catch (error) {
    console.error('Upload error:', error);
    if (value && value.includes('[Uploading')) {
      onChange(value.replace(/\[Uploading[^\]]*\]/g, ''));
    }
    alert('Tải lên ảnh thất bại. Vui lòng thử lại.');
  } finally {
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }
  }, [value, onChange]);

  const triggerFileInput = () => {
      if (!isUploading) {
          fileInputRef.current?.click();
      }
  };

  return (
      <div data-color-mode="light" className="relative">
          <MDEditor
              value={value}
              onChange={onChange}
              height={500}
              preview="live"
              aria-labelledby={ariaLabelledby}
              onDragEnter={handleDragEnter}
          />
          
          {isDragging && (
              <div
                  className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center border-2 border-dashed border-blue-500 rounded-lg z-10"
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
              >
                  <div className="text-center p-6">
                      <p className="text-lg font-medium text-blue-600">
                          Drop your image here to upload
                      </p>
                  </div>
              </div>
          )}
          
          {isUploading && (
              <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                  <div className="text-center p-6">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                      <p className="text-lg font-medium text-gray-700">Uploading image...</p>
                  </div>
              </div>
          )}
          
          <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileInputChange}
              accept="image/*"
              disabled={isUploading}
          />
          
          <div className="mt-2 text-center">
              <button
                  type="button"
                  onClick={triggerFileInput}
                  className={`text-sm ${isUploading ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800 hover:underline'}`}
                  disabled={isUploading}
              >
                  {isUploading ? 'Uploading...' : 'Drop or click here to upload an image'}
              </button>
          </div>
      </div>
    );
};