"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Search, Eye, SquarePen, Power, Trash2, GraduationCap, Users, CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";
import {
  listSchools,
  getSchool,
  createSchool,
  updateSchool,
  deleteSchool,
  type ApiSchool,
  type SchoolInput,
  type SchoolStatus,
} from "@/lib/admin/schools-api";
import { listMarkets } from "@/lib/admin/markets-api";
import { EntityStatusBadge } from "@/app/components/admin/Badge";
import { PageHeading } from "@/app/components/admin/PageHeading";
import { StatCard } from "@/app/components/admin/StatCard";
import { SlideOver } from "@/app/components/admin/SlideOver";
import { DetailRow, DetailSection } from "@/app/components/admin/DetailList";
import { DataTable, type Column } from "@/app/components/admin/DataTable";
import { IconButton } from "@/app/components/admin/IconButton";
import { ConfirmDialog } from "@/app/components/admin/ConfirmDialog";

const GRID_COLS = "grid-cols-[minmax(200px,1.8fr)_minmax(150px,1.2fr)_130px_120px_minmax(150px,auto)]";
const VALUE_CELL = "font-lato text-[13px] font-medium text-neutral-700 truncate";

const inputClass =
  "w-full font-lato text-[14px] text-neutral-800 bg-white border border-neutral-200/80 rounded-[8px] px-3.5 py-2.5 focus:outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400";
const labelClass = "font-lato text-[13px] font-bold text-neutral-700";

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

function formatDate(iso?: string) {
  return iso ? dateFmt.format(new Date(iso)) : "—";
}

function SchoolStatusBadge({ status }: { status: SchoolStatus }) {
  return <EntityStatusBadge status={status === "ACTIVE" ? "active" : "inactive"} />;
}

function SchoolThumb({ url, alt, size = 36 }: { url: string | null; alt: string; size?: number }) {
  return (
    <div
      className="rounded-[8px] overflow-hidden bg-neutral-100 border border-neutral-200/70 shrink-0 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <GraduationCap className="w-4 h-4 text-neutral-300" strokeWidth={2} />
      )}
    </div>
  );
}

