"use client";

import { api } from "@/trpc/react";
import React, { useState, useEffect } from "react";
import { FaSearch } from "@/components/icons";
import { SearchResultItem } from "@/components/search/SearchResultItem";
import { SearchPagination } from "@/components/search/SearchPagination";

const LIMIT = 4;
const DEBOUNCE_DELAY = 300;

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      if (searchTerm !== debouncedSearchTerm) setCurrentPage(1);
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const { data: blogSearchData, isLoading, error, isFetching } = api.blog.fullTextSearch.useQuery(
    { searchTerm: debouncedSearchTerm, slug: "", page: currentPage, limit: LIMIT },
    { enabled: debouncedSearchTerm.trim().length > 0 && isFocused }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedSearchTerm(searchTerm);
    if (searchTerm !== debouncedSearchTerm) setCurrentPage(1);
    document.getElementById("main-search")?.focus();
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setTimeout(() => setIsFocused(false), 200);

  const showResultsArea =
    isFocused &&
    debouncedSearchTerm.trim().length > 0 &&
    (isLoading || isFetching || blogSearchData || error);

  const showLoadingSpinner =
    (isLoading || (isFetching && !blogSearchData)) &&
    debouncedSearchTerm.trim().length > 0 &&
    isFocused;

  return (
    <div className="relative py-4 w-full">
      <form onSubmit={handleSearch} className="relative w-full" noValidate>
        <label htmlFor="main-search" className="sr-only">
          Search content
        </label>
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
          className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black pointer-events-none"
          aria-hidden="true"
        />

        {showResultsArea && (
          <div className="absolute z-[100] mt-1 left-0 w-[85vw] sm:w-[450px] bg-white rounded-none shadow-none border-[1.5px] border-black max-h-[500px] overflow-y-auto hide-scrollbar">
            {showLoadingSpinner ? (
              <div className="flex justify-center py-6">
                <div className="h-5 w-5 border-2 border-black border-t-transparent animate-spin" />
              </div>
            ) : error ? (
              <div className="text-red-500 text-center p-4 text-xs font-bold">
                Lỗi: {error.message}
              </div>
            ) : blogSearchData ? (
              <div className="p-2">
                {/* Summary row */}
                <div className="flex justify-between items-center text-xs text-gray-500 px-3 py-2">
                  <span>
                    {blogSearchData.totalCount > 0
                      ? `Found ${blogSearchData.totalCount} results for "`
                      : `No results found for "`}
                    <span className="font-medium">{debouncedSearchTerm}</span>"
                  </span>
                  {isFetching && (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 ml-2" />
                  )}
                </div>

                {/* Results */}
                <div className="space-y-1">
                  {blogSearchData.results.length === 0 && !isFetching ? (
                    <div className="text-gray-500 text-center p-4">Try refining your search.</div>
                  ) : (
                    blogSearchData.results.map((result) => (
                      <SearchResultItem
                        key={result.id}
                        result={result}
                        searchTerm={debouncedSearchTerm}
                      />
                    ))
                  )}
                </div>

                <SearchPagination
                  currentPage={currentPage}
                  totalPages={blogSearchData.totalPages}
                  isFetching={isFetching}
                  onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  onNext={() => setCurrentPage((p) => Math.min(blogSearchData.totalPages, p + 1))}
                />
              </div>
            ) : null}
          </div>
        )}
      </form>
    </div>
  );
};

export default Search;