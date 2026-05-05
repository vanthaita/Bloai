import { api } from '@/trpc/react';
import React, { useState, useEffect } from 'react';
import { FaSearch, FaCalendarAlt, FaUser } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { CldImage } from 'next-cloudinary';

const LIMIT = 4;
const DEBOUNCE_DELAY = 300;

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
}

const highlightMatch = (text: string, highlight: string): React.ReactNode => {
  if (!highlight.trim()) {
    return text; 
  }
  if (!text) {
    return text; 
  }

  const regex = new RegExp(`(${escapeRegExp(highlight)})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts
        .filter(part => part) 
        .map((part, index) =>
          regex.test(part) ? ( 
            <mark key={index} className="bg-yellow-200 text-black px-0.5 rounded-sm">
              {part}
            </mark>
          ) : (
            <span key={index}>{part}</span> 
          )
        )}
    </>
  );
};


const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
    const [currentPage, setCurrentPage] = useState(1);
    const [isFocused, setIsFocused] = useState(false);
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            if (searchTerm !== debouncedSearchTerm) {
              setCurrentPage(1);
            }
        }, DEBOUNCE_DELAY);

        return () => {
            clearTimeout(timerId);
        };
    }, [searchTerm]);

    const { data: blogSearchData, isLoading, error, isFetching } = api.blog.fullTextSearch.useQuery({
        searchTerm: debouncedSearchTerm,
        slug: '',
        page: currentPage,
        limit: LIMIT
    }, {
        enabled: debouncedSearchTerm.trim().length > 0 && isFocused
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setDebouncedSearchTerm(searchTerm);
        if (searchTerm !== debouncedSearchTerm) {
          setCurrentPage(1);
        }
        document.getElementById('main-search')?.focus();
    };

    const handleFocus = () => {
        setIsFocused(true);
        if (debouncedSearchTerm.trim().length > 0) {
        }
    };

    const handleBlur = () => {
        setTimeout(() => {
            setIsFocused(false);
        }, 200); 
    };


    const showDropdown = isFocused && debouncedSearchTerm.trim().length > 0;
    const showLoadingSpinner = (isLoading || (isFetching && !blogSearchData)) && debouncedSearchTerm.trim().length > 0 && isFocused;
    const showResultsArea = isFocused && debouncedSearchTerm.trim().length > 0 && (isLoading || isFetching || blogSearchData || error);


    return (
        <div className="relative py-4 w-full">
            <form onSubmit={handleSearch} className="relative w-full" noValidate>
                <label htmlFor="main-search" className="sr-only">Search content</label>
                <input
                    id="main-search"
                    type="search"
                    name="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="Tìm kiếm bài viết..."
                    className="w-full bg-white text-black border-[1.5px] border-black rounded-none
                            py-2 px-4 pl-10
                            text-xs font-bold uppercase tracking-widest placeholder:text-gray-400 placeholder:normal-case
                            outline-none focus:ring-1 focus:ring-black transition-all"
                    aria-label="Search articles"
                    autoComplete="off"
                />
                <FaSearch
                    className="absolute left-3 top-1/2 -translate-y-1/2
                            w-3.5 h-3.5 text-black pointer-events-none"
                    aria-hidden="true"
                />

                {showResultsArea && (
                    <div className="absolute z-[100] mt-1 left-0 w-[85vw] sm:w-[450px] bg-white rounded-none shadow-none border-[1.5px] border-black max-h-[500px] overflow-y-auto hide-scrollbar">
                        {showLoadingSpinner ? (
                            <div className="flex justify-center py-6">
                                <div className="h-5 w-5 border-2 border-black border-t-transparent animate-spin"></div>
                            </div>
                        ) : error ? (
                            <div className="text-red-500 text-center p-4 text-xs font-bold">
                                Lỗi: {error.message}
                            </div>
                        ) : blogSearchData ? (
                            <div className="p-2">
                                <div className="flex justify-between items-center text-xs text-gray-500 px-3 py-2">
                                    <span>
                                        {blogSearchData.totalCount > 0
                                            ? `Found ${blogSearchData.totalCount} results for "`
                                            : `No results found for "`}
                                            <span className="font-medium">{debouncedSearchTerm}</span>"
                                    </span>
                                     {isFetching && (
                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 ml-2"></div>
                                     )}
                                </div>

                                <div className="space-y-1"> 
                                    {blogSearchData.results.length === 0 && !isFetching ? ( 
                                        <div className="text-gray-500 text-center p-4">Try refining your search.</div>
                                    ) : (
                                        blogSearchData.results.map((result) => (
                                            <Link
                                                key={result.id}
                                                href={`/blog/${result.slug}`}
                                                className="block p-3 hover:bg-black group rounded-none transition-colors border-b-[1.5px] border-black last:border-b-0 focus:outline-none focus:bg-black"
                                                onMouseDown={(e) => e.preventDefault()}
                                            >
                                                <div className="flex items-start space-x-3">
                                                    {result.imageUrl && (
                                                        <div className="flex-shrink-0 w-16 h-16 relative border-[1.5px] border-black">
                                                            <CldImage
                                                                width={300}
                                                                height={300}
                                                                src={result.imageUrl}
                                                                alt={result.imageAlt || result.title}
                                                                className="w-full h-full object-cover"
                                                                loading="lazy"
                                                                sizes="(max-width: 768px) 100vw, 600px"
                                                                crop="fill"
                                                                gravity="auto"
                                                                quality="auto:best"
                                                                format="webp"
                                                                dpr="auto" 
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-sm font-bold text-black group-hover:text-white truncate transition-colors">
                                                            {highlightMatch(result.title, debouncedSearchTerm)}
                                                        </h3>
                                                        {result.metaDescription && (
                                                            <p className="text-xs text-gray-500 group-hover:text-gray-300 mt-1 line-clamp-2 transition-colors">
                                                                {result.metaDescription}
                                                            </p>
                                                        )}
                                                        <div className="flex flex-wrap items-center text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-gray-400 mt-2 gap-x-3 gap-y-1">
                                                            {result.author?.name && (
                                                                <div className="flex items-center whitespace-nowrap">
                                                                    <FaUser className="mr-1 flex-shrink-0" size={10} />
                                                                    <span>{result.author.name}</span>
                                                                </div>
                                                            )}
                                                            {result.publishDate && (
                                                                <div className="flex items-center whitespace-nowrap">
                                                                    <FaCalendarAlt className="mr-1 flex-shrink-0" size={10} />
                                                                    {new Date(result.publishDate).toLocaleDateString('vi-VN')}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    )}
                                </div>

                                {blogSearchData.totalPages > 1 && (
                                    <div className="flex justify-between items-center px-3 py-3 border-t-[1.5px] border-black mt-0 bg-white">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault(); 
                                                setCurrentPage(p => Math.max(1, p - 1));
                                            }}
                                            disabled={currentPage === 1 || isFetching}
                                            className="text-[10px] font-bold uppercase tracking-widest px-3 py-2 text-black bg-white rounded-none border-[1.5px] border-black hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black focus:outline-none transition-colors"
                                            onMouseDown={(e) => e.preventDefault()}
                                        >
                                            Trang trước
                                        </button>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-black">
                                            {currentPage} / {blogSearchData.totalPages}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault(); 
                                                setCurrentPage(p => Math.min(blogSearchData.totalPages, p + 1));
                                            }}
                                            disabled={currentPage === blogSearchData.totalPages || isFetching}
                                            className="text-[10px] font-bold uppercase tracking-widest px-3 py-2 text-black bg-white rounded-none border-[1.5px] border-black hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black focus:outline-none transition-colors"
                                            onMouseDown={(e) => e.preventDefault()}
                                        >
                                            Trang sau
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : null  }
                    </div>
                )}
            </form>
        </div>
    );
};

export default Search;