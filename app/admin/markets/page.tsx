"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Search, Eye, SquarePen, Power, Trash2, MapPin, CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";
import {
  listMarkets,
  getMarket,
  createMarket,
  updateMarket,
  toggleMarketStatus,
  deleteMarket,
  type ApiMarket,
  type MarketInput,
  type MarketStatus,
} from "@/lib/admin/markets-api";
import { EntityStatusBadge } from "@/app/components/admin/Badge";
import { PageHeading } from "@/app/components/admin/PageHeading";
import { StatCard } from "@/app/components/admin/StatCard";
import { SlideOver } from "@/app/components/admin/SlideOver";
import { DetailRow, DetailSection } from "@/app/components/admin/DetailList";
import { DataTable, type Column } from "@/app/components/admin/DataTable";
import { IconButton } from "@/app/components/admin/IconButton";
import { ConfirmDialog } from "@/app/components/admin/ConfirmDialog";

const GRID_COLS =
  "grid-cols-[minmax(180px,1.6fr)_110px_80px_90px_110px_110px_110px_minmax(140px,auto)]";

const inputClass =
  "w-full font-lato text-[14px] text-neutral-800 bg-white border border-neutral-200/80 rounded-[8px] px-3.5 py-2.5 focus:outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400";
const labelClass = "font-lato text-[13px] font-bold text-neutral-700";

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

function formatDate(iso?: string) {
  return iso ? dateFmt.format(new Date(iso)) : "—";
}

function unlockPercent(market: ApiMarket) {
  if (market.unlockTarget <= 0) return 100;
  return Math.min(100, Math.round((market.participantCount / market.unlockTarget) * 100));
}

function MarketStatusBadge({ status }: { status: MarketStatus }) {
  return <EntityStatusBadge status={status === "ACTIVE" ? "active" : "inactive"} />;
}

