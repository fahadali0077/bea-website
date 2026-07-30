import { asArray, call, num, str, type RawRecord } from "./http";

export type MarketStatus = "ACTIVE" | "INACTIVE";

export type ApiMarket = {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  unlockTarget: number;
  participantCount: number;
  status: MarketStatus;
  createdAt?: string;
};

export type MarketInput = {
  name: string;
  city: string;
  state: string;
  country: string;
  unlockTarget: number;
};

export type MarketFilters = {
  page: number;
  limit: number;
  search?: string;
  status?: MarketStatus;
  state?: string;
  country?: string;
};

export type MarketListResult = {
  items: ApiMarket[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

function normalizeMarket(raw: RawRecord): ApiMarket {
  const status = str(raw.status, "ACTIVE").toUpperCase() === "INACTIVE" ? "INACTIVE" : "ACTIVE";
  return {
    id: str(raw.id ?? raw._id),
    name: str(raw.name),
    city: str(raw.city),
    state: str(raw.state),
    country: str(raw.country),
    unlockTarget: num(raw.unlockTarget ?? raw.unlock_target),
    participantCount: num(raw.participantCount ?? raw.participant_count),
    status,
    createdAt: (raw.createdAt ?? raw.created_at) as string | undefined,
  };
}

function buildQuery(filters: MarketFilters): string {
  const params = new URLSearchParams();
  params.set("page", String(filters.page));
  params.set("limit", String(filters.limit));
  if (filters.search?.trim()) params.set("search", filters.search.trim());
  if (filters.status) params.set("status", filters.status);
  if (filters.state?.trim()) params.set("state", filters.state.trim());
  if (filters.country?.trim()) params.set("country", filters.country.trim());
  return params.toString();
}

export async function listMarkets(filters: MarketFilters): Promise<MarketListResult> {
  const payload = await call<RawRecord>(`/api/admin/markets?${buildQuery(filters)}`);
  const root = (payload.data as RawRecord) ?? payload;

  const items =
    asArray(root.markets) ??
    asArray(payload.markets) ??
    asArray(root) ??
    asArray(root.items) ??
    asArray(root.data) ??
    asArray(root.results) ??
    asArray(payload.items) ??
    [];

  const meta = (payload.pagination ?? root.pagination ?? payload.meta ?? root.meta ?? {}) as RawRecord;
  const total = num(meta.total ?? meta.totalItems ?? meta.count, items.length);
  const limit = num(meta.limit ?? meta.perPage, filters.limit) || filters.limit;
  const page = num(meta.page ?? meta.currentPage, filters.page) || filters.page;
  const totalPages = num(meta.totalPages ?? meta.pageCount, Math.max(1, Math.ceil(total / limit)));

  return { items: items.map(normalizeMarket), page, limit, total, totalPages };
}

export async function getMarket(id: string): Promise<ApiMarket> {
  const payload = await call<RawRecord>(`/api/admin/markets/${id}`);
  const raw = (payload.market ?? payload.data ?? payload) as RawRecord;
  return normalizeMarket(raw);
}

export async function createMarket(input: MarketInput): Promise<void> {
  await call(`/api/admin/markets`, { method: "POST", body: JSON.stringify(input) });
}

export async function updateMarket(id: string, input: MarketInput): Promise<void> {
  await call(`/api/admin/markets/${id}`, { method: "PUT", body: JSON.stringify(input) });
}

export async function toggleMarketStatus(market: ApiMarket): Promise<void> {
  const nextStatus: MarketStatus = market.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
  const body = {
    name: market.name,
    city: market.city,
    state: market.state,
    country: market.country,
    unlockTarget: market.unlockTarget,
    status: nextStatus,
  };
  await call(`/api/admin/markets/${market.id}`, { method: "PUT", body: JSON.stringify(body) });
}

export async function deleteMarket(id: string): Promise<void> {
  await call(`/api/admin/markets/${id}`, { method: "DELETE" });
}
