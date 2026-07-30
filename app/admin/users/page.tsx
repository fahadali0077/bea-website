"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Users, ShieldCheck, UserPlus, User as UserIcon, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import {
  listUsers,
  getUser,
  updateUserStatus,
  type ApiUser,
  type ApiUserDetail,
  type UserRole,
  type UserStatus,
} from "@/lib/admin/users-api";
import { EntityStatusBadge, Badge } from "@/app/components/admin/Badge";
import { PageHeading } from "@/app/components/admin/PageHeading";
import { StatCard } from "@/app/components/admin/StatCard";
import { SlideOver } from "@/app/components/admin/SlideOver";
import { DetailRow, DetailSection } from "@/app/components/admin/DetailList";
import { DataTable, type Column } from "@/app/components/admin/DataTable";

const GRID_COLS = "grid-cols-[minmax(200px,1.6fr)_120px_minmax(140px,1fr)_minmax(140px,1fr)_110px]";

const ROLE_LABELS: Record<UserRole, string> = {
  NORMAL_USER: "Normal User",
  AMBASSADOR: "Ambassador",
  ADMIN: "Admin",
};

const ROLE_TONE: Record<UserRole, string> = {
  NORMAL_USER: "bg-neutral-100 text-neutral-600",
  AMBASSADOR: "bg-[#f3ece2] text-[#8a6a3f]",
  ADMIN: "bg-neutral-800 text-white",
};

const inputClass =
  "w-full font-lato text-[14px] text-neutral-800 bg-white border border-neutral-200/80 rounded-[8px] px-3.5 py-2.5 focus:outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400 cursor-pointer";

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

function formatDate(iso?: string | null) {
  return iso ? dateFmt.format(new Date(iso)) : "—";
}

function RoleBadge({ role }: { role: UserRole }) {
  return <Badge tone={ROLE_TONE[role]}>{ROLE_LABELS[role]}</Badge>;
}

function UserStatusBadge({ status }: { status: UserStatus }) {
  return <EntityStatusBadge status={status === "ACTIVE" ? "active" : "inactive"} />;
}

function initials(name: string, email: string) {
  const source = name.trim() || email;
  return source.slice(0, 1).toUpperCase() || "?";
}

function UserAvatar({ user, size = 36 }: { user: ApiUser; size?: number }) {
  return (
    <div
      className="rounded-full bg-[#efebe5] text-[#584939] flex items-center justify-center font-lato font-bold shrink-0 border border-neutral-200/60"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials(user.fullName, user.email)}
    </div>
  );
}

function UserCell({ user }: { user: ApiUser }) {
  return (
    <>
      <UserAvatar user={user} />
      <div className="min-w-0">
        <p className="font-lato text-[14px] font-bold text-neutral-900 truncate leading-tight">
          {user.fullName || "Unnamed user"}
        </p>
        <p className="font-lato text-[12px] font-medium text-neutral-500 truncate leading-tight mt-0.5">{user.email}</p>
      </div>
    </>
  );
}

function UserCard({ user, onSelect }: { user: ApiUser; onSelect: (u: ApiUser) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(user)}
      className="w-full text-left bg-white border border-neutral-200/60 rounded-[10px] p-4 flex flex-col gap-3 hover:border-neutral-300 transition-colors cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <UserAvatar user={user} size={40} />
        <div className="min-w-0 flex-1">
          <p className="font-lato text-[15px] font-bold text-neutral-900 truncate leading-tight">
            {user.fullName || "Unnamed user"}
          </p>
          <p className="font-lato text-[12px] font-medium text-neutral-500 truncate leading-tight mt-0.5">{user.email}</p>
        </div>
        <RoleBadge role={user.role} />
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-1">
        <div className="min-w-0">
          <p className="font-lato text-[11px] font-medium text-neutral-400 leading-none">School</p>
          <p className="font-lato text-[13px] font-semibold text-neutral-800 truncate mt-1">{user.school?.name ?? "—"}</p>
        </div>
        <div className="min-w-0">
          <p className="font-lato text-[11px] font-medium text-neutral-400 leading-none">Market</p>
          <p className="font-lato text-[13px] font-semibold text-neutral-800 truncate mt-1">{user.market?.name ?? "—"}</p>
        </div>
      </div>
      <div className="pt-1">
        <UserStatusBadge status={user.status} />
      </div>
    </button>
  );
}