function MarketForm({
  market,
  saving,
  onClose,
  onSubmit,
}: {
  market: ApiMarket | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (values: MarketInput) => Promise<void>;
}) {
  const [values, setValues] = useState<MarketInput>({
    name: market?.name ?? "",
    city: market?.city ?? "",
    state: market?.state ?? "",
    country: market?.country ?? "US",
    unlockTarget: market?.unlockTarget ?? 500,
  });
  const [error, setError] = useState<string | null>(null);

  const update = (patch: Partial<MarketInput>) => {
    setValues((current) => ({ ...current, ...patch }));
    setError(null);
  };

  const submit = async () => {
    if (!values.name.trim()) return setError("Market name is required");
    try {
      await onSubmit({
        ...values,
        name: values.name.trim(),
        city: values.city.trim(),
        state: values.state.trim(),
        country: values.country.trim() || "US",
        unlockTarget: Math.max(0, Math.round(values.unlockTarget) || 0),
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
            {market ? "Edit Market" : "Add Market"}
          </p>
          <p className="font-lato text-[13px] font-medium text-neutral-500 mt-0.5">
            {market ? "Update market details and unlock target." : "Create a new market region."}
          </p>
        </div>
      }
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="mkt-name" className={labelClass}>Market name</label>
        <input id="mkt-name" value={values.name} onChange={(e) => update({ name: e.target.value })} placeholder="e.g. New York City" className={inputClass} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="mkt-city" className={labelClass}>City</label>
          <input id="mkt-city" value={values.city} onChange={(e) => update({ city: e.target.value })} placeholder="City" className={inputClass} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="mkt-state" className={labelClass}>State</label>
          <input id="mkt-state" value={values.state} onChange={(e) => update({ state: e.target.value })} placeholder="NY" className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="mkt-country" className={labelClass}>Country</label>
          <input id="mkt-country" value={values.country} onChange={(e) => update({ country: e.target.value })} placeholder="US" className={inputClass} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="mkt-target" className={labelClass}>Unlock target</label>
          <input id="mkt-target" type="number" min={0} value={values.unlockTarget} onChange={(e) => update({ unlockTarget: Number(e.target.value) })} placeholder="500" className={inputClass} />
        </div>
      </div>

      {error && <p className="font-lato text-[12px] font-semibold text-[#b0453a]">{error}</p>}

      <button
        type="button"
        onClick={submit}
        disabled={saving}
        className="inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-lato text-[14px] font-semibold px-5 py-2.5 rounded-full transition-colors disabled:opacity-60"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" strokeWidth={2} />}
        {market ? "Save changes" : "Add market"}
      </button>
    </SlideOver>
  );
}

function MarketDetail({ market, onClose }: { market: ApiMarket; onClose: () => void }) {
  const [detail, setDetail] = useState<ApiMarket>(market);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getMarket(market.id)
      .then((data) => active && setDetail(data))
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [market.id]);

  const percent = unlockPercent(detail);

  return (
    <SlideOver
      onClose={onClose}
      header={
        <div>
          <div className="flex items-center gap-2">
            <p className="font-canela text-[20px] font-medium text-neutral-900 leading-tight">{detail.name}</p>
            <MarketStatusBadge status={detail.status} />
          </div>
          <p className="font-lato text-[13px] font-medium text-neutral-500 mt-0.5">
            {detail.city}, {detail.state} · {detail.country}
          </p>
        </div>
      }
    >

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="font-lato text-[13px] font-semibold text-neutral-700">Unlock progress</p>
          <p className="font-lato text-[12px] font-bold text-[#584939]">
            {detail.participantCount.toLocaleString()} / {detail.unlockTarget.toLocaleString()}
          </p>
        </div>
        <div className="h-2.5 w-full rounded-full bg-[#efebe5] overflow-hidden">
          <div className="h-full rounded-full bg-[#c48b58]" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <DetailSection title="Details">
        <DetailRow label="City" value={detail.city || "—"} />
        <DetailRow label="State" value={detail.state || "—"} />
        <DetailRow label="Country" value={detail.country || "—"} />
        <DetailRow label="Unlock target" value={detail.unlockTarget.toLocaleString()} />
        <DetailRow label="Participants" value={detail.participantCount.toLocaleString()} />
        <DetailRow label="Status" value={<MarketStatusBadge status={detail.status} />} />
        <DetailRow label="Created" value={formatDate(detail.createdAt)} />
      </DetailSection>

      {loading && (
        <p className="font-lato text-[12px] font-medium text-neutral-400 flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Refreshing…
        </p>
      )}
    </SlideOver>
  );
}

function MarketActions({
  market,
  onView,
  onEdit,
  onToggle,
  onDelete,
}: {
  market: ApiMarket;
  onView: (m: ApiMarket) => void;
  onEdit: (m: ApiMarket) => void;
  onToggle: (m: ApiMarket) => void;
  onDelete: (m: ApiMarket) => void;
}) {
  const isActive = market.status === "ACTIVE";
  return (
    <div className="flex items-center gap-1 md:justify-self-end">
      <IconButton label="View" onClick={() => onView(market)}>
        <Eye className="w-4 h-4" strokeWidth={2} />
      </IconButton>
      <IconButton label="Edit" onClick={() => onEdit(market)}>
        <SquarePen className="w-4 h-4" strokeWidth={2} />
      </IconButton>
      <IconButton label={isActive ? "Deactivate" : "Activate"} onClick={() => onToggle(market)} active={!isActive}>
        <Power className="w-4 h-4" strokeWidth={2} />
      </IconButton>
      <IconButton label="Delete" onClick={() => onDelete(market)} danger>
        <Trash2 className="w-4 h-4" strokeWidth={2} />
      </IconButton>
    </div>
  );
}

export default function AdminMarketsPage() {
  const [items, setItems] = useState<ApiMarket[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [stateInput, setStateInput] = useState("");
  const [countryInput, setCountryInput] = useState("");
  const [status, setStatus] = useState<"ALL" | MarketStatus>("ALL");
  const [debounced, setDebounced] = useState({ search: "", state: "", country: "" });

  const [counts, setCounts] = useState({ total: 0, active: 0 });

  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<ApiMarket | null>(null);
  const [viewing, setViewing] = useState<ApiMarket | null>(null);
  const [statusTarget, setStatusTarget] = useState<ApiMarket | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiMarket | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced({ search: searchInput, state: stateInput, country: countryInput });
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, stateInput, countryInput]);

  const fetchMarkets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listMarkets({
        page,
        limit,
        search: debounced.search,
        state: debounced.state,
        country: debounced.country,
        status: status === "ALL" ? undefined : status,
      });
      setItems(result.items);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load markets");
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debounced, status]);

  const loadCounts = useCallback(async () => {
    try {
      const [all, active] = await Promise.all([
        listMarkets({ page: 1, limit: 1 }),
        listMarkets({ page: 1, limit: 1, status: "ACTIVE" }),
      ]);
      setCounts({ total: all.total, active: active.total });
    } catch {
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMarkets();
  }, [fetchMarkets]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCounts();
  }, [loadCounts]);

  const refresh = useCallback(() => {
    fetchMarkets();
    loadCounts();
  }, [fetchMarkets, loadCounts]);

  const handleCreate = async (input: MarketInput) => {
    setSaving(true);
    try {
      await createMarket(input);
      setActionError(null);
      refresh();
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (input: MarketInput) => {
    if (!editing) return;
    setSaving(true);
    try {
      await updateMarket(editing.id, input);
      setActionError(null);
      refresh();
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (market: ApiMarket) => {
    try {
      await toggleMarketStatus(market);
      setActionError(null);
      refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMarket(id);
      setActionError(null);
      refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to delete market");
    }
  };

  const columns: Column<ApiMarket>[] = [
    {
      key: "market",
      header: "Market",
      cellClassName: "flex items-center min-w-0",
      cell: (m) => (
        <p className="font-lato text-[14px] font-bold text-neutral-900 truncate leading-tight">{m.name}</p>
      ),
    },
    { key: "city", header: "City", cell: (m) => m.city || "—", cellClassName: "font-lato text-[13px] font-medium text-neutral-700 truncate" },
    { key: "state", header: "State", cell: (m) => m.state || "—", cellClassName: "font-lato text-[13px] font-medium text-neutral-700" },
    { key: "country", header: "Country", cell: (m) => m.country || "—", cellClassName: "font-lato text-[13px] font-medium text-neutral-700" },
    { key: "target", header: "Unlock", cell: (m) => m.unlockTarget.toLocaleString(), cellClassName: "font-lato text-[13px] font-medium text-neutral-700" },
    { key: "participants", header: "Participants", cell: (m) => m.participantCount.toLocaleString(), cellClassName: "font-lato text-[13px] font-bold text-neutral-800" },
    { key: "status", header: "Status", cell: (m) => <MarketStatusBadge status={m.status} /> },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "justify-self-end",
      cellClassName: "justify-self-end",
      cell: (m) => (
        <MarketActions market={m} onView={setViewing} onEdit={setEditing} onToggle={setStatusTarget} onDelete={setDeleteTarget} />
      ),
    },
  ];

  const selectClass =
    "w-full sm:w-auto font-lato text-[13px] font-medium text-neutral-700 bg-[#fbfbf9] border border-neutral-200/70 rounded-[8px] px-3 py-2.5 cursor-pointer focus:outline-none focus:border-neutral-400 transition-colors";

  return (
    <main className="flex-1 flex flex-col gap-6 md:gap-8 min-w-0">
      <title>Market Management - Bea Admin</title>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <PageHeading title="Market Management" subtitle="Add markets, set unlock targets, and manage availability." />
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex items-center justify-center gap-2 self-start bg-neutral-900 hover:bg-neutral-800 text-white font-lato text-[14px] font-semibold px-5 py-2.5 rounded-full transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" strokeWidth={2.4} />
          Add market
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total Markets" value={counts.total.toLocaleString()} icon={<MapPin className="w-5 h-5" strokeWidth={2.2} />} />
        <StatCard label="Active" value={counts.active.toLocaleString()} icon={<CheckCircle2 className="w-5 h-5" strokeWidth={2.2} />} />
        <StatCard label="Inactive" value={Math.max(0, counts.total - counts.active).toLocaleString()} icon={<XCircle className="w-5 h-5" strokeWidth={2.2} />} />
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
            placeholder="Search markets…"
            className="w-full font-lato text-[14px] text-neutral-800 bg-white border border-neutral-200/70 rounded-[8px] pl-10 pr-3 py-2.5 focus:outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            value={stateInput}
            onChange={(e) => setStateInput(e.target.value)}
            placeholder="State (e.g. NY)"
            className={`${inputClass} sm:w-36`}
          />
          <input
            type="text"
            value={countryInput}
            onChange={(e) => setCountryInput(e.target.value)}
            placeholder="Country (e.g. US)"
            className={`${inputClass} sm:w-36`}
          />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as "ALL" | MarketStatus);
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
        minWidth="1000px"
        getRowKey={(m) => m.id}
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
        renderCard={(m) => (
          <div className="bg-white border border-neutral-200/60 rounded-[10px] p-4 flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-lato text-[15px] font-bold text-neutral-900 truncate leading-tight">{m.name}</p>
                <p className="font-lato text-[12px] font-medium text-neutral-500 truncate mt-0.5">{m.city}, {m.state} · {m.country}</p>
              </div>
              <MarketStatusBadge status={m.status} />
            </div>
            <div className="flex items-center justify-between gap-4 font-lato text-[12px] font-medium text-neutral-500">
              <span>{m.participantCount.toLocaleString()} participants</span>
              <span>{unlockPercent(m)}% to unlock</span>
            </div>
            <MarketActions market={m} onView={setViewing} onEdit={setEditing} onToggle={setStatusTarget} onDelete={setDeleteTarget} />
          </div>
        )}
        countLabel={(n) => `${n} ${n === 1 ? "market" : "markets"}`}
        emptyTitle="No markets found"
        emptyText="Try adjusting your search or filters, or add a new market."
      />

      {adding && <MarketForm market={null} saving={saving} onClose={() => setAdding(false)} onSubmit={handleCreate} />}
      {editing && <MarketForm market={editing} saving={saving} onClose={() => setEditing(null)} onSubmit={handleUpdate} />}
      {viewing && <MarketDetail market={viewing} onClose={() => setViewing(null)} />}
      {statusTarget && (
        <ConfirmDialog
          title={statusTarget.status === "ACTIVE" ? "Deactivate market?" : "Activate market?"}
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
          title="Deactivate market?"
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
