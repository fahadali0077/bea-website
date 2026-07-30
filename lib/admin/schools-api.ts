import { asArray, call, num, str, type RawRecord } from "./http";

export type SchoolStatus = "ACTIVE" | "INACTIVE";

export type ApiSchoolMarketRef = {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  unlockTarget: number;
  participantCount: number;
  status: SchoolStatus;
  createdAt?: string;
} | null;

export type ApiSchool = {
  id: string;
  name: string;
  city: string;
  state: string;
  marketId: string;
  imageUrl: string | null;
  status: SchoolStatus;
  createdAt?: string;
  market: ApiSchoolMarketRef;
  userCount: number;
};

export type SchoolInput = {
  name: string;
  city: string;
  state: string;
  marketId: string;
  status: SchoolStatus;
  imageUrl?: string | null;
};

export type SchoolFilters = {
  page: number;
  limit: number;
  search?: string;
  marketId?: string;
  status?: SchoolStatus;
};

export type SchoolListResult = {
  items: ApiSchool[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

function normalizeMarketRef(raw: unknown): ApiSchoolMarketRef {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as RawRecord;
  return {
    id: str(record.id),
    name: str(record.name),
    city: str(record.city),
    state: str(record.state),
    country: str(record.country),
    unlockTarget: num(record.unlockTarget),
    participantCount: num(record.participantCount),
    status: str(record.status, "ACTIVE").toUpperCase() === "INACTIVE" ? "INACTIVE" : "ACTIVE",
    createdAt: record.createdAt as string | undefined,
  };
}

function normalizeSchool(raw: RawRecord): ApiSchool {
  const count = (raw._count ?? {}) as RawRecord;
  return {
    id: str(raw.id),
    name: str(raw.name),
    city: str(raw.city),
    state: str(raw.state),
    marketId: str(raw.marketId),
    imageUrl: (raw.imageUrl ?? null) as string | null,
    status: str(raw.status, "ACTIVE").toUpperCase() === "INACTIVE" ? "INACTIVE" : "ACTIVE",
    createdAt: raw.createdAt as string | undefined,
    market: normalizeMarketRef(raw.market),
    userCount: num(count.users, num(raw.participantCount, 0)),
  };
}

function buildQuery(filters: SchoolFilters): string {
  const params = new URLSearchParams();
  params.set("page", String(filters.page));
  params.set("limit", String(filters.limit));
  if (filters.search?.trim()) params.set("search", filters.search.trim());
  if (filters.marketId) params.set("marketId", filters.marketId);
  if (filters.status) params.set("status", filters.status);
  return params.toString();
}

export async function listSchools(filters: SchoolFilters): Promise<SchoolListResult> {
  const payload = await call<RawRecord>(`/api/admin/schools?${buildQuery(filters)}`);
  const root = (payload.data as RawRecord) ?? payload;

  const items = asArray(root.items) ?? asArray(root.schools) ?? asArray(root) ?? [];
  const meta = (root.pagination ?? root) as RawRecord;

  const total = num(meta.total, items.length);
  const limit = num(meta.limit, filters.limit) || filters.limit;
  const page = num(meta.page, filters.page) || filters.page;
  const totalPages = num(meta.totalPages, Math.max(1, Math.ceil(total / limit)));

  return { items: items.map(normalizeSchool), page, limit, total, totalPages };
}

export async function getSchool(id: string): Promise<ApiSchool> {
  const payload = await call<RawRecord>(`/api/admin/schools/${id}`);
  const raw = (payload.data ?? payload) as RawRecord;
  return normalizeSchool(raw);
}

export async function createSchool(input: SchoolInput): Promise<void> {
  const body = {
    ...input,
    image_url: input.imageUrl,
  };
  await call(`/api/admin/schools`, { method: "POST", body: JSON.stringify(body) });
}

export async function updateSchool(id: string, input: SchoolInput): Promise<void> {
  const body = {
    ...input,
    image_url: input.imageUrl,
  };
  await call(`/api/admin/schools/${id}`, { method: "PUT", body: JSON.stringify(body) });
}

export async function deleteSchool(id: string): Promise<void> {
  await call(`/api/admin/schools/${id}`, { method: "DELETE" });
}
