import { asArray, call, num, str, type RawRecord } from "./http";

export type UserRole = "NORMAL_USER" | "AMBASSADOR" | "ADMIN";
export type UserStatus = "ACTIVE" | "INACTIVE";

export type ApiUserRef = { id: string; name: string } | null;

export type ApiUser = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  age: number | null;
  schoolId: string | null;
  marketId: string | null;
  school: ApiUserRef;
  market: ApiUserRef;
  referralCode: string;
  referredByUserId: string | null;
  rootAmbassadorId: string | null;
  referralDepth: number;
  waitlistPosition: number | null;
  onboardingCompletedAt: string | null;
  emailVerifiedAt: string | null;
  lastLoginAt: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiUserDetail = ApiUser & {
  totalPoints: number;
  totalInvites: number;
};

export type UserFilters = {
  page: number;
  limit: number;
  search?: string;
  role?: UserRole;
  status?: UserStatus;
};

export type UserListResult = {
  items: ApiUser[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type UpdateUserStatusInput = {
  status?: UserStatus;
  role?: UserRole;
};

const ROLES: UserRole[] = ["NORMAL_USER", "AMBASSADOR", "ADMIN"];

function normalizeRef(raw: unknown): ApiUserRef {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as RawRecord;
  const id = str(record.id);
  const name = str(record.name);
  return id || name ? { id, name } : null;
}

export function normalizeUser(raw: RawRecord): ApiUser {
  const role = str(raw.role, "NORMAL_USER").toUpperCase();
  return {
    id: str(raw.id),
    email: str(raw.email),
    fullName: str(raw.fullName),
    role: (ROLES.includes(role as UserRole) ? role : "NORMAL_USER") as UserRole,
    status: str(raw.status, "ACTIVE").toUpperCase() === "INACTIVE" ? "INACTIVE" : "ACTIVE",
    age: raw.age == null ? null : num(raw.age),
    schoolId: (raw.schoolId ?? null) as string | null,
    marketId: (raw.marketId ?? null) as string | null,
    school: normalizeRef(raw.school),
    market: normalizeRef(raw.market),
    referralCode: str(raw.referralCode),
    referredByUserId: (raw.referredByUserId ?? null) as string | null,
    rootAmbassadorId: (raw.rootAmbassadorId ?? null) as string | null,
    referralDepth: num(raw.referralDepth, 0),
    waitlistPosition: raw.waitlistPosition == null ? null : num(raw.waitlistPosition),
    onboardingCompletedAt: (raw.onboardingCompletedAt ?? null) as string | null,
    emailVerifiedAt: (raw.emailVerifiedAt ?? null) as string | null,
    lastLoginAt: (raw.lastLoginAt ?? null) as string | null,
    createdAt: raw.createdAt as string | undefined,
    updatedAt: raw.updatedAt as string | undefined,
  };
}

function normalizeUserDetail(raw: RawRecord): ApiUserDetail {
  return {
    ...normalizeUser(raw),
    totalPoints: num(raw.totalPoints, 0),
    totalInvites: num(raw.totalInvites, 0),
  };
}

function buildQuery(filters: UserFilters): string {
  const params = new URLSearchParams();
  params.set("page", String(filters.page));
  params.set("limit", String(filters.limit));
  if (filters.search?.trim()) params.set("search", filters.search.trim());
  if (filters.role) params.set("role", filters.role);
  if (filters.status) params.set("status", filters.status);
  return params.toString();
}

export async function listUsers(filters: UserFilters): Promise<UserListResult> {
  const payload = await call<RawRecord>(`/api/admin/users?${buildQuery(filters)}`);
  const root = (payload.data as RawRecord) ?? payload;

  const items = asArray(root.data) ?? asArray(root.users) ?? asArray(root) ?? [];

  const total = num(root.total, items.length);
  const limit = num(root.limit, filters.limit) || filters.limit;
  const page = num(root.page, filters.page) || filters.page;
  const totalPages = num(root.totalPages, Math.max(1, Math.ceil(total / limit)));

  return { items: items.map(normalizeUser), page, limit, total, totalPages };
}

export async function getUser(id: string): Promise<ApiUserDetail> {
  const payload = await call<RawRecord>(`/api/admin/users/${id}`);
  const raw = (payload.data ?? payload) as RawRecord;
  return normalizeUserDetail(raw);
}

export async function updateUserStatus(id: string, input: UpdateUserStatusInput): Promise<void> {
  await call(`/api/admin/users/${id}/status`, { method: "PUT", body: JSON.stringify(input) });
}
