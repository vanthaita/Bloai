import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

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

  const searchParams = useSearchParams();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('page', page.toString());
    return `?${params.toString()}`;
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
      className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 w-full border-t-2 border-black pt-6 mt-12", className)}
    >
      <div className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-black hidden md:block">
        Trang {currentPage} / {totalPages}
      </div>

      <div className="flex items-center gap-1">
        {currentPage > 1 ? (
          <Link
            href={createPageUrl(currentPage - 1)}
            scroll={false}
            onClick={() => handlePageChange(currentPage - 1)}
            className="flex items-center justify-center h-10 w-10 p-0 border-[1.5px] border-black rounded-none text-black bg-white hover:bg-black hover:text-white transition-colors"
            aria-label="Trang trước"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
        ) : (
          <Button
            variant="outline"
            size="icon" 
            disabled
            className="h-10 w-10 p-0 border-[1.5px] border-black rounded-none text-black bg-white opacity-30 cursor-not-allowed"
            aria-label="Trang trước"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        {pageNumbers.map((page, index) => (
          page === '...' ? (
            <div
              key={`ellipsis-${index}`}
              className="h-10 w-10 flex items-center justify-center text-black font-bold tracking-[0.2em]"
              aria-hidden="true"
            >
              ...
            </div>
          ) : (
            <Link
              key={page}
              href={createPageUrl(page as number)}
              scroll={false}
              onClick={() => handlePageChange(page as number)}
              className={cn(
                'flex items-center justify-center h-10 w-10 p-0 border-[1.5px] border-black rounded-none text-xs font-bold transition-colors',
                page === currentPage
                  ? 'bg-black text-white hover:bg-gray-800 hover:text-white' 
                  : 'bg-white text-black hover:bg-black hover:text-white'
              )}
              aria-current={page === currentPage ? 'page' : undefined}
              aria-label={`Trang ${page}`}
            >
              {page}
            </Link>
          )
        ))}

        {currentPage < totalPages ? (
          <Link
            href={createPageUrl(currentPage + 1)}
            scroll={false}
            onClick={() => handlePageChange(currentPage + 1)}
            className="flex items-center justify-center h-10 w-10 p-0 border-[1.5px] border-black rounded-none text-black bg-white hover:bg-black hover:text-white transition-colors"
            aria-label="Trang sau"
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <Button
            variant="outline"
            size="icon"
            disabled
            className="h-10 w-10 p-0 border-[1.5px] border-black rounded-none text-black bg-white opacity-30 cursor-not-allowed"
            aria-label="Trang sau"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-black hidden md:block">
        Tổng cộng: {totalPages} trang
      </div>
    </nav>
  );
};

export default Pagination;