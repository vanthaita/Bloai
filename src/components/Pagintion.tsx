import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className,
}) => {
  const getPageNumbers = (): (number | '...')[] => {
    const visiblePages: (number | '...')[] = [];
    
    visiblePages.push(1);
    
    if (totalPages <= 7) {
      for (let i = 2; i <= totalPages; i++) {
        visiblePages.push(i);
      }
      return visiblePages;
    }
    
    const leftBound = Math.max(2, currentPage - 1);
    const rightBound = Math.min(totalPages - 1, currentPage + 1);
    
    if (leftBound > 2) {
      visiblePages.push('...');
    }
    
    for (let i = leftBound; i <= rightBound; i++) {
      visiblePages.push(i);
    }
    
    if (rightBound < totalPages - 1) {
      visiblePages.push('...');
    }
    
    if (totalPages > 1) {
      visiblePages.push(totalPages);
    }
    
    return visiblePages;
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav 
      aria-label="Pagination" 
      className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 w-full", className)}
    >
      <div className="text-sm text-gray-600 dark:text-gray-400 hidden md:block">
        Trang {currentPage} / {totalPages}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon" 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-9 w-9 p-0 border-[#e4d9c8] text-[#554640] hover:bg-[#3A6B4C]/10 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
          aria-label="Trang trước"
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
              aria-hidden="true"
            >
              ...
            </Button>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? 'default' : 'outline'}
              size="icon" 
              onClick={() => handlePageChange(page)}
              className={cn(
                'h-9 w-9 p-0',
                page === currentPage
                  ? 'bg-[#3A6B4C] text-white hover:bg-[#2E5540] dark:bg-[#4F7359] dark:hover:bg-[#3A6B4C]' 
                  : 'border-[#e4d9c8] text-[#554640] hover:bg-[#3A6B4C]/10 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
              )}
              aria-current={page === currentPage ? 'page' : undefined}
              aria-label={`Trang ${page}`}
            >
              {page}
            </Button>
          )
        ))}

        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-9 w-9 p-0 border-[#e4d9c8] text-[#554640] hover:bg-[#3A6B4C]/10 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
          aria-label="Trang sau"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400 hidden md:block">
        {totalPages} trang tổng cộng
      </div>
    </nav>
  );
};

export default Pagination;