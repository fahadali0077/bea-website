"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, SquarePen, MessageSquareText, CalendarDays, AlertCircle, Loader2, CheckCircle2, Trophy } from "lucide-react";
import {
  listPrompts,
  createPrompt,
  updatePrompt,
  calculatePromptWinners,
  type ApiPrompt,
  type CreatePromptInput,
  type UpdatePromptInput,
  type PromptStatus,
  type PromptWinnerResult,
} from "@/lib/admin/prompts-api";
import { Badge } from "@/app/components/admin/Badge";
import { PageHeading } from "@/app/components/admin/PageHeading";
import { StatCard } from "@/app/components/admin/StatCard";
import { SlideOver } from "@/app/components/admin/SlideOver";
import { DataTable, type Column } from "@/app/components/admin/DataTable";
import { IconButton } from "@/app/components/admin/IconButton";

const GRID_COLS = "grid-cols-[minmax(220px,2fr)_140px_130px_minmax(100px,auto)]";

const inputClass =
  "w-full font-lato text-[14px] text-neutral-800 bg-white border border-neutral-200/80 rounded-[8px] px-3.5 py-2.5 focus:outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400";
const labelClass = "font-lato text-[13px] font-bold text-neutral-700";

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

function formatDate(iso?: string | null) {
  return iso ? dateFmt.format(new Date(iso)) : "—";
}

/** Convert `<input type="date">` value (YYYY-MM-DD) to a stable mid-day UTC ISO. */
function dateInputToIso(dateStr: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return "";
  return `${dateStr}T12:00:00.000Z`;
}

function todayDateInputValue(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

const STATUS_TONE: Record<PromptStatus, string> = {
  SCHEDULED: "bg-[#eceef2] text-[#5b6b7d]",
  ACTIVE: "bg-[#e7f0ea] text-[#3d7a6e]",
  CLOSED: "bg-[#f7efe0] text-[#b0843a]",
  ARCHIVED: "bg-neutral-100 text-neutral-500",
};

function PromptStatusBadge({ status }: { status: PromptStatus }) {
  return <Badge tone={STATUS_TONE[status]}>{status.charAt(0) + status.slice(1).toLowerCase()}</Badge>;
}

function PromptForm({
  prompt,
  saving,
  onClose,
  onSubmit,
}: {
  prompt: ApiPrompt | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (values: CreatePromptInput & UpdatePromptInput) => Promise<void>;
}) {
  const [title, setTitle] = useState(prompt?.title ?? "");
  const [description, setDescription] = useState(prompt?.description ?? "");
  const [promptDate, setPromptDate] = useState(
    prompt?.promptDate ? prompt.promptDate.slice(0, 10) : todayDateInputValue(),
  );
  const [status, setStatus] = useState<PromptStatus>(prompt?.status ?? "SCHEDULED");
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!title.trim()) return setError("Prompt title is required");
    if (!prompt && !promptDate) return setError("Please choose a date");

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        promptDate: promptDate ? dateInputToIso(promptDate) : "",
        status,
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
            {prompt ? "Edit Prompt" : "Create Prompt"}
          </p>
          <p className="font-lato text-[13px] font-medium text-neutral-500 mt-0.5">
            {prompt ? "Update the prompt content or status." : "Schedule a daily prompt for the active competition."}
          </p>
        </div>
      }
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="prm-title" className={labelClass}>Prompt</label>
        <input id="prm-title" value={title} onChange={(e) => { setTitle(e.target.value); setError(null); }} placeholder="Ask the community something…" className={inputClass} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="prm-desc" className={labelClass}>Description</label>
        <textarea id="prm-desc" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional context shown under the prompt." className={`${inputClass} resize-none`} />
      </div>

      {!prompt && (
        <div className="flex flex-col gap-2">
          <label htmlFor="prm-date" className={labelClass}>Date</label>
          <input id="prm-date" type="date" value={promptDate} onChange={(e) => { setPromptDate(e.target.value); setError(null); }} className={`${inputClass} cursor-pointer`} />
        </div>
      )}

      {prompt && (
        <div className="flex flex-col gap-2">
          <label htmlFor="prm-status" className={labelClass}>Status</label>
          <select id="prm-status" value={status} onChange={(e) => setStatus(e.target.value as PromptStatus)} className={`${inputClass} cursor-pointer`}>
            <option value="SCHEDULED">Scheduled</option>
            <option value="ACTIVE">Active</option>
            <option value="CLOSED">Closed</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      )}

      {error && <p className="font-lato text-[12px] font-semibold text-[#b0453a]">{error}</p>}

      <button
        type="button"
        onClick={submit}
        disabled={saving}
        className="inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-lato text-[14px] font-semibold px-5 py-2.5 rounded-full transition-colors disabled:opacity-60"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" strokeWidth={2} />}
        {prompt ? "Save changes" : "Create prompt"}
      </button>
    </SlideOver>
  );
}

