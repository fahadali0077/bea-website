"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Eye,
  SquarePen,
  Trash2,
  Trophy,
  CheckCircle2,
  Clock,
  Archive,
  AlertCircle,
  Loader2,
  CalendarPlus,
} from "lucide-react";
import {
  listCompetitions,
  getCompetition,
  createCompetition,
  updateCompetition,
  archiveCompetition,
  extendCompetition,
  type ApiCompetition,
  type CompetitionInput,
  type CompetitionUpdateInput,
  type CompetitionStatus,
  type ExtendCompetitionInput,
} from "@/lib/admin/competitions-api";
import { Badge } from "@/app/components/admin/Badge";
import { PageHeading } from "@/app/components/admin/PageHeading";
import { StatCard } from "@/app/components/admin/StatCard";
import { SlideOver } from "@/app/components/admin/SlideOver";
import { DetailRow, DetailSection } from "@/app/components/admin/DetailList";
import { DataTable, type Column } from "@/app/components/admin/DataTable";
import { IconButton } from "@/app/components/admin/IconButton";
import { ConfirmDialog } from "@/app/components/admin/ConfirmDialog";

const GRID_COLS =
  "grid-cols-[minmax(180px,1.6fr)_minmax(120px,1fr)_minmax(120px,1fr)_110px_90px_minmax(160px,auto)]";
const VALUE_CELL = "font-lato text-[13px] font-medium text-neutral-700 truncate";

const inputClass =
  "w-full font-lato text-[14px] text-neutral-800 bg-white border border-neutral-200/80 rounded-[8px] px-3.5 py-2.5 focus:outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400";
const labelClass = "font-lato text-[13px] font-bold text-neutral-700";

const STATUS_OPTIONS: CompetitionStatus[] = [
  "UPCOMING",
  "ACTIVE",
  "GRACE_PERIOD",
  "ENDED",
  "ARCHIVED",
];

const STATUS_LABELS: Record<CompetitionStatus, string> = {
  UPCOMING: "Upcoming",
  ACTIVE: "Active",
  GRACE_PERIOD: "Grace period",
  ENDED: "Ended",
  ARCHIVED: "Archived",
};

const STATUS_TONE: Record<CompetitionStatus, string> = {
  UPCOMING: "bg-[#eceef2] text-[#5b6b7d]",
  ACTIVE: "bg-[#e7f0ea] text-[#3d7a6e]",
  GRACE_PERIOD: "bg-[#f7efe0] text-[#b0843a]",
  ENDED: "bg-neutral-100 text-neutral-600",
  ARCHIVED: "bg-neutral-100 text-neutral-500",
};

const dateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function formatDate(iso?: string | null) {
  return iso ? dateFmt.format(new Date(iso)) : "—";
}

