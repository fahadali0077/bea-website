/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Gift, Ticket, Clock, CheckCircle2, Check, X, Power, AlertCircle, Loader2, Ban, Timer, PackageCheck } from "lucide-react";
import {
  AUDIENCE_TYPES,
  REWARD_TYPES,
  UNLOCK_TYPES,
  createReward,
  listRedemptions,
  listRewards,
  updateRedemptionStatus,
  updateRewardStatus,
  type ApiRedemption,
  type ApiReward,
  type CreateRewardInput,
  type RedemptionAction,
  type RedemptionStatus,
  type RewardAudience,
} from "@/lib/admin/rewards-api";
import { EntityStatusBadge, Badge } from "@/app/components/admin/Badge";
import { PageHeading } from "@/app/components/admin/PageHeading";
import { StatCard } from "@/app/components/admin/StatCard";
import { SlideOver } from "@/app/components/admin/SlideOver";
import { DataTable, type Column } from "@/app/components/admin/DataTable";
import { IconButton } from "@/app/components/admin/IconButton";
import { Tabs } from "@/app/components/admin/Tabs";

const REW_COLS = "grid-cols-[minmax(220px,1.7fr)_minmax(160px,1fr)_minmax(180px,1.1fr)_120px_110px_minmax(120px,auto)]";
const RED_COLS = "grid-cols-[minmax(180px,1.3fr)_minmax(170px,1.2fr)_120px_120px_130px_minmax(160px,auto)]";

const inputClass =
  "w-full font-lato text-[14px] text-neutral-800 bg-white border border-neutral-200/80 rounded-[8px] px-3.5 py-2.5 focus:outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400";
const labelClass = "font-lato text-[13px] font-bold text-neutral-700";

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
function formatDate(iso?: string | null) {
  return iso ? dateFmt.format(new Date(iso)) : "-";
}

