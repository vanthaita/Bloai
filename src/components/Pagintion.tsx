import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 3;
    const boundaryPages = 1; 
  
    if (totalPages <= maxVisiblePages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
  
      const leftRange = boundaryPages + 1;
      const rightRange = totalPages - boundaryPages;
  
      if (currentPage <= leftRange) {
        for (let i = 2; i <= leftRange + 1; i++) {
          pages.push(i);
        }
        if (totalPages > leftRange + 2) {
          pages.push('...');
        }
        pages.push(totalPages);
      } else if (currentPage >= rightRange) {
        pages.push('...');
        for (let i = rightRange; i < totalPages; i++) {
          pages.push(i);
        }
        pages.push(totalPages);
      } else {
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
  
    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav aria-label="Pagination" className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
      <div className="text-sm text-gray-600 dark:text-gray-400 hidden md:block">
       Trang {currentPage} / {totalPages}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon" 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-9 w-9 p-0 border-[#e4d9c8] text-[#554640] hover:bg-[#3A6B4C]/10 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pageNumbers.map((page, index) => (
          page === '...' ? (
            <Button
              key={`ellipsis-${index}`}
              variant="outline"
              size="icon"
              className="h-9 w-9 p-0 border-[#e4d9c8] text-[#554640] hover:bg-[#3A6B4C]/10 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 cursor-default"
              disabled
            >
              ...
            </Button>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? 'default' : 'outline'}
              size="icon" 
              onClick={() => onPageChange(page as number)}
              className={cn(
                'h-9 w-9 p-0',
                page === currentPage
                  ? 'bg-[#3A6B4C] text-white hover:bg-[#2E5540] dark:bg-[#4F7359] dark:hover:bg-[#3A6B4C]' 
                  : 'border-[#e4d9c8] text-[#554640] hover:bg-[#3A6B4C]/10 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
              )}
              aria-current={page === currentPage ? 'page' : undefined}
              aria-label={page === currentPage ? `Current page, Page ${page}` : `Go to page ${page}`}
            >
              {page}
            </Button>
          )
        ))}

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-9 w-9 p-0 border-[#e4d9c8] text-[#554640] hover:bg-[#3A6B4C]/10 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
          aria-label="Go to next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400 hidden md:block">
      </div>
    </nav>
  );
};

export default Pagination;