function useMarketOptions() {
  const [options, setOptions] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    let active = true;
    listMarkets({ page: 1, limit: 100 })
      .then((result) => {
        if (active) setOptions(result.items.map((m) => ({ id: m.id, name: m.name })));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return options;
}

function SchoolForm({
  school,
  marketOptions,
  saving,
  onClose,
  onSubmit,
}: {
  school: ApiSchool | null;
  marketOptions: Array<{ id: string; name: string }>;
  saving: boolean;
  onClose: () => void;
  onSubmit: (values: SchoolInput) => Promise<void>;
}) {
  const [values, setValues] = useState<SchoolInput>({
    name: school?.name ?? "",
    city: school?.city ?? "",
    state: school?.state ?? "",
    marketId: school?.marketId ?? marketOptions[0]?.id ?? "",
    status: school?.status ?? "ACTIVE",
    imageUrl: school?.imageUrl ?? "",
  });
  const [error, setError] = useState<string | null>(null);

  const update = (patch: Partial<SchoolInput>) => {
    setValues((current) => ({ ...current, ...patch }));
    setError(null);
  };

  const submit = async () => {
    if (!values.name.trim()) return setError("School name is required");
    if (!values.marketId) return setError("Please assign a market");
    try {
      await onSubmit({
        ...values,
        name: values.name.trim(),
        city: values.city.trim(),
        state: values.state.trim(),
        imageUrl: (values.imageUrl ?? "").trim(),
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <SlideOver
      onClose={onClose}
      header={
        <div>
          <p className="font-canela text-[20px] font-medium text-neutral-900 leading-tight">
            {school ? "Edit School" : "Add School"}
          </p>
          <p className="font-lato text-[13px] font-medium text-neutral-500 mt-0.5">
            {school ? "Update school details and market assignment." : "Create a new school and assign it to a market."}
          </p>
        </div>
      }
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="sch-name" className={labelClass}>School name</label>
        <input id="sch-name" value={values.name} onChange={(e) => update({ name: e.target.value })} placeholder="University name" className={inputClass} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="sch-city" className={labelClass}>City</label>
          <input id="sch-city" value={values.city} onChange={(e) => update({ city: e.target.value })} placeholder="City" className={inputClass} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="sch-state" className={labelClass}>State</label>
          <input id="sch-state" value={values.state} onChange={(e) => update({ state: e.target.value })} placeholder="State" className={inputClass} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="sch-market" className={labelClass}>Market</label>
        <select id="sch-market" value={values.marketId} onChange={(e) => update({ marketId: e.target.value })} className={`${inputClass} cursor-pointer`}>
          {marketOptions.length === 0 && <option value="">Loading markets…</option>}
          {marketOptions.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="sch-image" className={labelClass}>Image URL</label>
        <input id="sch-image" value={values.imageUrl ?? ""} onChange={(e) => update({ imageUrl: e.target.value })} placeholder="https://…" className={inputClass} />
      </div>

      {error && <p className="font-lato text-[12px] font-semibold text-[#b0453a]">{error}</p>}

      <button
        type="button"
        onClick={submit}
        disabled={saving}
        className="inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-lato text-[14px] font-semibold px-5 py-2.5 rounded-full transition-colors disabled:opacity-60"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" strokeWidth={2} />}
        {school ? "Save changes" : "Add school"}
      </button>
    </SlideOver>
  );
}

function SchoolDetail({ school, onClose }: { school: ApiSchool; onClose: () => void }) {
  const [detail, setDetail] = useState<ApiSchool>(school);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getSchool(school.id)
      .then((data) => active && setDetail(data))
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [school.id]);

  return (
    <SlideOver
      onClose={onClose}
      header={
        <div>
          <div className="flex items-center gap-2">
            <p className="font-canela text-[20px] font-medium text-neutral-900 leading-tight">{detail.name}</p>
            <SchoolStatusBadge status={detail.status} />
          </div>
          <p className="font-lato text-[13px] font-medium text-neutral-500 mt-0.5">
            {detail.city}, {detail.state}
          </p>
        </div>
      }
    >
      {detail.imageUrl && (
        <div className="rounded-[10px] overflow-hidden border border-neutral-200/60 bg-neutral-100 h-40 w-full mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={detail.imageUrl} alt={detail.name} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#fbf7f4] border border-neutral-200/50 rounded-[10px] p-3.5">
          <p className="font-lato text-[12px] font-medium text-neutral-500 leading-none">Participants</p>
          <p className="font-lato text-[20px] font-bold text-neutral-800 mt-2 leading-none">{detail.userCount.toLocaleString()}</p>
        </div>
        <div className="bg-[#fbf7f4] border border-neutral-200/50 rounded-[10px] p-3.5">
          <p className="font-lato text-[12px] font-medium text-neutral-500 leading-none">Market</p>
          <p className="font-lato text-[16px] font-bold text-neutral-800 mt-2 leading-none truncate">{detail.market?.name ?? "—"}</p>
        </div>
      </div>

      <DetailSection title="Details">
        <DetailRow label="Market" value={detail.market?.name ?? "—"} />
        <DetailRow label="Location" value={`${detail.city}, ${detail.state}`} />
        <DetailRow label="Status" value={<SchoolStatusBadge status={detail.status} />} />
        <DetailRow label="Created" value={formatDate(detail.createdAt)} />
      </DetailSection>

      {detail.market && (
        <DetailSection title="Market details">
          <DetailRow label="City / State" value={`${detail.market.city}, ${detail.market.state}`} />
          <DetailRow label="Country" value={detail.market.country || "—"} />
          <DetailRow label="Unlock target" value={detail.market.unlockTarget.toLocaleString()} />
          <DetailRow label="Market participants" value={detail.market.participantCount.toLocaleString()} />
        </DetailSection>
      )}

      {loading && (
        <p className="font-lato text-[12px] font-medium text-neutral-400 flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Refreshing…
        </p>
      )}
    </SlideOver>
  );
}

function SchoolActions({
  school,
  onView,
  onEdit,
  onToggle,
  onDelete,
}: {
  school: ApiSchool;
  onView: (s: ApiSchool) => void;
  onEdit: (s: ApiSchool) => void;
  onToggle: (s: ApiSchool) => void;
  onDelete: (s: ApiSchool) => void;
}) {
  const isActive = school.status === "ACTIVE";
  return (
    <div className="flex items-center gap-1 md:justify-self-end">
      <IconButton label="View" onClick={() => onView(school)}>
        <Eye className="w-4 h-4" strokeWidth={2} />
      </IconButton>
      <IconButton label="Edit" onClick={() => onEdit(school)}>
        <SquarePen className="w-4 h-4" strokeWidth={2} />
      </IconButton>
      <IconButton label={isActive ? "Deactivate" : "Activate"} onClick={() => onToggle(school)} active={!isActive}>
        <Power className="w-4 h-4" strokeWidth={2} />
      </IconButton>
      <IconButton label="Delete" onClick={() => onDelete(school)} danger>
        <Trash2 className="w-4 h-4" strokeWidth={2} />
      </IconButton>
    </div>
  );
}

export default function AdminSchoolsPage() {
  const marketOptions = useMarketOptions();

  const [items, setItems] = useState<ApiSchool[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [marketId, setMarketId] = useState("ALL");
  const [status, setStatus] = useState<"ALL" | SchoolStatus>("ALL");

  const [counts, setCounts] = useState({ total: 0, active: 0, participants: 0 });

  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<ApiSchool | null>(null);
  const [viewing, setViewing] = useState<ApiSchool | null>(null);
  const [statusTarget, setStatusTarget] = useState<ApiSchool | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiSchool | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchSchools = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listSchools({
        page,
        limit,
        search: debouncedSearch,
        marketId: marketId === "ALL" ? undefined : marketId,
        status: status === "ALL" ? undefined : status,
      });
      setItems(result.items);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load schools");
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, marketId, status]);

  const loadCounts = useCallback(async () => {
    try {
      const [all, active] = await Promise.all([
        listSchools({ page: 1, limit: 100 }),
        listSchools({ page: 1, limit: 1, status: "ACTIVE" }),
      ]);
      const participants = all.items.reduce((sum, s) => sum + s.userCount, 0);
      setCounts({ total: all.total, active: active.total, participants });
    } catch {
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSchools();
  }, [fetchSchools]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCounts();
  }, [loadCounts]);

  const refresh = useCallback(() => {
    fetchSchools();
    loadCounts();
  }, [fetchSchools, loadCounts]);

  const handleCreate = async (input: SchoolInput) => {
    setSaving(true);
    try {
      await createSchool(input);
      setActionError(null);
      refresh();
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (input: SchoolInput) => {
    if (!editing) return;
    setSaving(true);
    try {
      await updateSchool(editing.id, input);
      setActionError(null);
      refresh();
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (school: ApiSchool) => {
    try {
      await updateSchool(school.id, {
        name: school.name,
        city: school.city,
        state: school.state,
        marketId: school.marketId,
        status: school.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
      });
      setActionError(null);
      refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSchool(id);
      setActionError(null);
      refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to delete school");
    }
  };

  const columns: Column<ApiSchool>[] = [
    {
      key: "school",
      header: "School",
      cellClassName: "flex items-center gap-3 min-w-0",
      cell: (s) => (
        <>
          <SchoolThumb url={s.imageUrl} alt={s.name} />
          <div className="min-w-0">
            <p className="font-lato text-[14px] font-bold text-neutral-900 truncate leading-tight">{s.name}</p>
            <p className="font-lato text-[12px] font-medium text-neutral-500 truncate leading-tight mt-0.5">{s.city}, {s.state}</p>
          </div>
        </>
      ),
    },
    { key: "market", header: "Market", cell: (s) => s.market?.name ?? "—", cellClassName: VALUE_CELL },
    { key: "participants", header: "Participants", cell: (s) => s.userCount.toLocaleString(), cellClassName: "font-lato text-[13px] font-bold text-neutral-800" },
    { key: "status", header: "Status", cell: (s) => <SchoolStatusBadge status={s.status} /> },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "justify-self-end",
      cellClassName: "justify-self-end",
      cell: (s) => (
        <SchoolActions school={s} onView={setViewing} onEdit={setEditing} onToggle={setStatusTarget} onDelete={setDeleteTarget} />
      ),
    },
  ];

  const selectClass =
    "w-full sm:w-auto font-lato text-[13px] font-medium text-neutral-700 bg-[#fbfbf9] border border-neutral-200/70 rounded-[8px] px-3 py-2.5 cursor-pointer focus:outline-none focus:border-neutral-400 transition-colors";

  return (
    <main className="flex-1 flex flex-col gap-6 md:gap-8 min-w-0">
      <title>School Management - Bea Admin</title>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <PageHeading title="School Management" subtitle="Add schools, assign markets, and track campus participation." />
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex items-center justify-center gap-2 self-start bg-neutral-900 hover:bg-neutral-800 text-white font-lato text-[14px] font-semibold px-5 py-2.5 rounded-full transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" strokeWidth={2.4} />
          Add school
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Schools" value={counts.total.toLocaleString()} icon={<GraduationCap className="w-5 h-5" strokeWidth={2.2} />} />
        <StatCard label="Active" value={counts.active.toLocaleString()} icon={<CheckCircle2 className="w-5 h-5" strokeWidth={2.2} />} />
        <StatCard label="Inactive" value={Math.max(0, counts.total - counts.active).toLocaleString()} icon={<XCircle className="w-5 h-5" strokeWidth={2.2} />} />
        <StatCard label="Participants" value={counts.participants.toLocaleString()} icon={<Users className="w-5 h-5" strokeWidth={2.2} />} />
      </div>

      {(error || actionError) && (
        <div className="flex items-center gap-2 bg-[#faf0eb] border border-[#e8c9c1] rounded-[10px] px-4 py-3">
          <AlertCircle className="w-4 h-4 text-[#b0453a] shrink-0" strokeWidth={2} />
          <p className="font-lato text-[13px] font-semibold text-[#b0453a]">{error ?? actionError}</p>
        </div>
      )}

      <section className="bg-[#fbfbf9] border border-neutral-200/50 rounded-[12px] p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.015)] flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" strokeWidth={2} />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by school, city, or state…"
            className="w-full font-lato text-[14px] text-neutral-800 bg-white border border-neutral-200/70 rounded-[8px] pl-10 pr-3 py-2.5 focus:outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select
            value={marketId}
            onChange={(e) => {
              setMarketId(e.target.value);
              setPage(1);
            }}
            className={selectClass}
            aria-label="Filter by market"
          >
            <option value="ALL">All markets</option>
            {marketOptions.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as "ALL" | SchoolStatus);
              setPage(1);
            }}
            className={selectClass}
            aria-label="Filter by status"
          >
            <option value="ALL">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </section>

      <DataTable
        rows={items}
        columns={columns}
        gridCols={GRID_COLS}
        minWidth="780px"
        getRowKey={(s) => s.id}
        loading={loading}
        pagination={{
          page,
          pageSize: limit,
          total,
          onPageChange: setPage,
          onPageSizeChange: (size) => {
            setLimit(size);
            setPage(1);
          },
        }}
        renderCard={(s) => (
          <div className="bg-white border border-neutral-200/60 rounded-[10px] p-4 flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <SchoolThumb url={s.imageUrl} alt={s.name} size={40} />
              <div className="min-w-0 flex-1">
                <p className="font-lato text-[15px] font-bold text-neutral-900 truncate leading-tight">{s.name}</p>
                <p className="font-lato text-[12px] font-medium text-neutral-500 truncate mt-0.5">{s.city}, {s.state}</p>
              </div>
              <SchoolStatusBadge status={s.status} />
            </div>
            <div className="flex items-center justify-between gap-4 font-lato text-[12px] font-medium text-neutral-500">
              <span>{s.market?.name ?? "—"}</span>
              <span>{s.userCount.toLocaleString()} participants</span>
            </div>
            <SchoolActions school={s} onView={setViewing} onEdit={setEditing} onToggle={setStatusTarget} onDelete={setDeleteTarget} />
          </div>
        )}
        countLabel={(n) => `${n} ${n === 1 ? "school" : "schools"}`}
        emptyTitle="No schools found"
        emptyText="Try adjusting your search or filters, or add a new school."
      />

      {adding && (
        <SchoolForm school={null} marketOptions={marketOptions} saving={saving} onClose={() => setAdding(false)} onSubmit={handleCreate} />
      )}
      {editing && (
        <SchoolForm school={editing} marketOptions={marketOptions} saving={saving} onClose={() => setEditing(null)} onSubmit={handleUpdate} />
      )}
      {viewing && <SchoolDetail school={viewing} onClose={() => setViewing(null)} />}
      {statusTarget && (
        <ConfirmDialog
          title={statusTarget.status === "ACTIVE" ? "Deactivate school?" : "Activate school?"}
          message={
            <>
              <span className="font-semibold text-neutral-700">{statusTarget.name}</span> will be marked as{" "}
              {statusTarget.status === "ACTIVE" ? "inactive" : "active"}.
            </>
          }
          confirmLabel={statusTarget.status === "ACTIVE" ? "Deactivate" : "Activate"}
          danger={statusTarget.status === "ACTIVE"}
          onConfirm={() => handleToggle(statusTarget)}
          onClose={() => setStatusTarget(null)}
        />
      )}
      {deleteTarget && (
        <ConfirmDialog
          title="Deactivate school?"
          message={
            <>
              <span className="font-semibold text-neutral-700">{deleteTarget.name}</span> will remain in the database but will be marked inactive.
            </>
          }
          confirmLabel="Deactivate"
          danger
          onConfirm={() => handleDelete(deleteTarget.id)}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </main>
  );
}
