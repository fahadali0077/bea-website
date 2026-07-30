"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, Filter, Loader2, Search } from "lucide-react";
import { PageHeading } from "@/app/components/admin/PageHeading";
import { DataTable, type Column } from "@/app/components/admin/DataTable";
import { Badge } from "@/app/components/admin/Badge";
import {
  auditExportUrl,
  listAuditEvents,
  type AdminAuditEvent,
  type AuditFilters,
} from "@/lib/admin/audit-api";

const GRID = "grid-cols-[minmax(160px,1fr)_minmax(190px,1.2fr)_minmax(180px,1fr)_minmax(190px,1fr)_minmax(220px,1.4fr)]";
const inputClass =
  "w-full font-lato text-[13px] text-neutral-800 bg-white border border-neutral-200/80 rounded-[8px] px-3 py-2.5 focus:outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400";

const ENTITY_OPTIONS = ["", "USER", "POINTS_LEDGER", "POINT_RULE", "PROMPT", "COMPETITION", "REWARD", "REWARD_REDEMPTION", "ADMIN_MESSAGE"];
const ACTION_OPTIONS = [
  "",
  "UPDATE_USER",
  "UPDATE_USER_ROLE",
  "ADJUST_POINTS",
  "UPDATE_POINT_RULE",
  "CREATE_PROMPT",
  "UPDATE_PROMPT",
  "CALCULATE_PROMPT_WINNERS",
  "CREATE_COMPETITION",
  "UPDATE_COMPETITION",
  "ARCHIVE_COMPETITION",
  "EXTEND_COMPETITION",
  "CREATE_REWARD",
  "UPDATE_REWARD",
  "UPDATE_REDEMPTION_STATUS",
  "SEND_MESSAGE",
];

const dateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function titleCase(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(value: string) {
  return value ? dateFmt.format(new Date(value)) : "-";
}

function summarize(value: unknown) {
  if (!value) return "-";
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return text.length > 120 ? `${text.slice(0, 120)}...` : text;
}

export default function AdminAuditPage() {
  const [filters, setFilters] = useState<AuditFilters>({ page: 1, limit: 20 });
  const [events, setEvents] = useState<AdminAuditEvent[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listAuditEvents(filters);
      setEvents(result.items);
      setTotal(result.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load audit events");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const setFilter = (patch: Partial<AuditFilters>) => {
    setFilters((current) => ({ ...current, page: 1, ...patch }));
  };

  const columns = useMemo<Column<AdminAuditEvent>[]>(() => [
    {
      key: "createdAt",
      header: "Date",
      cell: (row) => <span className="font-lato text-[13px] font-semibold text-neutral-700">{formatDate(row.createdAt)}</span>,
    },
    {
      key: "admin",
      header: "Admin",
      cell: (row) => <span className="font-lato text-[13px] text-neutral-700">{row.adminName}</span>,
    },
    {
      key: "action",
      header: "Action",
      cell: (row) => <Badge tone="bg-[#eceef2] text-[#5b6b7d]">{titleCase(row.action)}</Badge>,
    },
    {
      key: "entity",
      header: "Entity",
      cell: (row) => (
        <div className="min-w-0">
          <p className="font-lato text-[13px] font-bold text-neutral-800">{titleCase(row.entityType)}</p>
          <p className="font-lato text-[12px] text-neutral-500 truncate">{row.entityLabel || row.entityId || "-"}</p>
        </div>
      ),
    },
    {
      key: "change",
      header: "Change",
      cell: (row) => (
        <div className="min-w-0">
          <p className="font-lato text-[12px] text-neutral-500 truncate">Before: {summarize(row.beforeValues)}</p>
          <p className="font-lato text-[12px] text-neutral-700 truncate">After: {summarize(row.afterValues)}</p>
        </div>
      ),
    },
  ], []);

  return (
    <main className="flex-1 min-w-0 flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <PageHeading title="Audit Trail" subtitle="Search admin changes across users, points, prompts, competitions, rewards, and messages." />
        <a
          href={auditExportUrl(filters)}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-4 py-2.5 font-lato text-[13px] font-bold text-white hover:bg-neutral-800 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </a>
      </div>

      <section className="bg-[#fbfbf9] border border-neutral-200/40 rounded-[12px] p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3">
          <label className="relative xl:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              value={filters.search ?? ""}
              onChange={(event) => setFilter({ search: event.target.value })}
              placeholder="Search admin, action, entity"
              className={`${inputClass} pl-9`}
            />
          </label>
          <select value={filters.entityType ?? ""} onChange={(event) => setFilter({ entityType: event.target.value || undefined })} className={inputClass}>
            {ENTITY_OPTIONS.map((option) => <option key={option || "all"} value={option}>{option ? titleCase(option) : "All entities"}</option>)}
          </select>
          <select value={filters.action ?? ""} onChange={(event) => setFilter({ action: event.target.value || undefined })} className={inputClass}>
            {ACTION_OPTIONS.map((option) => <option key={option || "all"} value={option}>{option ? titleCase(option) : "All actions"}</option>)}
          </select>
          <input type="date" value={filters.from ?? ""} onChange={(event) => setFilter({ from: event.target.value || undefined })} className={inputClass} />
          <input type="date" value={filters.to ?? ""} onChange={(event) => setFilter({ to: event.target.value || undefined })} className={inputClass} />
        </div>
        {error && <p className="mt-3 font-lato text-[13px] font-semibold text-[#b0453a]">{error}</p>}
      </section>

      <DataTable
        rows={events}
        columns={columns}
        gridCols={GRID}
        minWidth="980px"
        getRowKey={(row) => row.id}
        renderCard={(row) => (
          <div className="rounded-[10px] border border-neutral-200/60 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-lato text-[13px] font-bold text-neutral-900">{titleCase(row.action)}</p>
                <p className="font-lato text-[12px] text-neutral-500">{formatDate(row.createdAt)}</p>
              </div>
              <Filter className="w-4 h-4 text-neutral-400" />
            </div>
            <p className="mt-3 font-lato text-[13px] text-neutral-700">{row.adminName}</p>
            <p className="font-lato text-[12px] text-neutral-500">{titleCase(row.entityType)}: {row.entityLabel || row.entityId || "-"}</p>
            <p className="mt-2 font-lato text-[12px] text-neutral-500">Before: {summarize(row.beforeValues)}</p>
            <p className="font-lato text-[12px] text-neutral-700">After: {summarize(row.afterValues)}</p>
          </div>
        )}
        countLabel={(count) => `${count.toLocaleString()} audit events`}
        emptyTitle="No audit events found"
        emptyText="Try changing the filters or perform an admin change first."
        loading={loading}
        pagination={{
          page: filters.page,
          pageSize: filters.limit,
          total,
          onPageChange: (page) => setFilters((current) => ({ ...current, page })),
          onPageSizeChange: (limit) => setFilters((current) => ({ ...current, page: 1, limit })),
        }}
      />

      {loading && events.length > 0 && (
        <div className="fixed bottom-5 right-5 rounded-full bg-white border border-neutral-200 px-3 py-2 shadow-sm flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-neutral-500" />
          <span className="font-lato text-[12px] font-semibold text-neutral-600">Refreshing</span>
        </div>
      )}
    </main>
  );
}
