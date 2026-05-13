import Image from 'next/image';
import React from 'react';
import { buildCldUrl, CldQuality } from '@/lib/cldUrl';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
  quality?: CldQuality;
  fill?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  sizes = '(max-width: 480px) calc(100vw - 32px), (max-width: 768px) calc(50vw - 24px), (max-width: 1200px) calc(50vw - 24px), 600px',
  quality = 'auto:eco',
  fill = false,
}: OptimizedImageProps) {
  const url = buildCldUrl(src, width, height, priority ? 'auto:good' : quality);

  if (fill) {
    return (
      <Image
        src={url}
        alt={alt}
        fill
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'low'}
        className={className}
        sizes={sizes}
      />
    );
  }

  return (
    <Image
      src={url}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'low'}
      className={className}
      sizes={sizes}
    />
  );
}
