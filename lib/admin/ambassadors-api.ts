import { asArray, call, num, str, type RawRecord } from "./http";
import { normalizeUser, type ApiUser } from "./users-api";

export type InviteStatus = "PENDING" | "ACCEPTED" | "EXPIRED" | "REVOKED";

export type ApiAmbassadorInvite = {
  id: string;
  email: string;
  status: InviteStatus;
  invitedByAdminId: string | null;
  expiresAt: string | null;
  acceptedAt: string | null;
  createdAt?: string;
};

export type InviteFilters = {
  page: number;
  limit: number;
  status?: InviteStatus;
};

export type InviteListResult = {
  items: ApiAmbassadorInvite[];
  page: number;
  limit: number;
  total: number;
};

export type ApiAmbassador = ApiUser;

export type AmbassadorFilters = {
  page: number;
  limit: number;
};

export type AmbassadorListResult = {
  items: ApiAmbassador[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type AmbassadorPerformance = {
  rank: number;
  previousRank: number | null;
  rankMovement: number;
  rankMovementDirection: "UP" | "DOWN" | "SAME" | "NEW";
  rankMovementLabel: string;
  userId: string;
  fullName: string;
  school: string | null;
  market: string | null;
  directInvites: number;
  totalReferralNetwork: number;
  waitlistSignups: number;
  acceptedReferrals: number;
  pendingReferrals: number;
  conversionRate: number | null;
  conversionRateAvailable: boolean;
  campusRank: number | null;
  marketRank: number | null;
  nationalAmbassadorRank: number;
  appDownloads: number;
  appDownloadsEnabled: boolean;
};

const INVITE_STATUSES: InviteStatus[] = ["PENDING", "ACCEPTED", "EXPIRED", "REVOKED"];

function normalizeInvite(raw: RawRecord): ApiAmbassadorInvite {
  const status = str(raw.status, "PENDING").toUpperCase();
  return {
    id: str(raw.id),
    email: str(raw.email),
    status: (INVITE_STATUSES.includes(status as InviteStatus) ? status : "PENDING") as InviteStatus,
    invitedByAdminId: (raw.invitedByAdminId ?? null) as string | null,
    expiresAt: (raw.expiresAt ?? null) as string | null,
    acceptedAt: (raw.acceptedAt ?? null) as string | null,
    createdAt: raw.createdAt as string | undefined,
  };
}

function buildInviteQuery(filters: InviteFilters): string {
  const params = new URLSearchParams();
  params.set("page", String(filters.page));
  params.set("limit", String(filters.limit));
  if (filters.status) params.set("status", filters.status);
  return params.toString();
}

export async function listAmbassadorInvites(filters: InviteFilters): Promise<InviteListResult> {
  const payload = await call<RawRecord>(`/api/admin/ambassadors/invites?${buildInviteQuery(filters)}`);
  const root = (payload.data as RawRecord) ?? payload;

  const items = asArray(root.invites) ?? asArray(root) ?? [];
  const total = num(root.total, items.length);
  const limit = num(root.limit, filters.limit) || filters.limit;
  const page = num(root.page, filters.page) || filters.page;

  return { items: items.map(normalizeInvite), page, limit, total };
}

export async function inviteAmbassador(email: string): Promise<{ inviteLink?: string }> {
  const payload = await call<RawRecord>(`/api/admin/ambassadors/invite`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  const data = (payload.data ?? payload) as RawRecord;
  return {
    inviteLink: data.inviteLink ? str(data.inviteLink) : undefined,
  };
}

export async function revokeAmbassadorInvite(id: string): Promise<void> {
  await call(`/api/admin/ambassadors/invites/${id}`, { method: "DELETE" });
}

export async function listAmbassadors(filters: AmbassadorFilters): Promise<AmbassadorListResult> {
  const params = new URLSearchParams();
  params.set("page", String(filters.page));
  params.set("limit", String(filters.limit));

  const payload = await call<RawRecord>(`/api/admin/ambassadors?${params.toString()}`);
  const root = (payload.data as RawRecord) ?? payload;

  const items = asArray(root.data) ?? asArray(root.ambassadors) ?? [];
  const total = num(root.total, items.length);
  const limit = num(root.limit, filters.limit) || filters.limit;
  const page = num(root.page, filters.page) || filters.page;
  const totalPages = num(root.totalPages, Math.max(1, Math.ceil(total / limit)));

  return { items: items.map(normalizeUser), page, limit, total, totalPages };
}

function normalizePerformance(raw: RawRecord): AmbassadorPerformance {
  const direction = str(raw.rankMovementDirection, "NEW").toUpperCase();
  return {
    rank: num(raw.rank),
    previousRank: raw.previousRank === null || raw.previousRank === undefined ? null : num(raw.previousRank),
    rankMovement: num(raw.rankMovement),
    rankMovementDirection: (["UP", "DOWN", "SAME", "NEW"].includes(direction) ? direction : "NEW") as AmbassadorPerformance["rankMovementDirection"],
    rankMovementLabel: str(raw.rankMovementLabel, "New"),
    userId: str(raw.userId),
    fullName: str(raw.fullName, "Anonymous"),
    school: raw.school ? str(raw.school) : null,
    market: raw.market ? str(raw.market) : null,
    directInvites: num(raw.directInvites),
    totalReferralNetwork: num(raw.totalReferralNetwork),
    waitlistSignups: num(raw.waitlistSignups),
    acceptedReferrals: num(raw.acceptedReferrals),
    pendingReferrals: num(raw.pendingReferrals),
    conversionRate: raw.conversionRate === null || raw.conversionRate === undefined ? null : num(raw.conversionRate),
    conversionRateAvailable: Boolean(raw.conversionRateAvailable),
    campusRank: raw.campusRank === null || raw.campusRank === undefined ? null : num(raw.campusRank),
    marketRank: raw.marketRank === null || raw.marketRank === undefined ? null : num(raw.marketRank),
    nationalAmbassadorRank: num(raw.nationalAmbassadorRank, num(raw.rank)),
    appDownloads: num(raw.appDownloads),
    appDownloadsEnabled: Boolean(raw.appDownloadsEnabled),
  };
}

export async function listAmbassadorPerformance(): Promise<AmbassadorPerformance[]> {
  const payload = await call<RawRecord>("/api/admin/leaderboards");
  const root = (payload.data as RawRecord) ?? payload;
  const ambassador = (root.ambassador as RawRecord[] | undefined) ?? [];
  return ambassador.map((item) => normalizePerformance(item as RawRecord));
}

export async function removeAmbassador(id: string): Promise<void> {
  await call(`/api/admin/ambassadors/${id}`, { method: "DELETE" });
}
