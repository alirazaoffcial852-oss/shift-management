"use client";

import React from "react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination = ({ currentPage, totalPages, onPageChange, className = "" }: PaginationProps) => {
  // Only hide if there are 0 pages
  if (totalPages < 1) return null;

  const getPageNumbers = () => {
    const pages = [];

    // Always show first page
    pages.push(1);

    // Calculate range around current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    // Add ellipsis after first page if needed
    if (start > 2) {
      pages.push("...");
    }

    // Add pages in range
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (end < totalPages - 1) {
      pages.push("...");
    }

    // Always show last page if more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className={`flex flex-col items-center my-5 ${className}`}>
      {/* Elegant page indicator */}
      <div className="mb-5 text-sm font-light tracking-wider text-gray-500 bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-1.5 rounded-full shadow-sm border border-gray-100">
        <span className="font-medium text-[#3f8359]">Page {currentPage}</span>
        <span className="mx-1.5 text-gray-300">|</span>
        <span>of {totalPages}</span>
      </div>

      {/* Premium pagination control */}
      <div className="flex items-center justify-center">
        {/* Previous button with premium styling - arrow only */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative flex items-center justify-center h-12 w-12 mr-4 overflow-hidden rounded-full bg-gradient-to-r from-[#3f8359] to-[#2d6142] text-white disabled:from-gray-100 disabled:to-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed shadow-md transition-all duration-500 hover:shadow-lg disabled:shadow-none group"
          aria-label="Previous page"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-[#2d6142] to-[#3f8359] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 transition-transform duration-300 group-hover:-translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Pages container with premium effect */}
        <div className="relative flex items-center justify-center bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)] p-2.5 border border-gray-50">
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <div className="flex items-center justify-center w-11 h-11 mx-1">
                  <div className="flex space-x-1.5">
                    {[0, 1, 2].map((dot) => (
                      <div
                        key={dot}
                        className="w-1 h-1 rounded-full bg-gray-300"
                        style={{
                          animation: "pulseOpacity 1.5s infinite",
                          animationDelay: `${dot * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => onPageChange(Number(page))}
                  className={`
                    relative flex items-center justify-center w-11 h-11 mx-1 rounded-full text-base font-light transition-all duration-500
                    ${currentPage === page ? "text-white shadow-md z-10" : "text-gray-600 hover:text-[#3f8359]"}
                  `}
                >
                  {currentPage === page ? (
                    <>
                      <span className="absolute inset-0 bg-gradient-to-r from-[#3f8359] to-[#2d6142] rounded-full"></span>
                      <span className="absolute inset-0 bg-gradient-to-r from-[#3f8359] to-[#2d6142] rounded-full opacity-50 blur-sm"></span>
                    </>
                  ) : (
                    <span className="absolute inset-0 bg-gray-50 rounded-full scale-0 transition-transform duration-300 ease-out hover:scale-100"></span>
                  )}
                  <span className="relative">{page}</span>
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next button with premium styling - arrow only */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative flex items-center justify-center h-12 w-12 ml-4 overflow-hidden rounded-full bg-gradient-to-r from-[#3f8359] to-[#2d6142] text-white disabled:from-gray-100 disabled:to-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed shadow-md transition-all duration-500 hover:shadow-lg disabled:shadow-none group"
          aria-label="Next page"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-[#2d6142] to-[#3f8359] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes pulseOpacity {
            0%,
            100% {
              opacity: 0.3;
            }
            50% {
              opacity: 1;
            }
          }
        `,
        }}
      />
    </div>
  );
};

export default Pagination;
