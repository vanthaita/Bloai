'use client';

import { CldImage } from 'next-cloudinary';
import React from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
  quality?: 'auto:eco' | 'auto:good' | 'auto';
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px',
  quality = 'auto:eco',
}: OptimizedImageProps) {
  return (
    <CldImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'low'}
      className={className}
      sizes={sizes}
      crop="fill"
      gravity="auto"
      quality={priority ? 'auto:good' : quality}
      format="auto"
      dpr="1.0"
    />
  );
}
