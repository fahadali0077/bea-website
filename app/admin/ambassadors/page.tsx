"use client";

import { useCallback, useEffect, useState } from "react";
import { UserPlus, Send, Clock, Ban, Eye, UserMinus, AlertCircle, Loader2, BarChart3 } from "lucide-react";
import {
  listAmbassadors,
  listAmbassadorInvites,
  listAmbassadorPerformance,
  inviteAmbassador,
  revokeAmbassadorInvite,
  removeAmbassador,
  type ApiAmbassador,
  type ApiAmbassadorInvite,
  type AmbassadorPerformance,
  type InviteStatus,
} from "@/lib/admin/ambassadors-api";
import { getUser, type ApiUserDetail } from "@/lib/admin/users-api";
import { EntityStatusBadge, Badge } from "@/app/components/admin/Badge";
import { PageHeading } from "@/app/components/admin/PageHeading";
import { StatCard } from "@/app/components/admin/StatCard";
import { SlideOver } from "@/app/components/admin/SlideOver";
import { DetailRow, DetailSection } from "@/app/components/admin/DetailList";
import { DataTable, type Column } from "@/app/components/admin/DataTable";
import { IconButton } from "@/app/components/admin/IconButton";
import { ConfirmDialog } from "@/app/components/admin/ConfirmDialog";
import { Tabs } from "@/app/components/admin/Tabs";

const AMB_COLS = "grid-cols-[minmax(200px,1.8fr)_minmax(150px,1fr)_minmax(150px,1fr)_110px_minmax(120px,auto)]";
const INV_COLS = "grid-cols-[minmax(200px,1.8fr)_110px_130px_130px_minmax(120px,auto)]";
const PERF_COLS = "grid-cols-[80px_120px_minmax(190px,1.6fr)_120px_130px_120px_120px_120px_120px_110px_110px_110px]";

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

function formatDate(iso: string | null | undefined) {
  return iso ? dateFmt.format(new Date(iso)) : "—";
}

const INVITE_TONE: Record<InviteStatus, string> = {
  PENDING: "bg-[#f7efe0] text-[#b0843a]",
  ACCEPTED: "bg-[#e7f0ea] text-[#3d7a6e]",
  EXPIRED: "bg-neutral-100 text-neutral-500",
  REVOKED: "bg-[#faf0eb] text-[#b0453a]",
};

function InviteStatusBadge({ status }: { status: InviteStatus }) {
  return <Badge tone={INVITE_TONE[status]}>{status.charAt(0) + status.slice(1).toLowerCase()}</Badge>;
}

function initials(name: string, email: string) {
  const source = name.trim() || email;
  return source.slice(0, 1).toUpperCase() || "?";
}

function AmbassadorAvatar({ user, size = 36 }: { user: ApiAmbassador; size?: number }) {
  return (
    <div
      className="rounded-full bg-[#efebe5] text-[#584939] flex items-center justify-center font-lato font-bold shrink-0 border border-neutral-200/60"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials(user.fullName, user.email)}
    </div>
  );
}

function AmbassadorCell({ user }: { user: ApiAmbassador }) {
  return (
    <>
      <AmbassadorAvatar user={user} />
      <div className="min-w-0">
        <p className="font-lato text-[14px] font-bold text-neutral-900 truncate leading-tight">
          {user.fullName || "Unnamed ambassador"}
        </p>
        <p className="font-lato text-[12px] font-medium text-neutral-500 truncate leading-tight mt-0.5">{user.email}</p>
      </div>
    </>
  );
}

function PerformanceAmbassadorCell({ row }: { row: AmbassadorPerformance }) {
  return (
    <div className="min-w-0">
      <p className="font-lato text-[14px] font-bold text-neutral-900 truncate leading-tight">{row.fullName}</p>
      <p className="font-lato text-[12px] font-medium text-neutral-500 truncate leading-tight mt-0.5">
        {row.school ?? "No school"} / {row.market ?? "No market"}
      </p>
    </div>
  );
}