function titleCase(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const REDEMPTION_TONE: Record<RedemptionStatus, string> = {
  REQUESTED: "bg-[#f7efe0] text-[#b0843a]",
  APPROVED: "bg-[#eceef2] text-[#5b6b7d]",
  REJECTED: "bg-[#faf0eb] text-[#b0453a]",
  CANCELLED: "bg-neutral-100 text-neutral-600",
  REDEEMED: "bg-[#e7f0ea] text-[#3d7a6e]",
  EXPIRED: "bg-neutral-100 text-neutral-500",
};

const reasonRequired = new Set<RedemptionAction>(["REJECTED", "CANCELLED", "EXPIRED"]);

function RewardStatusBadge({ status }: { status: "ACTIVE" | "INACTIVE" }) {
  return <EntityStatusBadge status={status === "ACTIVE" ? "active" : "inactive"} />;
}

function RedemptionStatusBadge({ status }: { status: RedemptionStatus }) {
  return <Badge tone={REDEMPTION_TONE[status]}>{titleCase(status)}</Badge>;
}

function unlockRule(reward: ApiReward): string {
  const parts = [];
  if (reward.requiredPoints) parts.push(`${reward.requiredPoints.toLocaleString()} pts`);
  if (reward.requiredInvites) parts.push(`${reward.requiredInvites.toLocaleString()} invites`);
  if (reward.requiredRank) parts.push(`rank #${reward.requiredRank}`);
  if (reward.requiredAppDownloads) parts.push(`${reward.requiredAppDownloads} app downloads`);
  return parts.length ? `${reward.ruleOperator} ${parts.join(" + ")}` : titleCase(reward.unlockType || "MANUAL");
}

function numberOrNull(value: string, min = 0) {
  if (value === "") return null;
  return Math.max(min, Number(value) || min);
}

function RewardForm({
  saving,
  onClose,
  onSubmit,
}: {
  saving: boolean;
  onClose: () => void;
  onSubmit: (values: CreateRewardInput) => Promise<void>;
}) {
  const [values, setValues] = useState<CreateRewardInput>({
    title: "",
    description: "",
    rewardType: "MERCH",
    unlockType: "POINTS",
    audienceType: "ALL_USERS",
    ruleOperator: "ALL",
    isEnabled: true,
    isVisible: true,
    isRepeatable: false,
    maxRedemptionsPerUser: null,
    requiredPoints: 0,
    requiredInvites: null,
    requiredRank: null,
    requiredAppDownloads: null,
    quantity: null,
  });
  const [error, setError] = useState<string | null>(null);

  const update = (patch: Partial<CreateRewardInput>) => {
    setValues((current) => ({ ...current, ...patch }));
    setError(null);
  };

  const submit = async () => {
    if (!values.title.trim()) return setError("Reward title is required");
    if (values.isRepeatable && !values.maxRedemptionsPerUser) return setError("Repeatable rewards need a max per user");
    try {
      await onSubmit({
        ...values,
        title: values.title.trim(),
        description: values.description?.trim() || null,
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
          <p className="font-canela text-[20px] font-medium text-neutral-900 leading-tight">Add Reward</p>
          <p className="font-lato text-[13px] font-medium text-neutral-500 mt-0.5">Create a reward with structured unlock and inventory rules.</p>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="rw-title" className={labelClass}>Title</label>
          <input id="rw-title" value={values.title} onChange={(e) => update({ title: e.target.value })} placeholder="Reward name" className={inputClass} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="rw-desc" className={labelClass}>Description</label>
          <textarea id="rw-desc" rows={2} value={values.description ?? ""} onChange={(e) => update({ description: e.target.value })} placeholder="What the reward includes." className={`${inputClass} resize-none`} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Reward type" value={values.rewardType} options={REWARD_TYPES} onChange={(value) => update({ rewardType: value })} />
          <Select label="Unlock type" value={values.unlockType} options={UNLOCK_TYPES} onChange={(value) => update({
            unlockType: value,
            isVisible: value === "APP_DOWNLOAD" ? false : values.isVisible,
          })} />
          <Select label="Audience" value={values.audienceType ?? "ALL_USERS"} options={AUDIENCE_TYPES} onChange={(value) => update({ audienceType: value as RewardAudience })} />
          <Select label="Rule operator" value={values.ruleOperator ?? "ALL"} options={["ALL", "ANY"]} onChange={(value) => update({ ruleOperator: value as "ALL" | "ANY" })} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberField label="Required points" value={values.requiredPoints} min={0} onChange={(value) => update({ requiredPoints: value })} />
          <NumberField label="Required invites" value={values.requiredInvites} min={0} onChange={(value) => update({ requiredInvites: value })} />
          <NumberField label="Required rank" value={values.requiredRank} min={1} onChange={(value) => update({ requiredRank: value })} />
          <NumberField label="Required app downloads" value={values.requiredAppDownloads} min={0} onChange={(value) => update({ requiredAppDownloads: value })} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberField label="Quantity" value={values.quantity} min={0} placeholder="Unlimited" onChange={(value) => update({ quantity: value })} />
          <NumberField label="Max per user" value={values.maxRedemptionsPerUser} min={1} placeholder="Required if repeatable" onChange={(value) => update({ maxRedemptionsPerUser: value })} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Toggle label="Enabled" checked={Boolean(values.isEnabled)} onChange={(checked) => update({ isEnabled: checked })} />
          <Toggle label="Visible" checked={Boolean(values.isVisible)} onChange={(checked) => update({ isVisible: checked })} />
          <Toggle label="Repeatable" checked={Boolean(values.isRepeatable)} onChange={(checked) => update({ isRepeatable: checked, maxRedemptionsPerUser: checked ? values.maxRedemptionsPerUser : null })} />
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
        Add reward
      </button>
    </SlideOver>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (value: string) => void }) {
  const id = `reward-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={labelClass}>{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={`${inputClass} cursor-pointer`}>
        {options.map((option) => <option key={option} value={option}>{titleCase(option)}</option>)}
      </select>
    </div>
  );
}

function NumberField({ label, value, min, placeholder, onChange }: { label: string; value?: number | null; min: number; placeholder?: string; onChange: (value: number | null) => void }) {
  const id = `reward-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={labelClass}>{label}</label>
      <input id={id} type="number" min={min} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(numberOrNull(e.target.value, min))} className={inputClass} />
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 rounded-[8px] border border-neutral-200/80 bg-white px-3.5 py-2.5 font-lato text-[13px] font-bold text-neutral-700">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-neutral-900" />
      {label}
    </label>
  );
}

export default function AdminRewardsPage() {
  const [tab, setTab] = useState<"catalog" | "redemptions">("catalog");
  const [rewards, setRewards] = useState<ApiReward[]>([]);
  const [redemptions, setRedemptions] = useState<ApiRedemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"ALL" | RedemptionStatus>("ALL");
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchRewards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRewards(await listRewards());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load rewards");
      setRewards([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRedemptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRedemptions(await listRedemptions(statusFilter === "ALL" ? undefined : statusFilter));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load redemptions");
      setRedemptions([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    if (tab === "catalog") void fetchRewards();
    else void fetchRedemptions();
  }, [tab, fetchRewards, fetchRedemptions]);

  const handleCreate = async (input: CreateRewardInput) => {
    setSaving(true);
    try {
      await createReward(input);
      setActionError(null);
      void fetchRewards();
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (reward: ApiReward) => {
    try {
      await updateRewardStatus(reward.id, reward.status === "ACTIVE" ? "INACTIVE" : "ACTIVE");
      setActionError(null);
      void fetchRewards();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to update reward");
    }
  };

  const handleRedemptionAction = async (redemption: ApiRedemption, status: RedemptionAction) => {
    const reason = reasonRequired.has(status) ? window.prompt(`Reason for ${titleCase(status)}?`) : undefined;
    if (reasonRequired.has(status) && !reason?.trim()) return;
    try {
      await updateRedemptionStatus(redemption.id, status, { reason: reason?.trim() });
      setActionError(null);
      void fetchRedemptions();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to update redemption");
    }
  };

  const activeRewards = rewards.filter((r) => r.status === "ACTIVE").length;
  const pendingRedemptions = redemptions.filter((r) => r.status === "REQUESTED").length;

  const rewardColumns: Column<ApiReward>[] = [
    {
      key: "reward",
      header: "Reward",
      cellClassName: "min-w-0",
      cell: (r) => (
        <div className="min-w-0">
          <p className="font-lato text-[14px] font-bold text-neutral-900 truncate leading-tight">{r.title}</p>
          <p className="font-lato text-[12px] font-medium text-neutral-500 truncate leading-tight mt-0.5">{titleCase(r.rewardType)} / {titleCase(r.audienceType)}</p>
        </div>
      ),
    },
    { key: "unlock", header: "Unlock rule", cell: (r) => unlockRule(r), cellClassName: "font-lato text-[13px] font-medium text-neutral-700 truncate" },
    {
      key: "inventory",
      header: "Inventory",
      cell: (r) => r.quantity == null
        ? "Unlimited"
        : `${Math.max(r.quantity - r.quantityReserved - r.quantityRedeemed, 0)} left / ${r.quantity} total`,
      cellClassName: "font-lato text-[13px] font-bold text-neutral-800",
    },
    { key: "visibility", header: "Visible", cell: (r) => (r.isEnabled && r.isVisible ? "Yes" : "No"), cellClassName: "font-lato text-[13px] font-semibold text-neutral-700" },
    { key: "status", header: "Status", cell: (r) => <RewardStatusBadge status={r.status} /> },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "justify-self-end",
      cellClassName: "justify-self-end",
      cell: (r) => (
        <IconButton label={r.status === "ACTIVE" ? "Deactivate" : "Activate"} onClick={() => handleToggle(r)} active={r.status !== "ACTIVE"}>
          <Power className="w-4 h-4" strokeWidth={2} />
        </IconButton>
      ),
    },
  ];

  const redemptionColumns: Column<ApiRedemption>[] = [
    {
      key: "user",
      header: "User",
      cellClassName: "min-w-0",
      cell: (r) => (
        <div className="min-w-0">
          <p className="font-lato text-[14px] font-bold text-neutral-900 truncate leading-tight">{r.userName ?? (r.userId || "Unknown")}</p>
          {r.userEmail && <p className="font-lato text-[12px] font-medium text-neutral-500 truncate leading-tight mt-0.5">{r.userEmail}</p>}
        </div>
      ),
    },
    { key: "reward", header: "Reward", cell: (r) => r.rewardTitle ?? (r.rewardId || "-"), cellClassName: "font-lato text-[13px] font-medium text-neutral-700 truncate" },
    { key: "status", header: "Status", cell: (r) => <RedemptionStatusBadge status={r.status} /> },
    { key: "requested", header: "Requested", cell: (r) => formatDate(r.createdAt), cellClassName: "font-lato text-[13px] font-medium text-neutral-600" },
    { key: "reserved", header: "Reserved", cell: (r) => r.reservedQuantity.toLocaleString(), cellClassName: "font-lato text-[13px] font-bold text-neutral-800" },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "justify-self-end",
      cellClassName: "justify-self-end",
      cell: (r) => (
        <div className="flex items-center gap-1 md:justify-self-end">
          {r.status === "REQUESTED" ? (
            <>
              <IconButton label="Approve" onClick={() => handleRedemptionAction(r, "APPROVED")} active>
                <Check className="w-4 h-4" strokeWidth={2.4} />
              </IconButton>
              <IconButton label="Reject" onClick={() => handleRedemptionAction(r, "REJECTED")} danger>
                <X className="w-4 h-4" strokeWidth={2} />
              </IconButton>
              <IconButton label="Cancel" onClick={() => handleRedemptionAction(r, "CANCELLED")}>
                <Ban className="w-4 h-4" strokeWidth={2} />
              </IconButton>
              <IconButton label="Expire" onClick={() => handleRedemptionAction(r, "EXPIRED")}>
                <Timer className="w-4 h-4" strokeWidth={2} />
              </IconButton>
            </>
          ) : r.status === "APPROVED" ? (
            <>
              <IconButton label="Mark redeemed" onClick={() => handleRedemptionAction(r, "REDEEMED")}>
                <PackageCheck className="w-4 h-4" strokeWidth={2} />
              </IconButton>
              <IconButton label="Cancel" onClick={() => handleRedemptionAction(r, "CANCELLED")}>
                <Ban className="w-4 h-4" strokeWidth={2} />
              </IconButton>
              <IconButton label="Expire" onClick={() => handleRedemptionAction(r, "EXPIRED")}>
                <Timer className="w-4 h-4" strokeWidth={2} />
              </IconButton>
            </>
          ) : (
            <span className="font-lato text-[12px] font-medium text-neutral-400 md:justify-self-end">Final</span>
          )}
        </div>
      ),
    },
  ];

  const selectClass =
    "w-full sm:w-auto font-lato text-[13px] font-medium text-neutral-700 bg-[#fbfbf9] border border-neutral-200/70 rounded-[8px] px-3 py-2.5 cursor-pointer focus:outline-none focus:border-neutral-400 transition-colors";

  return (
    <main className="flex-1 flex flex-col gap-6 md:gap-8 min-w-0">
      <title>Rewards Management - Bea Admin</title>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <PageHeading title="Rewards Management" subtitle="Manage reward rules, inventory, and redemption requests." />
        {tab === "catalog" && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="inline-flex items-center justify-center gap-2 self-start bg-neutral-900 hover:bg-neutral-800 text-white font-lato text-[14px] font-semibold px-5 py-2.5 rounded-full transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" strokeWidth={2.4} />
            Add reward
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Rewards" value={rewards.length.toLocaleString()} icon={<Gift className="w-5 h-5" strokeWidth={2.2} />} />
        <StatCard label="Active" value={activeRewards.toLocaleString()} icon={<Ticket className="w-5 h-5" strokeWidth={2.2} />} />
        <StatCard label="Pending requests" value={pendingRedemptions.toLocaleString()} icon={<Clock className="w-5 h-5" strokeWidth={2.2} />} />
        <StatCard label="Redeemed" value={redemptions.filter((r) => r.status === "REDEEMED").length.toLocaleString()} icon={<CheckCircle2 className="w-5 h-5" strokeWidth={2.2} />} />
      </div>

      {(error || actionError) && (
        <div className="flex items-center gap-2 bg-[#faf0eb] border border-[#e8c9c1] rounded-[10px] px-4 py-3">
          <AlertCircle className="w-4 h-4 text-[#b0453a] shrink-0" strokeWidth={2} />
          <p className="font-lato text-[13px] font-semibold text-[#b0453a]">{error ?? actionError}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Tabs
          active={tab}
          onChange={setTab}
          items={[
            { value: "catalog", label: "Rewards", count: rewards.length },
            { value: "redemptions", label: "Redemptions", count: redemptions.length },
          ]}
        />
        {tab === "redemptions" && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "ALL" | RedemptionStatus)}
            className={`${selectClass} sm:ml-auto`}
            aria-label="Filter by status"
          >
            <option value="ALL">All statuses</option>
            {(["REQUESTED", "APPROVED", "REJECTED", "CANCELLED", "REDEEMED", "EXPIRED"] as RedemptionStatus[]).map((status) => (
              <option key={status} value={status}>{titleCase(status)}</option>
            ))}
          </select>
        )}
      </div>

      {tab === "catalog" ? (
        <DataTable
          rows={rewards}
          columns={rewardColumns}
          gridCols={REW_COLS}
          minWidth="980px"
          getRowKey={(r) => r.id}
          loading={loading}
          renderCard={(r) => (
            <div className="bg-white border border-neutral-200/60 rounded-[10px] p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-lato text-[15px] font-bold text-neutral-900 leading-snug">{r.title}</p>
                  <p className="font-lato text-[12px] font-medium text-neutral-500 mt-1">{titleCase(r.rewardType)} / {unlockRule(r)}</p>
                </div>
                <RewardStatusBadge status={r.status} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="font-lato text-[12px] font-medium text-neutral-500">
                  {r.quantity == null ? "Unlimited" : `${Math.max(r.quantity - r.quantityReserved - r.quantityRedeemed, 0)} left`}
                </span>
                <IconButton label={r.status === "ACTIVE" ? "Deactivate" : "Activate"} onClick={() => handleToggle(r)} active={r.status !== "ACTIVE"}>
                  <Power className="w-4 h-4" strokeWidth={2} />
                </IconButton>
              </div>
            </div>
          )}
          countLabel={(n) => `${n} ${n === 1 ? "reward" : "rewards"}`}
          emptyTitle="No rewards yet"
          emptyText="Add a reward to get started."
        />
      ) : (
        <DataTable
          rows={redemptions}
          columns={redemptionColumns}
          gridCols={RED_COLS}
          minWidth="920px"
          getRowKey={(r) => r.id}
          loading={loading}
          renderCard={(r) => (
            <div className="bg-white border border-neutral-200/60 rounded-[10px] p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-lato text-[14px] font-bold text-neutral-900 truncate">{r.userName ?? "Unknown"}</p>
                  <p className="font-lato text-[12px] font-medium text-neutral-500 truncate">{r.rewardTitle ?? r.rewardId}</p>
                </div>
                <RedemptionStatusBadge status={r.status} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="font-lato text-[12px] font-medium text-neutral-500">Requested {formatDate(r.createdAt)}</span>
              </div>
            </div>
          )}
          countLabel={(n) => `${n} ${n === 1 ? "request" : "requests"}`}
          emptyTitle="No redemption requests"
          emptyText="Redemption requests will appear here."
        />
      )}

      {adding && <RewardForm saving={saving} onClose={() => setAdding(false)} onSubmit={handleCreate} />}
    </main>
  );
}
