'use client'

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface FilterTag {
  label: string;
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
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-semibold text-gray-800">#Tags</h3>
        <div className="h-px flex-1 bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200 opacity-50"></div>
      </div>
      <div className="flex flex-wrap justify-start gap-3">
        {visibleTags.map((tag) => (
          <Button
            key={tag.label}
            variant={'outline'}
            size="sm"
            className={cn(
              "rounded-lg h-auto py-1.5 px-4 font-medium transition-all",
              "border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900",
              "shadow-sm hover:shadow-md hover:scale-105 active:scale-95",
              "group relative overflow-hidden",
              activeFilter === tag.label 
                ? 'bg-emerald-600/10 text-emerald-700 border-emerald-600/30 hover:bg-emerald-600/15 hover:text-emerald-800'
                : 'hover:border-gray-300'
            )}
            onClick={() => handleFilterClick(tag.label)}
          >
            <span className="relative z-10">
              #{tag.label}
              {activeFilter === tag.label && (
                <span className="ml-1.5">✓</span>
              )}
            </span>
            {activeFilter === tag.label && (
              <span className="absolute inset-0 bg-emerald-600/5 rounded-full"></span>
            )}
          </Button>
        ))}
        
        {hasMoreTags && (
          <Button
            asChild
            variant={'outline'}
            size="sm"
            className={cn(
              "rounded-lg h-auto py-1.5 px-4 font-medium",
              "border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              "shadow-sm hover:shadow-md hover:scale-105 active:scale-95",
              "transition-all hover:border-gray-300"
            )}
          >
            <Link href={moreTagsLink} className='flex'>
              <span className="flex items-center gap-1">
                See More 
              </span>
              <ArrowRight />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}