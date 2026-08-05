"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { Pagination } from "@/app/components/admin/Pagination";

export type Column<T> = {
  key: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  cellClassName?: string;
  headerClassName?: string;
};

export type ServerPagination = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export function DataTable<T>({
  rows,
  columns,
  gridCols,
  minWidth = "720px",
  getRowKey,
  onRowClick,
  renderCard,
  countLabel,
  emptyTitle = "Nothing here yet",
  emptyText,
  resetKey,
  initialPageSize = 10,
  pagination,
  loading = false,
}: {
  rows: T[];
  columns: Column<T>[];
  gridCols: string;
  minWidth?: string;
  getRowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  renderCard: (row: T) => React.ReactNode;
  countLabel: (count: number) => string;
  emptyTitle?: string;
  emptyText: string;
  resetKey?: string;
  initialPageSize?: number;
  pagination?: ServerPagination;
  loading?: boolean;
}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  useEffect(() => {
    setPage(1);
  }, [resetKey, pageSize]);

  const isServer = Boolean(pagination);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const pageItems = useMemo(
    () => (isServer ? rows : rows.slice((currentPage - 1) * pageSize, currentPage * pageSize)),
    [isServer, rows, currentPage, pageSize],
  );

  const totalCount = pagination?.total ?? rows.length;
  const rowGrid = `grid ${gridCols} gap-4 items-center`;
  const showEmpty = !loading && rows.length === 0;

  return (
    <section className="bg-[#fbfbf9] border border-neutral-200/40 rounded-[12px] p-4 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
      <div className="flex items-center gap-2 mb-3">
        <p className="font-lato text-[13px] font-semibold text-neutral-500">{countLabel(totalCount)}</p>
        {loading && <Loader2 className="w-3.5 h-3.5 text-neutral-400 animate-spin" />}
      </div>

      {showEmpty ? (
        <div className="py-16 flex flex-col items-center justify-center text-center gap-2">
          <p className="font-lato text-[15px] font-bold text-neutral-700">{emptyTitle}</p>
          <p className="font-lato text-[13px] font-medium text-neutral-500">{emptyText}</p>
        </div>
      ) : loading && rows.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center gap-3">
          <Loader2 className="w-6 h-6 text-neutral-400 animate-spin" />
          <p className="font-lato text-[13px] font-medium text-neutral-500">Loading…</p>
        </div>
      ) : (
        <>
          <div className={loading ? "opacity-60 transition-opacity" : "transition-opacity"}>
            <div className="hidden md:block overflow-x-auto no-scrollbar w-full">
              <div className="flex flex-col" style={{ minWidth }}>
                <div className={`${rowGrid} pb-3 border-b border-neutral-200/60 font-sfpro text-[11px] font-bold text-[#402b23] uppercase tracking-widest`}>
                  {columns.map((col) => (
                    <span key={col.key} className={col.headerClassName}>
                      {col.header}
                    </span>
                  ))}
                </div>

                {pageItems.map((row) => {
                  const cells = columns.map((col) => (
                    <div key={col.key} className={col.cellClassName}>
                      {col.cell(row)}
                    </div>
                  ));

                  return onRowClick ? (
                    <button
                      key={getRowKey(row)}
                      type="button"
                      onClick={() => onRowClick(row)}
                      className={`${rowGrid} w-full text-left py-3.5 border-b border-neutral-200/30 last:border-0 hover:bg-neutral-50/60 transition-colors duration-150 cursor-pointer`}
                    >
                      {cells}
                    </button>
                  ) : (
                    <div key={getRowKey(row)} className={`${rowGrid} py-3.5 border-b border-neutral-200/30 last:border-0`}>
                      {cells}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="md:hidden flex flex-col gap-3">
              {pageItems.map((row) => (
                <div key={getRowKey(row)}>{renderCard(row)}</div>
              ))}
            </div>
          </div>

          {pagination ? (
            <Pagination
              page={pagination.page}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onPageChange={pagination.onPageChange}
              onPageSizeChange={pagination.onPageSizeChange}
            />
          ) : (
            <Pagination
              page={currentPage}
              pageSize={pageSize}
              total={rows.length}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          )}
        </>
      )}
    </section>
  );
}