function movementLabel(row: Pick<AmbassadorPerformance, "rankMovement" | "rankMovementDirection">) {
  if (row.rankMovementDirection === "NEW") return "New";
  if (row.rankMovementDirection === "UP") return row.rankMovement > 0 ? `+${row.rankMovement}` : `+${Math.abs(row.rankMovement)}`;
  if (row.rankMovementDirection === "DOWN") return row.rankMovement < 0 ? `${row.rankMovement}` : `-${Math.abs(row.rankMovement)}`;
  return "0";
}

function AddAmbassadorForm({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const submit = async () => {
    const value = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Enter a valid email address");
      return;
    }
    setSaving(true);
    try {
      const res = await inviteAmbassador(value);
      if (res.inviteLink) {
        setInviteLink(res.inviteLink);
      } else {
        onClose();
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send invite");
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <SlideOver
      onClose={onClose}
      header={
        <div>
          <p className="font-canela text-[20px] font-medium text-neutral-900 leading-tight">Add Ambassador</p>
          <p className="font-lato text-[13px] font-medium text-neutral-500 mt-0.5">
            Send an invite-only onboarding link to a new ambassador.
          </p>
        </div>
      }
    >
      {inviteLink ? (
        <div className="flex flex-col gap-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-[12px] p-4 text-emerald-800 text-[13px] font-medium flex flex-col gap-1">
            <p className="font-bold text-[14px]">Ambassador Invited Successfully!</p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-lato text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Onboarding Link</span>
            <input
              readOnly
              value={inviteLink}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="w-full font-lato text-[13px] text-neutral-800 bg-neutral-50 border border-neutral-200/80 rounded-[8px] px-3.5 py-2.5 outline-none cursor-pointer"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 inline-flex items-center justify-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white font-lato text-[14px] font-semibold px-5 py-2.5 rounded-full transition-colors cursor-pointer"
            >
              {copied ? "Copied!" : "Copy onboarding link"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-lato text-[14px] font-semibold rounded-full transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="amb-email" className="font-lato text-[13px] font-bold text-neutral-700">
              Email address
            </label>
            <input
              id="amb-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="name@university.edu"
              className="w-full font-lato text-[14px] text-neutral-800 bg-white border border-neutral-200/80 rounded-[8px] px-3.5 py-2.5 focus:outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
            />
            {error && <p className="font-lato text-[12px] font-semibold text-[#b0453a]">{error}</p>}
            <p className="font-lato text-[12px] font-medium text-neutral-400">
              Only this email will be able to access ambassador onboarding.
            </p>
          </div>

          <button
            type="button"
            onClick={submit}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-lato text-[14px] font-semibold px-5 py-2.5 rounded-full transition-colors disabled:opacity-60 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4.5 h-4.5" />}
            Send invite
          </button>
        </div>
      )}
    </SlideOver>
  );
}

function AmbassadorDetail({ user, onClose }: { user: ApiAmbassador; onClose: () => void }) {
  const [detail, setDetail] = useState<ApiUserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getUser(user.id)
      .then((data) => active && setDetail(data))
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [user.id]);

  const view = detail ?? user;

  return (
    <SlideOver
      onClose={onClose}
      header={
        <div className="flex items-center gap-3.5 min-w-0">
          <AmbassadorAvatar user={view} size={52} />
          <div className="min-w-0">
            <p className="font-canela text-[20px] font-medium text-neutral-900 truncate leading-tight">
              {view.fullName || "Unnamed ambassador"}
            </p>
            <p className="font-lato text-[13px] font-medium text-neutral-500 truncate mt-0.5">{view.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <EntityStatusBadge status={view.status === "ACTIVE" ? "active" : "inactive"} />
            </div>
          </div>
        </div>
      }
    >
      <DetailSection title="Profile">
        <DetailRow label="School" value={view.school?.name ?? "—"} />
        <DetailRow label="Market" value={view.market?.name ?? "—"} />
        <DetailRow label="Referral code" value={<span className="font-mono">{view.referralCode}</span>} />
        <DetailRow label="Joined" value={formatDate(view.createdAt)} />
        <DetailRow label="Last login" value={formatDate(view.lastLoginAt)} />
      </DetailSection>

      <DetailSection title="Activity">
        {loading ? (
          <p className="font-lato text-[13px] font-medium text-neutral-400 py-2 flex items-center gap-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading…
          </p>
        ) : (
          <>
            <DetailRow label="Total points" value={detail?.totalPoints.toLocaleString() ?? "—"} />
            <DetailRow label="Total invites" value={detail?.totalInvites.toLocaleString() ?? "—"} />
          </>
        )}
      </DetailSection>
    </SlideOver>
  );
}

export default function AdminAmbassadorsPage() {
  const [tab, setTab] = useState<"roster" | "invites" | "performance">("roster");

  const [ambassadors, setAmbassadors] = useState<ApiAmbassador[]>([]);
  const [ambassadorTotal, setAmbassadorTotal] = useState(0);
  const [ambassadorPage, setAmbassadorPage] = useState(1);
  const [ambassadorLimit, setAmbassadorLimit] = useState(10);
  const [ambassadorLoading, setAmbassadorLoading] = useState(true);

  const [invites, setInvites] = useState<ApiAmbassadorInvite[]>([]);
  const [inviteTotal, setInviteTotal] = useState(0);
  const [invitePage, setInvitePage] = useState(1);
  const [inviteLimit, setInviteLimit] = useState(10);
  const [inviteStatus, setInviteStatus] = useState<"ALL" | InviteStatus>("ALL");
  const [inviteLoading, setInviteLoading] = useState(true);
  const [performance, setPerformance] = useState<AmbassadorPerformance[]>([]);
  const [performanceLoading, setPerformanceLoading] = useState(true);

  const [pendingCount, setPendingCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [adding, setAdding] = useState(false);
  const [selected, setSelected] = useState<ApiAmbassador | null>(null);
  const [removeTarget, setRemoveTarget] = useState<ApiAmbassador | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<ApiAmbassadorInvite | null>(null);

  const fetchAmbassadors = useCallback(async () => {
    setAmbassadorLoading(true);
    setError(null);
    try {
      const result = await listAmbassadors({ page: ambassadorPage, limit: ambassadorLimit });
      setAmbassadors(result.items);
      setAmbassadorTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load ambassadors");
      setAmbassadors([]);
      setAmbassadorTotal(0);
    } finally {
      setAmbassadorLoading(false);
    }
  }, [ambassadorPage, ambassadorLimit]);

  const fetchInvites = useCallback(async () => {
    setInviteLoading(true);
    setError(null);
    try {
      const result = await listAmbassadorInvites({
        page: invitePage,
        limit: inviteLimit,
        status: inviteStatus === "ALL" ? undefined : inviteStatus,
      });
      setInvites(result.items);
      setInviteTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load invites");
      setInvites([]);
      setInviteTotal(0);
    } finally {
      setInviteLoading(false);
    }
  }, [invitePage, inviteLimit, inviteStatus]);

  const fetchPerformance = useCallback(async () => {
    setPerformanceLoading(true);
    setError(null);
    try {
      setPerformance(await listAmbassadorPerformance());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load ambassador performance");
      setPerformance([]);
    } finally {
      setPerformanceLoading(false);
    }
  }, []);

  const loadPendingCount = useCallback(async () => {
    try {
      const result = await listAmbassadorInvites({ page: 1, limit: 1, status: "PENDING" });
      setPendingCount(result.total);
    } catch {
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAmbassadors();
  }, [fetchAmbassadors]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchInvites();
  }, [fetchInvites]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPendingCount();
  }, [loadPendingCount]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPerformance();
  }, [fetchPerformance]);

  const refreshInvites = useCallback(() => {
    fetchInvites();
    loadPendingCount();
  }, [fetchInvites, loadPendingCount]);

  const handleRevoke = async (id: string) => {
    try {
      await revokeAmbassadorInvite(id);
      setActionError(null);
      refreshInvites();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to revoke invite");
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await removeAmbassador(id);
      setActionError(null);
      fetchAmbassadors();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to remove ambassador");
    }
  };

  const ambassadorColumns: Column<ApiAmbassador>[] = [
    { key: "ambassador", header: "Ambassador", cell: (u) => <AmbassadorCell user={u} />, cellClassName: "flex items-center gap-3 min-w-0" },
    { key: "school", header: "School", cell: (u) => u.school?.name ?? "—", cellClassName: "font-lato text-[13px] font-medium text-neutral-700 truncate" },
    { key: "market", header: "Market", cell: (u) => u.market?.name ?? "—", cellClassName: "font-lato text-[13px] font-medium text-neutral-700 truncate" },
    { key: "status", header: "Status", cell: (u) => <EntityStatusBadge status={u.status === "ACTIVE" ? "active" : "inactive"} /> },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "justify-self-end",
      cellClassName: "justify-self-end",
      cell: (u) => (
        <div className="flex items-center gap-1 md:justify-self-end">
          <IconButton label="View" onClick={() => setSelected(u)}>
            <Eye className="w-4 h-4" strokeWidth={2} />
          </IconButton>
          <IconButton label="Remove ambassador" onClick={() => setRemoveTarget(u)} danger>
            <UserMinus className="w-4 h-4" strokeWidth={2} />
          </IconButton>
        </div>
      ),
    },
  ];

  const inviteColumns: Column<ApiAmbassadorInvite>[] = [
    { key: "email", header: "Email", cell: (i) => i.email, cellClassName: "font-lato text-[13px] font-semibold text-neutral-800 truncate" },
    { key: "status", header: "Status", cell: (i) => <InviteStatusBadge status={i.status} /> },
    { key: "invited", header: "Invited", cell: (i) => formatDate(i.createdAt), cellClassName: "font-lato text-[13px] font-medium text-neutral-600" },
    { key: "expires", header: "Expires", cell: (i) => formatDate(i.expiresAt), cellClassName: "font-lato text-[13px] font-medium text-neutral-600" },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "justify-self-end",
      cellClassName: "justify-self-end",
      cell: (i) =>
        i.status === "PENDING" || i.status === "EXPIRED" ? (
          <div className="md:justify-self-end">
            <IconButton label="Revoke" onClick={() => setRevokeTarget(i)} danger>
              <Ban className="w-4 h-4" strokeWidth={2} />
            </IconButton>
          </div>
        ) : (
          <span className="font-lato text-[12px] font-medium text-neutral-400 md:justify-self-end">No actions</span>
        ),
    },
  ];

  const performanceColumns: Column<AmbassadorPerformance>[] = [
    { key: "rank", header: "Rank", cell: (row) => `#${row.rank}`, cellClassName: "font-lato text-[14px] font-black text-[#054d5a]" },
    { key: "movement", header: "Move", cell: (row) => movementLabel(row), cellClassName: "font-lato text-[13px] font-bold text-neutral-700" },
    { key: "ambassador", header: "Ambassador", cell: (row) => <PerformanceAmbassadorCell row={row} /> },
    { key: "direct", header: "Direct", cell: (row) => row.directInvites.toLocaleString(), cellClassName: "font-lato text-[13px] font-semibold text-neutral-800" },
    { key: "network", header: "Network", cell: (row) => row.totalReferralNetwork.toLocaleString(), cellClassName: "font-lato text-[13px] font-semibold text-neutral-800" },
    { key: "signups", header: "Signups", cell: (row) => row.waitlistSignups.toLocaleString(), cellClassName: "font-lato text-[13px] font-semibold text-neutral-800" },
    { key: "accepted", header: "Accepted", cell: (row) => row.acceptedReferrals.toLocaleString(), cellClassName: "font-lato text-[13px] font-semibold text-neutral-800" },
    { key: "pending", header: "Pending", cell: (row) => row.pendingReferrals.toLocaleString(), cellClassName: "font-lato text-[13px] font-semibold text-neutral-800" },
    { key: "conversion", header: "Conversion", cell: (row) => row.conversionRateAvailable && row.conversionRate !== null ? `${row.conversionRate}%` : "N/A", cellClassName: "font-lato text-[13px] font-semibold text-neutral-500" },
    { key: "campus", header: "Campus", cell: (row) => row.campusRank ? `#${row.campusRank}` : "N/A", cellClassName: "font-lato text-[13px] font-semibold text-neutral-800" },
    { key: "market", header: "Market", cell: (row) => row.marketRank ? `#${row.marketRank}` : "N/A", cellClassName: "font-lato text-[13px] font-semibold text-neutral-800" },
    { key: "national", header: "National", cell: (row) => `#${row.nationalAmbassadorRank}`, cellClassName: "font-lato text-[13px] font-semibold text-neutral-800" },
  ];

  const selectClass =
    "w-full sm:w-auto font-lato text-[13px] font-medium text-neutral-700 bg-[#fbfbf9] border border-neutral-200/70 rounded-[8px] px-3 py-2.5 cursor-pointer focus:outline-none focus:border-neutral-400 transition-colors";

  return (
    <main className="flex-1 flex flex-col gap-6 md:gap-8 min-w-0">
      <title>Ambassador Management - Bea Admin</title>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <PageHeading
          title="Ambassador Management"
          subtitle="Invite ambassadors and manage onboarding."
        />
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex items-center justify-center gap-2 self-start bg-neutral-900 hover:bg-neutral-800 text-white font-lato text-[14px] font-semibold px-5 py-2.5 rounded-full transition-colors shrink-0"
        >
          <UserPlus className="w-4 h-4" strokeWidth={2} />
          Add ambassador
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Ambassadors" value={ambassadorTotal.toLocaleString()} icon={<UserPlus className="w-5 h-5" strokeWidth={2.2} />} />
        <StatCard label="Pending invites" value={pendingCount.toLocaleString()} icon={<Clock className="w-5 h-5" strokeWidth={2.2} />} />
        <StatCard label="Performance rows" value={performance.length.toLocaleString()} icon={<BarChart3 className="w-5 h-5" strokeWidth={2.2} />} />
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
            { value: "roster", label: "Ambassadors", count: ambassadorTotal },
            { value: "invites", label: "Invites", count: inviteTotal },
            { value: "performance", label: "Performance", count: performance.length },
          ]}
        />
        {tab === "invites" && (
          <select
            value={inviteStatus}
            onChange={(e) => {
              setInviteStatus(e.target.value as "ALL" | InviteStatus);
              setInvitePage(1);
            }}
            className={`${selectClass} sm:ml-auto`}
            aria-label="Filter by status"
          >
            <option value="ALL">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="EXPIRED">Expired</option>
            <option value="REVOKED">Revoked</option>
          </select>
        )}
      </div>

      {tab === "performance" ? (
        <DataTable
          rows={performance}
          columns={performanceColumns}
          gridCols={PERF_COLS}
          minWidth="1280px"
          getRowKey={(row) => row.userId}
          loading={performanceLoading}
          renderCard={(row) => (
            <div className="bg-white border border-neutral-200/60 rounded-[10px] p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <PerformanceAmbassadorCell row={row} />
                <Badge tone="bg-[#e7f0ea] text-[#3d7a6e]">#{row.rank}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 font-lato text-[12px] font-semibold text-neutral-700">
                <span>Move: {movementLabel(row)}</span>
                <span>Direct: {row.directInvites}</span>
                <span>Network: {row.totalReferralNetwork}</span>
                <span>Pending: {row.pendingReferrals}</span>
                <span>Campus: {row.campusRank ? `#${row.campusRank}` : "N/A"}</span>
                <span>Market: {row.marketRank ? `#${row.marketRank}` : "N/A"}</span>
              </div>
            </div>
          )}
          countLabel={(n) => `${n} performance ${n === 1 ? "row" : "rows"}`}
          emptyTitle="No ambassador performance"
          emptyText="Ambassador leaderboard metrics will appear after ambassadors join."
        />
      ) : tab === "roster" ? (
        <DataTable
          rows={ambassadors}
          columns={ambassadorColumns}
          gridCols={AMB_COLS}
          minWidth="780px"
          getRowKey={(u) => u.id}
          loading={ambassadorLoading}
          pagination={{
            page: ambassadorPage,
            pageSize: ambassadorLimit,
            total: ambassadorTotal,
            onPageChange: setAmbassadorPage,
            onPageSizeChange: (size) => {
              setAmbassadorLimit(size);
              setAmbassadorPage(1);
            },
          }}
          renderCard={(u) => (
            <div className="bg-white border border-neutral-200/60 rounded-[10px] p-4 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <AmbassadorAvatar user={u} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="font-lato text-[15px] font-bold text-neutral-900 truncate leading-tight">
                    {u.fullName || "Unnamed ambassador"}
                  </p>
                  <p className="font-lato text-[12px] font-medium text-neutral-500 truncate leading-tight mt-0.5">{u.email}</p>
                </div>
                <EntityStatusBadge status={u.status === "ACTIVE" ? "active" : "inactive"} />
              </div>
              <div className="flex items-center justify-between gap-4 font-lato text-[12px] font-medium text-neutral-500">
                <span>{u.school?.name ?? "—"}</span>
                <span>{u.market?.name ?? "—"}</span>
              </div>
              <div className="flex items-center gap-1">
                <IconButton label="View" onClick={() => setSelected(u)}>
                  <Eye className="w-4 h-4" strokeWidth={2} />
                </IconButton>
                <IconButton label="Remove ambassador" onClick={() => setRemoveTarget(u)} danger>
                  <UserMinus className="w-4 h-4" strokeWidth={2} />
                </IconButton>
              </div>
            </div>
          )}
          countLabel={(n) => `${n} ${n === 1 ? "ambassador" : "ambassadors"}`}
          emptyTitle="No ambassadors"
          emptyText="No onboarded ambassadors yet."
        />
      ) : (
        <DataTable
          rows={invites}
          columns={inviteColumns}
          gridCols={INV_COLS}
          minWidth="720px"
          getRowKey={(i) => i.id}
          loading={inviteLoading}
          pagination={{
            page: invitePage,
            pageSize: inviteLimit,
            total: inviteTotal,
            onPageChange: setInvitePage,
            onPageSizeChange: (size) => {
              setInviteLimit(size);
              setInvitePage(1);
            },
          }}
          renderCard={(i) => (
            <div className="bg-white border border-neutral-200/60 rounded-[10px] p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <span className="font-lato text-[14px] font-semibold text-neutral-800 break-all">{i.email}</span>
                <InviteStatusBadge status={i.status} />
              </div>
              <div className="flex items-center gap-4 font-lato text-[12px] font-medium text-neutral-500">
                <span>Invited {formatDate(i.createdAt)}</span>
                <span>Expires {formatDate(i.expiresAt)}</span>
              </div>
              {(i.status === "PENDING" || i.status === "EXPIRED") && (
                <IconButton label="Revoke" onClick={() => setRevokeTarget(i)} danger>
                  <Ban className="w-4 h-4" strokeWidth={2} />
                </IconButton>
              )}
            </div>
          )}
          countLabel={(n) => `${n} ${n === 1 ? "invite" : "invites"}`}
          emptyTitle="No invites"
          emptyText="No ambassador invites match this filter."
        />
      )}

      {adding && <AddAmbassadorForm onClose={() => setAdding(false)} onSuccess={refreshInvites} />}
      {selected && <AmbassadorDetail user={selected} onClose={() => setSelected(null)} />}
      {removeTarget && (
        <ConfirmDialog
          title="Remove ambassador?"
          message={
            <>
              <span className="font-semibold text-neutral-700">{removeTarget.fullName || removeTarget.email}</span> will revert to a normal
              user. Their account is not deleted.
            </>
          }
          confirmLabel="Remove"
          danger
          onConfirm={() => handleRemove(removeTarget.id)}
          onClose={() => setRemoveTarget(null)}
        />
      )}
      {revokeTarget && (
        <ConfirmDialog
          title="Revoke invite?"
          message={
            <>
              The invite to <span className="font-semibold text-neutral-700">{revokeTarget.email}</span> will be revoked and can no longer be
              accepted.
            </>
          }
          confirmLabel="Revoke"
          danger
          onConfirm={() => handleRevoke(revokeTarget.id)}
          onClose={() => setRevokeTarget(null)}
        />
      )}
    </main>
  );
}
