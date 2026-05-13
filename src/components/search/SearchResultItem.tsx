"use client";

import React from "react";
import Link from "next/link";
import { OptimizedImage } from "@/components/OptimizedImage";
import { FaUser, FaCalendarAlt } from "@/components/icons";


function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function highlightMatch(text: string, highlight: string): React.ReactNode {
  if (!highlight.trim() || !text) return text;
  const regex = new RegExp(`(${escapeRegExp(highlight)})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts
        .filter((part) => part)
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
}


export interface SearchResult {
  id: string;
  title: string;
  slug: string;
  metaDescription: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  publishDate: Date | null;
  author?: { id: string; name: string | null; image: string | null } | null;
  tags: { id: string; name: string }[];
}

// ─── SearchResultItem ─────────────────────────────────────────────────────────

interface SearchResultItemProps {
  result: SearchResult;
  searchTerm: string;
}

export function SearchResultItem({ result, searchTerm }: SearchResultItemProps) {
  return (
    <Link
      href={`/blog/${result.slug}`}
      className="block p-3 hover:bg-black group rounded-none transition-colors border-b-[1.5px] border-black last:border-b-0 focus:outline-none focus:bg-black"
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="flex items-start space-x-3">
        {result.imageUrl && (
          <div className="flex-shrink-0 w-16 h-16 relative border-[1.5px] border-black">
            <OptimizedImage
              src={result.imageUrl}
              alt={result.imageAlt || result.title}
              width={64}
              height={64}
              className="w-full h-full object-cover"
              sizes="64px"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-black group-hover:text-white truncate transition-colors">
            {highlightMatch(result.title, searchTerm)}
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
                {new Date(result.publishDate).toLocaleDateString("vi-VN")}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