function UserDetail({
  user,
  onClose,
  onUpdated,
}: {
  user: ApiUser;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [detail, setDetail] = useState<ApiUserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole>(user.role);
  const [status, setStatus] = useState<UserStatus>(user.status);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;
    getUser(user.id)
      .then((data) => {
        if (!active) return;
        setDetail(data);
        setRole(data.role);
        setStatus(data.status);
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [user.id]);

  const dirty = detail ? role !== detail.role || status !== detail.status : false;

  const save = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      await updateUserStatus(user.id, { role, status });
      setDetail((current) => (current ? { ...current, role, status } : current));
      setSaved(true);
      onUpdated();
      window.setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const view = detail ?? user;

  return (
    <SlideOver
      onClose={onClose}
      header={
        <div className="flex items-center gap-3.5 min-w-0">
          <UserAvatar user={view} size={52} />
          <div className="min-w-0">
            <p className="font-canela text-[20px] font-medium text-neutral-900 truncate leading-tight">
              {view.fullName || "Unnamed user"}
            </p>
            <p className="font-lato text-[13px] font-medium text-neutral-500 truncate mt-0.5">{view.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <RoleBadge role={view.role} />
              <UserStatusBadge status={view.status} />
            </div>
          </div>
        </div>
      }
    >
      <DetailSection title="Profile">
        <DetailRow label="User ID" value={<span className="font-mono text-[12px]">{view.id}</span>} />
        <DetailRow label="School" value={view.school?.name ?? "—"} />
        <DetailRow label="Market" value={view.market?.name ?? "—"} />
        <DetailRow label="Age" value={view.age ?? "—"} />
        <DetailRow label="Joined" value={formatDate(view.createdAt)} />
        <DetailRow label="Last login" value={formatDate(view.lastLoginAt)} />
        <DetailRow label="Email verified" value={view.emailVerifiedAt ? formatDate(view.emailVerifiedAt) : "Not verified"} />
      </DetailSection>

      <DetailSection title="Waitlist & Referrals">
        <DetailRow
          label="Waitlist position"
          value={view.waitlistPosition != null ? `#${view.waitlistPosition.toLocaleString()}` : "—"}
        />
        <DetailRow label="Referral code" value={<span className="font-mono">{view.referralCode}</span>} />
        <DetailRow label="Referral depth" value={view.referralDepth} />
        <DetailRow label="Root ambassador" value={view.rootAmbassadorId ?? "Organic (direct)"} />
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

      <DetailSection title="Update role & status">
        <div className="flex flex-col gap-3 pt-1">
          <div className="grid grid-cols-2 gap-3">
            <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className={inputClass} aria-label="Role">
              <option value="NORMAL_USER">Normal User</option>
              <option value="AMBASSADOR">Ambassador</option>
              <option value="ADMIN">Admin</option>
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value as UserStatus)} className={inputClass} aria-label="Status">
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {saveError && <p className="font-lato text-[12px] font-semibold text-[#b0453a]">{saveError}</p>}

          <button
            type="button"
            onClick={save}
            disabled={!dirty || saving}
            className="inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-lato text-[14px] font-semibold px-5 py-2.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" strokeWidth={2} />}
            {saved ? "Saved" : "Save changes"}
          </button>
        </div>
      </DetailSection>
    </SlideOver>
  );
}

