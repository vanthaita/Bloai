import { api } from '@/trpc/react';
import React, { useState, useEffect } from 'react';
import { FaSearch, FaCalendarAlt, FaUser } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

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
        <div className="relative px-4 py-6 w-full">
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
                    placeholder="Search blog..."
                    className="w-full bg-gray-50 text-gray-800 rounded-lg
                            py-2.5 px-4 pl-11
                            text-base
                            border border-gray-200
                            focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                            hover:border-gray-300
                            outline-none shadow-sm transition-all"
                    aria-label="Search articles"
                    autoComplete="off"
                />
                <FaSearch
                    className="absolute left-3.5 top-1/2 -translate-y-1/2
                            w-4 h-4 text-gray-500 pointer-events-none"
                    aria-hidden="true"
                />

                {showResultsArea && (
                    <div className="absolute z-10 mt-2 left-0 right-0 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[550px] overflow-y-auto scroll-custom">
                        {showLoadingSpinner ? (
                            <div className="flex justify-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : error ? (
                            <div className="text-red-500 text-center p-4">
                                Error: {error.message}
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
                                                className="block p-3 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:bg-gray-100"
                                                onMouseDown={(e) => e.preventDefault()}
                                            >
                                                <div className="flex items-start space-x-3">
                                                    {result.imageUrl && (
                                                        <div className="flex-shrink-0 w-16 h-16 relative">
                                                            <Image
                                                                src={result.imageUrl}
                                                                alt={result.imageAlt || result.title}
                                                                fill
                                                                className="object-cover rounded"
                                                                sizes="64px" 
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-sm font-medium text-gray-900 truncate">
                                                            {highlightMatch(result.title, debouncedSearchTerm)}
                                                        </h3>
                                                        {result.metaDescription && (
                                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                                {result.metaDescription}
                                                            </p>
                                                        )}
                                                        <div className="flex flex-wrap items-center text-xs text-gray-400 mt-2 gap-x-3 gap-y-1">
                                                            {result.author?.name && (
                                                                <div className="flex items-center whitespace-nowrap">
                                                                    <FaUser className="mr-1 flex-shrink-0" size={10} />
                                                                    <span>{result.author.name}</span>
                                                                </div>
                                                            )}
                                                            {result.publishDate && (
                                                                <div className="flex items-center whitespace-nowrap">
                                                                    <FaCalendarAlt className="mr-1 flex-shrink-0" size={10} />
                                                                    {new Date(result.publishDate).toLocaleDateString('en-US', {
                                                                        year: 'numeric',
                                                                        month: 'short',
                                                                        day: 'numeric'
                                                                    })}
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
                                    <div className="flex justify-between items-center px-3 py-2 border-t border-gray-100 mt-2">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault(); 
                                                setCurrentPage(p => Math.max(1, p - 1));
                                            }}
                                            disabled={currentPage === 1 || isFetching}
                                            className="text-xs px-3 py-1 text-gray-700 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-blue-300"
                                            onMouseDown={(e) => e.preventDefault()}
                                        >
                                            Previous
                                        </button>
                                        <span className="text-xs text-gray-500">
                                            Page {currentPage} of {blogSearchData.totalPages}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault(); 
                                                setCurrentPage(p => Math.min(blogSearchData.totalPages, p + 1));
                                            }}
                                            disabled={currentPage === blogSearchData.totalPages || isFetching}
                                            className="text-xs px-3 py-1 text-gray-700 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-blue-300"
                                            onMouseDown={(e) => e.preventDefault()}
                                        >
                                            Next
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