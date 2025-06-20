import React, { Fragment } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange
}: PaginationProps) => {
  const getPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;
    if (showEllipsis) {
      if (currentPage <= 3) {
        // Show first 3, ellipsis, and last page
        for (let i = 1; i <= 3; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show first page, ellipsis, and last 3
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 2; i <= totalPages; i++) pages.push(i);
      } else {
        // Show first, ellipsis, current-1, current, current+1, ellipsis, last
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    } else {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    }
    return pages;
  };
  return <nav className="flex items-center justify-center space-x-2" role="navigation" aria-label="Pagination">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" aria-label="Previous page">
        <ChevronLeftIcon className="w-5 h-5" />
      </button>
      <div className="flex items-center space-x-1">
        {getPageNumbers().map((page, index) => <Fragment key={index}>
            {page === '...' ? <span className="px-3 py-2 text-gray-500">...</span> : <button onClick={() => onPageChange(page as number)} className={`px-3 py-2 rounded-lg transition-colors ${currentPage === page ? 'bg-primary-600 text-white' : 'hover:bg-gray-100 text-gray-700'}`} aria-current={currentPage === page ? 'page' : undefined} aria-label={`Page ${page}`}>
                {page}
              </button>}
          </Fragment>)}
      </div>
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" aria-label="Next page">
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </nav>;
};