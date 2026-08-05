import type { CompetitionStatus } from "@/lib/competition-lifecycle";
import { asArray, call, num, str, type RawRecord } from "./http";

export type { CompetitionStatus };

export type ApiCompetition = {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  gracePeriodEndDate: string | null;
  status: CompetitionStatus;
  isExtended: boolean;
  createdByAdminId: string | null;
  createdAt?: string;
  updatedAt?: string;
  pointsEntryCount: number;
};

export type CompetitionInput = {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  gracePeriodEndDate?: string;
  status?: CompetitionStatus;
};

export type CompetitionUpdateInput = {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  gracePeriodEndDate?: string;
  status?: CompetitionStatus;
  isExtended?: boolean;
};

export type ExtendCompetitionInput = {
  newEndDate: string;
  gracePeriodEndDate?: string;
};

export type CompetitionFilters = {
  page: number;
  limit: number;
  status?: CompetitionStatus;
};

export type CompetitionListResult = {
  items: ApiCompetition[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const STATUSES: CompetitionStatus[] = [
  "UPCOMING",
  "ACTIVE",
  "GRACE_PERIOD",
  "ENDED",
  "ARCHIVED",
];

function normalizeStatus(value: unknown): CompetitionStatus {
  const upper = str(value, "UPCOMING").toUpperCase();
  return (STATUSES.includes(upper as CompetitionStatus) ? upper : "UPCOMING") as CompetitionStatus;
}

function normalizeCompetition(raw: RawRecord): ApiCompetition {
  const count = (raw._count ?? {}) as RawRecord;
  return {
    id: str(raw.id),
    title: str(raw.title),
    description: (raw.description as string | null) ?? null,
    startDate: str(raw.startDate),
    endDate: str(raw.endDate),
    gracePeriodEndDate: (raw.gracePeriodEndDate as string | null) ?? null,
    status: normalizeStatus(raw.status),
    isExtended: Boolean(raw.isExtended),
    createdByAdminId: (raw.createdByAdminId as string | null) ?? null,
    createdAt: raw.createdAt as string | undefined,
    updatedAt: raw.updatedAt as string | undefined,
    pointsEntryCount: num(count.pointsEntries, num(raw.pointsEntryCount, 0)),
  };
}

function buildQuery(filters: CompetitionFilters): string {
  const params = new URLSearchParams();
  params.set("page", String(filters.page));
  params.set("limit", String(filters.limit));
  if (filters.status) params.set("status", filters.status);
  return params.toString();
}

export async function listCompetitions(filters: CompetitionFilters): Promise<CompetitionListResult> {
  const payload = await call<RawRecord>(`/api/admin/competitions?${buildQuery(filters)}`);
  const root = (payload.data as RawRecord) ?? payload;

  const items = asArray(root.items) ?? asArray(root.competitions) ?? asArray(root) ?? [];
  const meta = (root.pagination ?? root) as RawRecord;

  const total = num(meta.total, items.length);
  const limit = num(meta.limit, filters.limit) || filters.limit;
  const page = num(meta.page, filters.page) || filters.page;
  const totalPages = num(meta.totalPages, Math.max(1, Math.ceil(total / limit)));

  return { items: items.map(normalizeCompetition), page, limit, total, totalPages };
}

export async function listAllCompetitions(status?: CompetitionStatus): Promise<ApiCompetition[]> {
  const params = status ? `?status=${status}` : "";
  const payload = await call<RawRecord>(`/api/admin/competitions/all${params}`);
  const root = (payload.data ?? payload) as RawRecord | RawRecord[];
  const items = asArray(root) ?? asArray((root as RawRecord).items) ?? asArray((root as RawRecord).competitions) ?? [];
  return items.map(normalizeCompetition);
}

export async function getCompetition(id: string): Promise<ApiCompetition> {
  const payload = await call<RawRecord>(`/api/admin/competitions/${id}`);
  const raw = (payload.data ?? payload) as RawRecord;
  return normalizeCompetition(raw);
}

export async function createCompetition(input: CompetitionInput): Promise<void> {
  await call(`/api/admin/competitions`, { method: "POST", body: JSON.stringify(input) });
}

export async function updateCompetition(id: string, input: CompetitionUpdateInput): Promise<void> {
  await call(`/api/admin/competitions/${id}`, { method: "PUT", body: JSON.stringify(input) });
}

export async function archiveCompetition(id: string): Promise<void> {
  await call(`/api/admin/competitions/${id}`, { method: "DELETE" });
}

export async function extendCompetition(id: string, input: ExtendCompetitionInput): Promise<void> {
  await call(`/api/admin/competitions/${id}/extend`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}