function WinnerReviewPanel({
  prompt,
  result,
  loading,
  confirming,
  error,
  onClose,
  onConfirm,
}: {
  prompt: ApiPrompt;
  result: PromptWinnerResult | null;
  loading: boolean;
  confirming: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <SlideOver
      onClose={onClose}
      header={
        <div>
          <p className="font-canela text-[20px] font-medium text-neutral-900 leading-tight">
            Review winners
          </p>
          <p className="font-lato text-[13px] font-medium text-neutral-500 mt-0.5">
            {prompt.title}
          </p>
        </div>
      }
    >
      {loading && (
        <div className="flex items-center gap-2 text-neutral-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="font-lato text-[13px] font-semibold">Calculating winners...</span>
        </div>
      )}

      {error && <p className="font-lato text-[12px] font-semibold text-[#b0453a]">{error}</p>}

      {result && (
        <>
          <div className="rounded-[10px] border border-neutral-200 bg-[#f7f4ef] px-4 py-3">
            <p className="font-lato text-[13px] font-bold text-neutral-800">{result.message}</p>
            <p className="font-lato text-[12px] font-medium text-neutral-500 mt-1">
              {result.alreadyCalculated
                ? `${result.awardsCount} existing bonus awards found.`
                : `${result.winners.length} calculated winners ready for review.`}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {result.winners.length === 0 ? (
              <div className="rounded-[10px] border border-dashed border-neutral-300 px-4 py-6 text-center">
                <p className="font-lato text-[13px] font-semibold text-neutral-500">No eligible responses found.</p>
              </div>
            ) : (
              result.winners.map((winner) => (
                <div key={`${winner.responseId}-${winner.scope}`} className="rounded-[10px] border border-neutral-200 bg-white px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-lato text-[13px] font-bold text-neutral-900">
                        {winner.userName}
                      </p>
                      <p className="font-lato text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.08em] mt-0.5">
                        {winner.scope} {winner.rank ? `#${winner.rank}` : ""} / {winner.points} pts
                      </p>
                    </div>
                    <Badge tone="bg-[#f7efe0] text-[#7c5a22]">{winner.points}</Badge>
                  </div>
                  <p className="font-lato text-[12px] font-medium text-neutral-600 mt-2 line-clamp-2">
                    {winner.responseText || "No response text"}
                  </p>
                  <p className="font-lato text-[11px] font-medium text-neutral-400 mt-2">
                    {winner.likesCount} likes / {winner.commentsCount} comments / {winner.schoolName || winner.marketName || "Community"}
                  </p>
                </div>
              ))
            )}
          </div>

          {!result.confirmed && result.winners.length > 0 && (
            <button
              type="button"
              onClick={onConfirm}
              disabled={confirming}
              className="inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-lato text-[14px] font-semibold px-5 py-2.5 rounded-full transition-colors disabled:opacity-60"
            >
              {confirming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trophy className="w-4 h-4" strokeWidth={2} />}
              Confirm and award points
            </button>
          )}
        </>
      )}
    </SlideOver>
  );
}

