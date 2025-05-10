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
    <div className="flex flex-col gap-4 mb-12">
      <div className="flex flex-wrap justify-center gap-2">
        {visibleTags.map((tag) => (
          <Button
            key={tag.value}
            variant={'outline'}
            size="sm"
            className={cn(
              "rounded-full h-auto py-1.5 px-4 font-medium transition-all",
              "border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900",
              "shadow-sm hover:shadow-md",
              activeFilter === tag.value && 
                'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 hover:text-white'
            )}
            onClick={() => handleFilterClick(tag.value)}
          >
            #{tag.label}
            {activeFilter === tag.value && (
              <span className="ml-1.5">✓</span>
            )}
          </Button>
        ))}
        {hasMoreTags && (
            <Button
              asChild
              variant={'outline'}
              size="sm"
              className={cn(
                "rounded-full h-auto py-1.5 px-4 font-medium",
                "border-gray-200 text-gray-700 hover:bg-gray-50",
                "shadow-sm hover:shadow-md"
              )}
            >
              <Link href={moreTagsLink} >
              View all tags →
              </Link>

            </Button>
        )}
      </div>
    </div>
  );
}