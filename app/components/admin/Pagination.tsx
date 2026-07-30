import { ChevronLeft, ChevronRight } from "lucide-react";

function buildPages(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: number[] = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
      pages.push(i);
    }
  }

  const result: (number | "ellipsis")[] = [];
  let previous: number | undefined;
  for (const page of pages) {
    if (previous) {
      if (page - previous === 2) result.push(previous + 1);
      else if (page - previous > 2) result.push("ellipsis");
    }
    result.push(page);
    previous = page;
  }
  return result;
}

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  onPageSizeChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
}) {
  if (total === 0) return null;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const pages = buildPages(page, totalPages);

  const navTone = "inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors";

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 mt-2 border-t border-neutral-200/40">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {onPageSizeChange && (
          <label className="flex items-center gap-2">
            <span className="font-lato text-[12px] font-medium text-neutral-500">Rows per page</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="font-lato text-[12px] font-semibold text-neutral-700 bg-white border border-neutral-200/70 rounded-[8px] pl-2.5 pr-7 py-1.5 cursor-pointer focus:outline-none focus:border-neutral-400 transition-colors"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        )}
        <p className="font-lato text-[12px] font-medium text-neutral-500">
          Showing {start}–{end} of {total}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
          className={`${navTone} ${page === 1 ? "text-neutral-300 cursor-not-allowed" : "text-neutral-600 hover:bg-neutral-100 cursor-pointer"}`}
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={2} />
        </button>

        {pages.map((item, index) =>
          item === "ellipsis" ? (
            <span key={`e${index}`} className="px-1.5 font-lato text-[13px] font-medium text-neutral-400">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-current={item === page ? "page" : undefined}
              className={`inline-flex items-center justify-center min-w-8 h-8 px-2.5 rounded-full font-lato text-[13px] font-bold transition-colors cursor-pointer ${
                item === page ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
          className={`${navTone} ${page === totalPages ? "text-neutral-300 cursor-not-allowed" : "text-neutral-600 hover:bg-neutral-100 cursor-pointer"}`}
        >
          <ChevronRight className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
