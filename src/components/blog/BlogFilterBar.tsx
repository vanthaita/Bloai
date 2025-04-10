'use client' 

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FilterTag {
  label: string;
  value: string;
}

interface BlogFilterBarProps {
  tags: FilterTag[];
  activeFilter: string;
  onFilterChange: (filterValue: string) => void;
  maxVisibleTags?: number;
  moreTagsLink?: string;
}

export function BlogFilterBar({
  tags,
  activeFilter,
  onFilterChange,
  maxVisibleTags = 12,
  moreTagsLink = '/tags' 
}: BlogFilterBarProps) {

  if (!tags || tags.length === 0) {
    return null;
  }

  const visibleTags = tags.slice(0, maxVisibleTags);
  const hasMoreTags = tags.length > maxVisibleTags;

  const handleFilterClick = (tagValue: string) => {
    onFilterChange(activeFilter === tagValue ? '' : tagValue);
  };

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {visibleTags.map((tag) => (
        <Button
          key={tag.value}
          variant={'outline'}
          size="sm"
          className={cn(
            "rounded-full h-auto py-1.5 px-4 font-medium transition-all border-[#D1D5DB] text-gray-900 hover:bg-gray-100",
            activeFilter === tag.value && 'bg-[#3A6B4C] text-white border-[#3A6B4C] hover:bg-[#3A6B4C]/90'
          )}
          onClick={() => handleFilterClick(tag.value)}
        >
          {tag.label}
        </Button>
      ))}
      {hasMoreTags && (
        <Link href={moreTagsLink} passHref legacyBehavior>
             <Button
               variant={'outline'}
               size="sm"
               className={cn(
                 "rounded-full h-auto py-1.5 px-4 font-medium transition-all border-[#D1D5DB] text-gray-900 hover:bg-gray-100 underline",
               )}
             >
               + More
             </Button>
        </Link>
      )}
    </div>
  );
}