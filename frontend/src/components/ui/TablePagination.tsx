"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface TablePaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function TablePagination({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: TablePaginationProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const totalPages = Math.ceil(totalItems / pageSize);
  const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      if (i >= 1 && i <= totalPages) {
        pages.push(i);
      }
    }
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="flex flex-col gap-4 border-t border-brand-border px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-6">
        <p className="text-sm font-bold text-brand-text-muted">
          {totalItems === 0
            ? 'No transactions'
            : `Showing ${from}-${to} of ${totalItems} transactions`}
        </p>

        {/* Custom Rows Per Page Dropdown */}
        <div ref={dropdownRef} className="relative flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">Rows</span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex h-9 items-center gap-1.5 rounded-md border border-brand-border bg-white px-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-brand-bg-light"
            >
              {pageSize}
              <ChevronDown
                className={`h-3.5 w-3.5 text-brand-text-muted transition-transform ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute bottom-11 left-0 z-30 w-[80px] overflow-hidden rounded-md border border-brand-border bg-white py-1 shadow-lg">
                {[10, 25, 50, 100].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      onPageSizeChange(option);
                      setIsDropdownOpen(false);
                    }}
                    className={`flex h-9 w-full items-center justify-center text-sm font-bold ${
                      pageSize === option
                        ? 'bg-brand-light text-primary'
                        : 'text-slate-700 hover:bg-brand-bg-light'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-brand-border text-brand-text-muted disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              className={`flex h-10 w-10 items-center justify-center rounded-md text-sm font-black ${
                currentPage === pageNumber
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-700'
              }`}
            >
              {pageNumber}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-brand-border text-brand-text-muted disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