export default function AdminPromptsPage() {
  const [items, setItems] = useState<ApiPrompt[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<ApiPrompt | null>(null);
  const [saving, setSaving] = useState(false);
  const [winnerPrompt, setWinnerPrompt] = useState<ApiPrompt | null>(null);
  const [winnerResult, setWinnerResult] = useState<PromptWinnerResult | null>(null);
  const [winnerLoading, setWinnerLoading] = useState(false);
  const [winnerConfirming, setWinnerConfirming] = useState(false);
  const [winnerError, setWinnerError] = useState<string | null>(null);

  const fetchPrompts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listPrompts({ page, limit });
      setItems(result.items);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load prompts");
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void fetchPrompts();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [fetchPrompts]);

  const activeCount = items.filter((p) => p.status === "ACTIVE").length;
  const scheduledCount = items.filter((p) => p.status === "SCHEDULED").length;

  const handleCreate = async (values: CreatePromptInput) => {
    setSaving(true);
    try {
      await createPrompt(values);
      fetchPrompts();
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (values: UpdatePromptInput) => {
    if (!editing) return;
    setSaving(true);
    try {
      await updatePrompt(editing.id, values);
      fetchPrompts();
    } finally {
      setSaving(false);
    }
  };

  const openWinnerReview = async (prompt: ApiPrompt) => {
    setWinnerPrompt(prompt);
    setWinnerResult(null);
    setWinnerError(null);
    setWinnerLoading(true);
    try {
      const result = await calculatePromptWinners(prompt.id, false);
      setWinnerResult(result);
    } catch (err) {
      setWinnerError(err instanceof Error ? err.message : "Failed to calculate winners");
    } finally {
      setWinnerLoading(false);
    }
  };

  const confirmWinnerAwards = async () => {
    if (!winnerPrompt) return;
    setWinnerConfirming(true);
    setWinnerError(null);
    try {
      const result = await calculatePromptWinners(winnerPrompt.id, true);
      setWinnerResult(result);
    } catch (err) {
      setWinnerError(err instanceof Error ? err.message : "Failed to award winners");
    } finally {
      setWinnerConfirming(false);
    }
  };

  const columns: Column<ApiPrompt>[] = [
    {
      key: "prompt",
      header: "Prompt",
      cellClassName: "min-w-0",
      cell: (p) => (
        <div className="min-w-0">
          <p className="font-lato text-[14px] font-bold text-neutral-900 truncate leading-tight">{p.title}</p>
          <p className="font-lato text-[12px] font-medium text-neutral-500 truncate leading-tight mt-0.5">{p.description || "—"}</p>
        </div>
      ),
    },
    { key: "date", header: "Date", cell: (p) => formatDate(p.promptDate), cellClassName: "font-lato text-[13px] font-medium text-neutral-700" },
    { key: "status", header: "Status", cell: (p) => <PromptStatusBadge status={p.status} /> },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "justify-self-end",
      cellClassName: "justify-self-end",
      cell: (p) => (
        <div className="md:justify-self-end flex items-center gap-2">
          <IconButton label="Review winners" onClick={() => openWinnerReview(p)}>
            <Trophy className="w-4 h-4" strokeWidth={2} />
          </IconButton>
          <IconButton label="Edit" onClick={() => setEditing(p)}>
            <SquarePen className="w-4 h-4" strokeWidth={2} />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <main className="flex-1 flex flex-col gap-6 md:gap-8 min-w-0">
      <title>Prompt Management - Bea Admin</title>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <PageHeading title="Prompt Management" subtitle="Create and schedule daily prompts for the active competition." />
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex items-center justify-center gap-2 self-start bg-neutral-900 hover:bg-neutral-800 text-white font-lato text-[14px] font-semibold px-5 py-2.5 rounded-full transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" strokeWidth={2.4} />
          Create prompt
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total Prompts" value={total.toLocaleString()} icon={<MessageSquareText className="w-5 h-5" strokeWidth={2.2} />} />
        <StatCard label="Scheduled" value={scheduledCount.toLocaleString()} icon={<CalendarDays className="w-5 h-5" strokeWidth={2.2} />} />
        <StatCard label="Active" value={activeCount.toLocaleString()} icon={<CheckCircle2 className="w-5 h-5" strokeWidth={2.2} />} />
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-[#faf0eb] border border-[#e8c9c1] rounded-[10px] px-4 py-3">
          <AlertCircle className="w-4 h-4 text-[#b0453a] shrink-0" strokeWidth={2} />
          <p className="font-lato text-[13px] font-semibold text-[#b0453a]">{error}</p>
        </div>
      )}

      <DataTable
        rows={items}
        columns={columns}
        gridCols={GRID_COLS}
        minWidth="640px"
        getRowKey={(p) => p.id}
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
        renderCard={(p) => (
          <div className="bg-white border border-neutral-200/60 rounded-[10px] p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-lato text-[15px] font-bold text-neutral-900 leading-snug">{p.title}</p>
                <p className="font-lato text-[12px] font-medium text-neutral-500 mt-1">{formatDate(p.promptDate)}</p>
              </div>
              <PromptStatusBadge status={p.status} />
            </div>
            <IconButton label="Review winners" onClick={() => openWinnerReview(p)}>
              <Trophy className="w-4 h-4" strokeWidth={2} />
            </IconButton>
            <IconButton label="Edit" onClick={() => setEditing(p)}>
              <SquarePen className="w-4 h-4" strokeWidth={2} />
            </IconButton>
          </div>
        )}
        countLabel={(n) => `${n} ${n === 1 ? "prompt" : "prompts"}`}
        emptyTitle="No prompts found"
        emptyText="Create a prompt to get started — an active competition is required."
      />

      {adding && <PromptForm prompt={null} saving={saving} onClose={() => setAdding(false)} onSubmit={handleCreate} />}
      {editing && <PromptForm prompt={editing} saving={saving} onClose={() => setEditing(null)} onSubmit={handleUpdate} />}
      {winnerPrompt && (
        <WinnerReviewPanel
          prompt={winnerPrompt}
          result={winnerResult}
          loading={winnerLoading}
          confirming={winnerConfirming}
          error={winnerError}
          onClose={() => setWinnerPrompt(null)}
          onConfirm={confirmWinnerAwards}
        />
      )}
    </main>
  );
}
