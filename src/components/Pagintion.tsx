import React from 'react'; // No 'use client' needed here
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming this component exists
import { cn } from '@/lib/utils'; // Assuming this utility exists

// Define props interface for type safety
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  // Optional: If you need to display total item count from parent
  // totalItems?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage = 1, // Default values
  totalPages = 1,
  onPageChange,
  // totalItems
}) => {

  // Helper function to generate page numbers with ellipsis logic
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5; // Number of page buttons to show around current page
    const halfVisible = Math.floor(maxVisiblePages / 2);

    if (totalPages <= maxVisiblePages + 2) { // Show all pages if not too many
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Ellipsis after first page?
      if (currentPage > halfVisible + 2) {
        pages.push('...');
      }

      // Calculate start and end for middle pages
      let startPage = Math.max(2, currentPage - halfVisible);
      let endPage = Math.min(totalPages - 1, currentPage + halfVisible);

      // Adjust if near the beginning
      if (currentPage <= halfVisible + 1) {
         endPage = Math.min(totalPages - 1, maxVisiblePages);
      }
       // Adjust if near the end
      if (currentPage >= totalPages - halfVisible) {
         startPage = Math.max(2, totalPages - maxVisiblePages + 1);
      }


      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Ellipsis before last page?
      if (currentPage < totalPages - halfVisible - 1) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Don't render if only one page or fewer
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav aria-label="Pagination" className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
      {/* Optional: Showing page X of Y */}
      <div className="text-sm text-gray-600 dark:text-gray-400 hidden md:block">
        Page {currentPage} of {totalPages}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="icon" // Use icon size for better consistency
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-9 w-9 p-0 border-[#e4d9c8] text-[#554640] hover:bg-[#3A6B4C]/10 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page Number Buttons */}
        {pageNumbers.map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
              ...
            </span>
          ) : (
          <Button
            key={page}
            variant={page === currentPage ? 'default' : 'outline'} // Use 'default' variant for active
            size="icon" // Use icon size
            onClick={() => onPageChange(page as number)} // Cast page to number
            className={cn(
              'h-9 w-9 p-0',
              page === currentPage
                ? 'bg-[#3A6B4C] text-white hover:bg-[#2E5540] dark:bg-[#4F7359] dark:hover:bg-[#3A6B4C]' // Active styles
                : 'border-[#e4d9c8] text-[#554640] hover:bg-[#3A6B4C]/10 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700' // Inactive styles
            )}
            aria-current={page === currentPage ? 'page' : undefined}
            aria-label={page === currentPage ? `Current page, Page ${page}` : `Go to page ${page}`}
          >
            {page}
          </Button>
          )
        ))}

        {/* Next Button */}
        <Button
          variant="outline"
          size="icon" // Use icon size
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-9 w-9 p-0 border-[#e4d9c8] text-[#554640] hover:bg-[#3A6B4C]/10 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
          aria-label="Go to next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

       {/* Optional: Total Items - Needs totalItems prop passed */}
       {/* {totalItems !== undefined && (
          <div className="text-sm text-gray-600 dark:text-gray-400 hidden md:block">
             {totalItems} Results
          </div>
       )} */}
       {/* Remove the hardcoded 'X Blog' display or make it dynamic */}
       <div className="text-sm text-gray-600 dark:text-gray-400 hidden md:block">
          {/* Placeholder - maybe remove or use totalItems */}
       </div>
    </nav>
  );
};

export default Pagination;