export default function AdminUsersPage() {
  const [items, setItems] = useState<ApiUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [role, setRole] = useState<"ALL" | UserRole>("ALL");
  const [status, setStatus] = useState<"ALL" | UserStatus>("ALL");

  const [counts, setCounts] = useState({ total: 0, admins: 0, ambassadors: 0, normal: 0 });
  const [selected, setSelected] = useState<ApiUser | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listUsers({
        page,
        limit,
        search: debouncedSearch,
        role: role === "ALL" ? undefined : role,
        status: status === "ALL" ? undefined : status,
      });
      setItems(result.items);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, role, status]);

  const loadCounts = useCallback(async () => {
    try {
      const [all, admins, ambassadors, normal] = await Promise.all([
        listUsers({ page: 1, limit: 1 }),
        listUsers({ page: 1, limit: 1, role: "ADMIN" }),
        listUsers({ page: 1, limit: 1, role: "AMBASSADOR" }),
        listUsers({ page: 1, limit: 1, role: "NORMAL_USER" }),
      ]);
      setCounts({ total: all.total, admins: admins.total, ambassadors: ambassadors.total, normal: normal.total });
    } catch {
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    loadCounts();
  }, [loadCounts]);

  const refresh = useCallback(() => {
    fetchUsers();
    loadCounts();
  }, [fetchUsers, loadCounts]);

  const columns: Column<ApiUser>[] = useMemo(
    () => [
      { key: "user", header: "User", cell: (u) => <UserCell user={u} />, cellClassName: "flex items-center gap-3 min-w-0" },
      { key: "role", header: "Role", cell: (u) => <RoleBadge role={u.role} /> },
      {
        key: "school",
        header: "School",
        cell: (u) => u.school?.name ?? "—",
        cellClassName: "font-lato text-[13px] font-medium text-neutral-700 truncate",
      },
      {
        key: "market",
        header: "Market",
        cell: (u) => u.market?.name ?? "—",
        cellClassName: "font-lato text-[13px] font-medium text-neutral-700 truncate",
      },
      { key: "status", header: "Status", cell: (u) => <UserStatusBadge status={u.status} /> },
    ],
    [],
  );

  const selectClass =
    "w-full sm:w-auto font-lato text-[13px] font-medium text-neutral-700 bg-[#fbfbf9] border border-neutral-200/70 rounded-[8px] px-3 py-2.5 cursor-pointer focus:outline-none focus:border-neutral-400 transition-colors";

  return (
    <main className="flex-1 flex flex-col gap-6 md:gap-8 min-w-0">
      <title>User Management - Bea Admin</title>

      <PageHeading
        title="User Management"
        subtitle="View, search, and manage every user on the platform."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={counts.total.toLocaleString()} icon={<Users className="w-5 h-5" strokeWidth={2.2} />} />
        <StatCard label="Admins" value={counts.admins.toLocaleString()} icon={<ShieldCheck className="w-5 h-5" strokeWidth={2.2} />} />
        <StatCard label="Ambassadors" value={counts.ambassadors.toLocaleString()} icon={<UserPlus className="w-5 h-5" strokeWidth={2.2} />} />
        <StatCard label="Normal Users" value={counts.normal.toLocaleString()} icon={<UserIcon className="w-5 h-5" strokeWidth={2.2} />} />
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-[#faf0eb] border border-[#e8c9c1] rounded-[10px] px-4 py-3">
          <AlertCircle className="w-4 h-4 text-[#b0453a] shrink-0" strokeWidth={2} />
          <p className="font-lato text-[13px] font-semibold text-[#b0453a]">{error}</p>
        </div>
      )}

      <section className="bg-[#fbfbf9] border border-neutral-200/50 rounded-[12px] p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.015)] flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" strokeWidth={2} />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full font-lato text-[14px] text-neutral-800 bg-white border border-neutral-200/70 rounded-[8px] pl-10 pr-3 py-2.5 focus:outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value as "ALL" | UserRole);
              setPage(1);
            }}
            className={selectClass}
            aria-label="Filter by role"
          >
            <option value="ALL">All roles</option>
            <option value="NORMAL_USER">Normal Users</option>
            <option value="AMBASSADOR">Ambassadors</option>
            <option value="ADMIN">Admins</option>
          </select>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as "ALL" | UserStatus);
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
        minWidth="820px"
        getRowKey={(u) => u.id}
        onRowClick={setSelected}
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
        renderCard={(u) => <UserCard user={u} onSelect={setSelected} />}
        countLabel={(n) => `${n} ${n === 1 ? "user" : "users"}`}
        emptyTitle="No users found"
        emptyText="Try adjusting your search or filters."
      />

      {selected && (
        <UserDetail
          user={selected}
          onClose={() => setSelected(null)}
          onUpdated={refresh}
        />
      )}
    </main>
  );
}
