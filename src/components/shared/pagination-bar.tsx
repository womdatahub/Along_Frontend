"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  page: number;
  onPrev: () => void;
  onNext: () => void;
  /** Pass for server-side pagination — drives hasPrev/hasNext and total display */
  meta?: { total?: number; hasNextPage: boolean; hasPrevPage: boolean } | null;
  /** Pass for client-side pagination — total record count */
  total?: number;
  /** Required with `total` for client-side has-next check and auto-hide */
  pageSize?: number;
  /** Render a per-page selector when provided */
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  isLoading?: boolean;
  /** Padding applied to the left/right of the bar (default: "px-5") */
  px?: string;
};

export function PaginationBar({
  page,
  onPrev,
  onNext,
  meta,
  total,
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
  isLoading = false,
  px = "px-5",
}: Props) {
  const hasPrev = meta ? meta.hasPrevPage : page > 1;
  const hasNext = meta
    ? meta.hasNextPage
    : total !== undefined && pageSize !== undefined
      ? page * pageSize < total
      : false;

  const totalCount = meta?.total ?? total;

  // Client-side: hide completely when all records fit on one page
  if (
    !meta &&
    total !== undefined &&
    pageSize !== undefined &&
    total <= pageSize
  ) {
    return null;
  }

  return (
    <div
      className={`flex items-center justify-between ${px} py-3 border-t border-gray-50 flex-wrap gap-3`}
    >
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span>
          Page {page}
          {totalCount != null ? ` · ${totalCount} total` : ""}
        </span>
        {pageSizeOptions && onPageSizeChange && pageSize != null && (
          <label className="flex items-center gap-1.5">
            <span className="text-gray-400">Per page</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {pageSizeOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onPrev}
          disabled={!hasPrev || isLoading}
          className="flex items-center gap-1 text-xs font-medium text-gray-600 disabled:text-gray-300 hover:text-gray-900 disabled:cursor-not-allowed px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={14} />
          Prev
        </button>
        <button
          onClick={onNext}
          disabled={!hasNext || isLoading}
          className="flex items-center gap-1 text-xs font-medium text-gray-600 disabled:text-gray-300 hover:text-gray-900 disabled:cursor-not-allowed px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Next
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
