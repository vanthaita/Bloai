"use client";

interface SearchPaginationProps {
  currentPage: number;
  totalPages: number;
  isFetching: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function SearchPagination({
  currentPage,
  totalPages,
  isFetching,
  onPrev,
  onNext,
}: SearchPaginationProps) {
  if (totalPages <= 1) return null;

  const btnClass =
    "text-[10px] font-bold uppercase tracking-widest px-3 py-2 text-black bg-white rounded-none border-[1.5px] border-black hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black focus:outline-none transition-colors";

  return (
    <div className="flex justify-between items-center px-3 py-3 border-t-[1.5px] border-black mt-0 bg-white">
      <button
        onClick={(e) => { e.preventDefault(); onPrev(); }}
        disabled={currentPage === 1 || isFetching}
        className={btnClass}
        onMouseDown={(e) => e.preventDefault()}
      >
        Trang trước
      </button>
      <span className="text-[10px] font-bold uppercase tracking-widest text-black">
        {currentPage} / {totalPages}
      </span>
      <button
        onClick={(e) => { e.preventDefault(); onNext(); }}
        disabled={currentPage === totalPages || isFetching}
        className={btnClass}
        onMouseDown={(e) => e.preventDefault()}
      >
        Trang sau
      </button>
    </div>
  );
}