function toLocalInput(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInput(value: string): string {
  return new Date(value).toISOString();
}

function addDaysLocal(localValue: string, days: number): string {
  if (!localValue) return "";
  const d = new Date(localValue);
  if (Number.isNaN(d.getTime())) return "";
  d.setDate(d.getDate() + days);
  return toLocalInput(d.toISOString());
}

function canArchive(status: CompetitionStatus) {
  return status !== "ACTIVE" && status !== "GRACE_PERIOD";
}

function canExtend(status: CompetitionStatus) {
  return status === "UPCOMING" || status === "ACTIVE";
}

function CompetitionStatusBadge({ status }: { status: CompetitionStatus }) {
  return <Badge tone={STATUS_TONE[status]}>{STATUS_LABELS[status]}</Badge>;
}

type FormValues = {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  gracePeriodEndDate: string;
};

function CompetitionForm({
  competition,
  saving,
  onClose,
  onSubmit,
}: {
  competition: ApiCompetition | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (values: CompetitionInput | CompetitionUpdateInput) => Promise<void>;
}) {
  const [values, setValues] = useState<FormValues>({
    title: competition?.title ?? "",
    description: competition?.description ?? "",
    startDate: toLocalInput(competition?.startDate),
    endDate: toLocalInput(competition?.endDate),
    gracePeriodEndDate: toLocalInput(competition?.gracePeriodEndDate),
  });
  const [error, setError] = useState<string | null>(null);

  const update = (patch: Partial<FormValues>) => {
    setValues((current) => ({ ...current, ...patch }));
    setError(null);
  };

  const onStartChange = (startDate: string) => {
    const endDate = addDaysLocal(startDate, 7);
    const gracePeriodEndDate = addDaysLocal(endDate, 7);
    update({
      startDate,
      endDate: values.endDate || endDate,
      gracePeriodEndDate: values.gracePeriodEndDate || gracePeriodEndDate,
    });
  };

  const submit = async () => {
    if (!values.title.trim()) return setError("Title is required");
    if (!values.startDate) return setError("Start date is required");
    if (!values.endDate) return setError("End date is required");
    if (new Date(values.endDate) <= new Date(values.startDate)) {
      return setError("End date must be after start date");
    }

    try {
      await onSubmit({
        title: values.title.trim(),
        description: values.description.trim() || undefined,
        startDate: fromLocalInput(values.startDate),
        endDate: fromLocalInput(values.endDate),
        gracePeriodEndDate: values.gracePeriodEndDate
          ? fromLocalInput(values.gracePeriodEndDate)
          : undefined,
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
            {competition ? "Edit Competition" : "Create Competition"}
          </p>
          <p className="font-lato text-[13px] font-medium text-neutral-500 mt-0.5">
            {competition
              ? "Update competition details and schedule."
              : "Competitions must run for exactly 7 days (unless later extended)."}
          </p>
        </div>
      }
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="comp-title" className={labelClass}>
          Title
        </label>
        <input
          id="comp-title"
          value={values.title}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="e.g. Spring 2026 Competition"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="comp-desc" className={labelClass}>
          Description
        </label>
        <textarea
          id="comp-desc"
          value={values.description}
          onChange={(e) => update({ description: e.target.value })}
          placeholder="Optional description"
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="comp-start" className={labelClass}>
            Start date
          </label>
          <input
            id="comp-start"
            type="datetime-local"
            value={values.startDate}
            onChange={(e) => onStartChange(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="comp-end" className={labelClass}>
            End date
          </label>
          <input
            id="comp-end"
            type="datetime-local"
            value={values.endDate}
            onChange={(e) => update({ endDate: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="comp-grace" className={labelClass}>
          Grace period end
          <span className="font-medium text-neutral-400 ml-1">(optional)</span>
        </label>
        <input
          id="comp-grace"
          type="datetime-local"
          value={values.gracePeriodEndDate}
          onChange={(e) => update({ gracePeriodEndDate: e.target.value })}
          className={inputClass}
        />
        <p className="font-lato text-[12px] font-medium text-neutral-400">
          Defaults to 7 days after the end date if left blank.
        </p>
      </div>

      {error && <p className="font-lato text-[12px] font-semibold text-[#b0453a]">{error}</p>}

      <button
        type="button"
        onClick={submit}
        disabled={saving}
        className="inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-lato text-[14px] font-semibold px-5 py-2.5 rounded-full transition-colors disabled:opacity-60"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" strokeWidth={2} />}
        {competition ? "Save changes" : "Create competition"}
      </button>
    </SlideOver>
  );
}

function ExtendForm({
  competition,
  saving,
  onClose,
  onSubmit,
}: {
  competition: ApiCompetition;
  saving: boolean;
  onClose: () => void;
  onSubmit: (values: ExtendCompetitionInput) => Promise<void>;
}) {
  const [newEndDate, setNewEndDate] = useState(toLocalInput(competition.endDate));
  const [gracePeriodEndDate, setGracePeriodEndDate] = useState(
    toLocalInput(competition.gracePeriodEndDate),
  );
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!newEndDate) return setError("New end date is required");
    if (new Date(newEndDate) <= new Date(competition.endDate)) {
      return setError("New end date must be after the current end date");
    }
    try {
      await onSubmit({
        newEndDate: fromLocalInput(newEndDate),
        gracePeriodEndDate: gracePeriodEndDate
          ? fromLocalInput(gracePeriodEndDate)
          : undefined,
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
            Extend Competition
          </p>
          <p className="font-lato text-[13px] font-medium text-neutral-500 mt-0.5">
            Push the end date past {formatDate(competition.endDate)}. Only available before scoring ends.
          </p>
        </div>
      }
    >
      <DetailSection title="Current schedule">
        <DetailRow label="Start" value={formatDate(competition.startDate)} />
        <DetailRow label="End" value={formatDate(competition.endDate)} />
        <DetailRow label="Grace ends" value={formatDate(competition.gracePeriodEndDate)} />
      </DetailSection>

      <div className="flex flex-col gap-2">
        <label htmlFor="ext-end" className={labelClass}>
          New end date
        </label>
        <input
          id="ext-end"
          type="datetime-local"
          value={newEndDate}
          onChange={(e) => {
            setNewEndDate(e.target.value);
            setError(null);
            if (!gracePeriodEndDate) {
              setGracePeriodEndDate(addDaysLocal(e.target.value, 7));
            }
          }}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="ext-grace" className={labelClass}>
          Grace period end
          <span className="font-medium text-neutral-400 ml-1">(optional)</span>
        </label>
        <input
          id="ext-grace"
          type="datetime-local"
          value={gracePeriodEndDate}
          onChange={(e) => {
            setGracePeriodEndDate(e.target.value);
            setError(null);
          }}
          className={inputClass}
        />
      </div>

      {error && <p className="font-lato text-[12px] font-semibold text-[#b0453a]">{error}</p>}

      <button
        type="button"
        onClick={submit}
        disabled={saving}
        className="inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-lato text-[14px] font-semibold px-5 py-2.5 rounded-full transition-colors disabled:opacity-60"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CalendarPlus className="w-4 h-4" strokeWidth={2} />}
        Extend competition
      </button>
    </SlideOver>
  );
}

function CompetitionDetail({
  competition,
  onClose,
}: {
  competition: ApiCompetition;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<ApiCompetition>(competition);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getCompetition(competition.id)
      .then((data) => active && setDetail(data))
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [competition.id]);

  return (
    <SlideOver
      onClose={onClose}
      header={
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-canela text-[20px] font-medium text-neutral-900 leading-tight">
              {detail.title}
            </p>
            <CompetitionStatusBadge status={detail.status} />
            {detail.isExtended && (
              <Badge tone="bg-[#f3ece2] text-[#8a6a3f]">Extended</Badge>
            )}
          </div>
          <p className="font-lato text-[13px] font-medium text-neutral-500 mt-0.5">
            {formatDate(detail.startDate)} → {formatDate(detail.endDate)}
          </p>
        </div>
      }
    >
      {detail.description && (
        <p className="font-lato text-[14px] font-medium text-neutral-600 leading-relaxed">
          {detail.description}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#fbf7f4] border border-neutral-200/50 rounded-[10px] p-3.5">
          <p className="font-lato text-[12px] font-medium text-neutral-500 leading-none">
            Points entries
          </p>
          <p className="font-lato text-[20px] font-bold text-neutral-800 mt-2 leading-none">
            {detail.pointsEntryCount.toLocaleString()}
          </p>
        </div>
        <div className="bg-[#fbf7f4] border border-neutral-200/50 rounded-[10px] p-3.5">
          <p className="font-lato text-[12px] font-medium text-neutral-500 leading-none">Status</p>
          <div className="mt-2">
            <CompetitionStatusBadge status={detail.status} />
          </div>
        </div>
      </div>

      <DetailSection title="Schedule">
        <DetailRow label="Start" value={formatDate(detail.startDate)} />
        <DetailRow label="End" value={formatDate(detail.endDate)} />
        <DetailRow label="Grace ends" value={formatDate(detail.gracePeriodEndDate)} />
        <DetailRow label="Extended" value={detail.isExtended ? "Yes" : "No"} />
      </DetailSection>

      <DetailSection title="Meta">
        <DetailRow label="Created" value={formatDate(detail.createdAt)} />
        <DetailRow label="Updated" value={formatDate(detail.updatedAt)} />
        <DetailRow label="ID" value={detail.id} />
      </DetailSection>

      {loading && (
        <p className="font-lato text-[12px] font-medium text-neutral-400 flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Refreshing…
        </p>
      )}
    </SlideOver>
  );
}

function CompetitionActions({
  competition,
  onView,
  onEdit,
  onExtend,
  onArchive,
}: {
  competition: ApiCompetition;
  onView: (c: ApiCompetition) => void;
  onEdit: (c: ApiCompetition) => void;
  onExtend: (c: ApiCompetition) => void;
  onArchive: (c: ApiCompetition) => void;
}) {
  const archiveAllowed = canArchive(competition.status);
  const extendAllowed = canExtend(competition.status);

  return (
    <div className="flex items-center gap-1 md:justify-self-end">
      <IconButton label="View" onClick={() => onView(competition)}>
        <Eye className="w-4 h-4" strokeWidth={2} />
      </IconButton>
      <IconButton label="Edit" onClick={() => onEdit(competition)}>
        <SquarePen className="w-4 h-4" strokeWidth={2} />
      </IconButton>
      {extendAllowed && (
        <IconButton label="Extend" onClick={() => onExtend(competition)}>
          <CalendarPlus className="w-4 h-4" strokeWidth={2} />
        </IconButton>
      )}
      {archiveAllowed && competition.status !== "ARCHIVED" && (
        <IconButton label="Archive" onClick={() => onArchive(competition)} danger>
          <Trash2 className="w-4 h-4" strokeWidth={2} />
        </IconButton>
      )}
    </div>
  );
}

export default function AdminCompetitionsPage() {
  const [items, setItems] = useState<ApiCompetition[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState<"ALL" | CompetitionStatus>("ALL");

  const [counts, setCounts] = useState({
    total: 0,
    active: 0,
    upcoming: 0,
    archived: 0,
  });

  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<ApiCompetition | null>(null);
  const [viewing, setViewing] = useState<ApiCompetition | null>(null);
  const [extending, setExtending] = useState<ApiCompetition | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<ApiCompetition | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchCompetitions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listCompetitions({
        page,
        limit,
        status: status === "ALL" ? undefined : status,
      });
      setItems(result.items);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load competitions");
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, status]);

  const loadCounts = useCallback(async () => {
    try {
      const [all, active, upcoming, archived] = await Promise.all([
        listCompetitions({ page: 1, limit: 1 }),
        listCompetitions({ page: 1, limit: 1, status: "ACTIVE" }),
        listCompetitions({ page: 1, limit: 1, status: "UPCOMING" }),
        listCompetitions({ page: 1, limit: 1, status: "ARCHIVED" }),
      ]);
      setCounts({
        total: all.total,
        active: active.total,
        upcoming: upcoming.total,
        archived: archived.total,
      });
    } catch {
      /* ignore count errors */
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCompetitions();
  }, [fetchCompetitions]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCounts();
  }, [loadCounts]);

  const refresh = useCallback(() => {
    fetchCompetitions();
    loadCounts();
  }, [fetchCompetitions, loadCounts]);

  const handleCreate = async (input: CompetitionInput | CompetitionUpdateInput) => {
    setSaving(true);
    try {
      await createCompetition(input as CompetitionInput);
      setActionError(null);
      refresh();
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (input: CompetitionInput | CompetitionUpdateInput) => {
    if (!editing) return;
    setSaving(true);
    try {
      await updateCompetition(editing.id, input);
      setActionError(null);
      refresh();
    } finally {
      setSaving(false);
    }
  };

  const handleExtend = async (input: ExtendCompetitionInput) => {
    if (!extending) return;
    setSaving(true);
    try {
      await extendCompetition(extending.id, input);
      setActionError(null);
      refresh();
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await archiveCompetition(id);
      setActionError(null);
      refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to archive competition");
    }
  };

  const columns: Column<ApiCompetition>[] = [
    {
      key: "title",
      header: "Competition",
      cellClassName: "min-w-0",
      cell: (c) => (
        <div className="min-w-0">
          <p className="font-lato text-[14px] font-bold text-neutral-900 truncate leading-tight">
            {c.title}
          </p>
          <p className="font-lato text-[12px] font-medium text-neutral-500 truncate leading-tight mt-0.5">
            {c.isExtended ? "Extended · " : ""}
            {c.pointsEntryCount.toLocaleString()} entries
          </p>
        </div>
      ),
    },
    {
      key: "start",
      header: "Start",
      cell: (c) => formatDate(c.startDate),
      cellClassName: VALUE_CELL,
    },
    {
      key: "end",
      header: "End",
      cell: (c) => formatDate(c.endDate),
      cellClassName: VALUE_CELL,
    },
    {
      key: "status",
      header: "Status",
      cell: (c) => <CompetitionStatusBadge status={c.status} />,
    },
    {
      key: "grace",
      header: "Grace",
      cell: (c) => formatDate(c.gracePeriodEndDate),
      cellClassName: VALUE_CELL,
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "justify-self-end",
      cellClassName: "justify-self-end",
      cell: (c) => (
        <CompetitionActions
          competition={c}
          onView={setViewing}
          onEdit={setEditing}
          onExtend={setExtending}
          onArchive={setArchiveTarget}
        />
      ),
    },
  ];

  const selectClass =
    "w-full sm:w-auto font-lato text-[13px] font-medium text-neutral-700 bg-[#fbfbf9] border border-neutral-200/70 rounded-[8px] px-3 py-2.5 cursor-pointer focus:outline-none focus:border-neutral-400 transition-colors";

  return (
    <main className="flex-1 flex flex-col gap-6 md:gap-8 min-w-0">
      <title>Competition Management - Bea Admin</title>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <PageHeading
          title="Competition Management"
          subtitle="Create, schedule, extend, and archive competitions."
        />
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex items-center justify-center gap-2 self-start bg-neutral-900 hover:bg-neutral-800 text-white font-lato text-[14px] font-semibold px-5 py-2.5 rounded-full transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" strokeWidth={2.4} />
          Create competition
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total"
          value={counts.total.toLocaleString()}
          icon={<Trophy className="w-5 h-5" strokeWidth={2.2} />}
        />
        <StatCard
          label="Active"
          value={counts.active.toLocaleString()}
          icon={<CheckCircle2 className="w-5 h-5" strokeWidth={2.2} />}
        />
        <StatCard
          label="Upcoming"
          value={counts.upcoming.toLocaleString()}
          icon={<Clock className="w-5 h-5" strokeWidth={2.2} />}
        />
        <StatCard
          label="Archived"
          value={counts.archived.toLocaleString()}
          icon={<Archive className="w-5 h-5" strokeWidth={2.2} />}
        />
      </div>

      {(error || actionError) && (
        <div className="flex items-center gap-2 bg-[#faf0eb] border border-[#e8c9c1] rounded-[10px] px-4 py-3">
          <AlertCircle className="w-4 h-4 text-[#b0453a] shrink-0" strokeWidth={2} />
          <p className="font-lato text-[13px] font-semibold text-[#b0453a]">
            {error ?? actionError}
          </p>
        </div>
      )}

      <section className="bg-[#fbfbf9] border border-neutral-200/50 rounded-[12px] p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.015)] flex flex-col sm:flex-row sm:items-center gap-3">
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as "ALL" | CompetitionStatus);
            setPage(1);
          }}
          className={selectClass}
          aria-label="Filter by status"
        >
          <option value="ALL">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </section>

      <DataTable
        rows={items}
        columns={columns}
        gridCols={GRID_COLS}
        minWidth="860px"
        getRowKey={(c) => c.id}
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
        renderCard={(c) => (
          <div className="bg-white border border-neutral-200/60 rounded-[10px] p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-lato text-[15px] font-bold text-neutral-900 truncate leading-tight">
                  {c.title}
                </p>
                <p className="font-lato text-[12px] font-medium text-neutral-500 truncate mt-0.5">
                  {formatDate(c.startDate)} → {formatDate(c.endDate)}
                </p>
              </div>
              <CompetitionStatusBadge status={c.status} />
            </div>
            <div className="flex items-center justify-between gap-4 font-lato text-[12px] font-medium text-neutral-500">
              <span>{c.pointsEntryCount.toLocaleString()} entries</span>
              <span>{c.isExtended ? "Extended" : "Standard"}</span>
            </div>
            <CompetitionActions
              competition={c}
              onView={setViewing}
              onEdit={setEditing}
              onExtend={setExtending}
              onArchive={setArchiveTarget}
            />
          </div>
        )}
        countLabel={(n) => `${n} ${n === 1 ? "competition" : "competitions"}`}
        emptyTitle="No competitions found"
        emptyText="Create a competition to schedule prompts and scoring."
      />

      {adding && (
        <CompetitionForm
          competition={null}
          saving={saving}
          onClose={() => setAdding(false)}
          onSubmit={handleCreate}
        />
      )}
      {editing && (
        <CompetitionForm
          competition={editing}
          saving={saving}
          onClose={() => setEditing(null)}
          onSubmit={handleUpdate}
        />
      )}
      {extending && (
        <ExtendForm
          competition={extending}
          saving={saving}
          onClose={() => setExtending(null)}
          onSubmit={handleExtend}
        />
      )}
      {viewing && <CompetitionDetail competition={viewing} onClose={() => setViewing(null)} />}
      {archiveTarget && (
        <ConfirmDialog
          title="Archive competition?"
          message={
            <>
              <span className="font-semibold text-neutral-700">{archiveTarget.title}</span> will be
              soft-deleted and marked archived. Active and grace-period competitions cannot be
              archived.
            </>
          }
          confirmLabel="Archive"
          danger
          onConfirm={() => handleArchive(archiveTarget.id)}
          onClose={() => setArchiveTarget(null)}
        />
      )}
    </main>
  );
}
