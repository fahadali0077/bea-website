import { asArray, call, num, str, type RawRecord } from "./http";

export type PromptStatus = "SCHEDULED" | "ACTIVE" | "CLOSED" | "ARCHIVED";

export type ApiPrompt = {
  id: string;
  competitionId: string | null;
  title: string;
  description: string;
  promptDate: string | null;
  status: PromptStatus;
  createdAt?: string;
};

export type PromptWinnerScope = "campus" | "market" | "national";

export type PromptWinner = {
  ledgerId?: string;
  responseId: string;
  userId: string;
  userName: string;
  schoolName: string | null;
  marketName: string | null;
  responseText: string | null;
  likesCount: number;
  commentsCount: number;
  scope: PromptWinnerScope;
  rank?: number;
  points: number;
  awardedAt?: string;
};

export type PromptWinnerResult = {
  message: string;
  alreadyCalculated: boolean;
  confirmed: boolean;
  awardsCount: number;
  winners: PromptWinner[];
};

export type CreatePromptInput = {
  title: string;
  description: string;
  promptDate: string;
};

export type UpdatePromptInput = {
  title?: string;
  description?: string;
  status?: PromptStatus;
};

export type PromptFilters = {
  page: number;
  limit: number;
  competitionId?: string;
};

export type PromptListResult = {
  items: ApiPrompt[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const STATUSES: PromptStatus[] = ["SCHEDULED", "ACTIVE", "CLOSED", "ARCHIVED"];

function normalizePrompt(raw: RawRecord): ApiPrompt {
  const status = str(raw.status, "SCHEDULED").toUpperCase();
  return {
    id: str(raw.id),
    competitionId: (raw.competitionId ?? null) as string | null,
    title: str(raw.title),
    description: str(raw.description),
    promptDate: (raw.promptDate ?? null) as string | null,
    status: (STATUSES.includes(status as PromptStatus) ? status : "SCHEDULED") as PromptStatus,
    createdAt: raw.createdAt as string | undefined,
  };
}

function buildQuery(filters: PromptFilters): string {
  const params = new URLSearchParams();
  params.set("page", String(filters.page));
  params.set("limit", String(filters.limit));
  if (filters.competitionId) params.set("competitionId", filters.competitionId);
  return params.toString();
}

export async function listPrompts(filters: PromptFilters): Promise<PromptListResult> {
  const payload = await call<RawRecord>(`/api/admin/prompts?${buildQuery(filters)}`);
  const root = (payload.data as RawRecord) ?? payload;

  const items = asArray(root.items) ?? asArray(root.prompts) ?? asArray(root) ?? [];
  const meta = (root.pagination ?? root) as RawRecord;

  const total = num(meta.total, items.length);
  const limit = num(meta.limit, filters.limit) || filters.limit;
  const page = num(meta.page, filters.page) || filters.page;
  const totalPages = num(meta.totalPages, Math.max(1, Math.ceil(total / limit)));

  return { items: items.map(normalizePrompt), page, limit, total, totalPages };
}

export async function createPrompt(input: CreatePromptInput): Promise<void> {
  await call(`/api/admin/prompts`, { method: "POST", body: JSON.stringify(input) });
}

export async function updatePrompt(id: string, input: UpdatePromptInput): Promise<void> {
  await call(`/api/admin/prompts/${id}`, { method: "PUT", body: JSON.stringify(input) });
}

function normalizeWinner(raw: RawRecord): PromptWinner {
  return {
    ledgerId: raw.ledgerId as string | undefined,
    responseId: str(raw.responseId),
    userId: str(raw.userId),
    userName: str(raw.userName, "Anonymous"),
    schoolName: (raw.schoolName ?? null) as string | null,
    marketName: (raw.marketName ?? null) as string | null,
    responseText: (raw.responseText ?? null) as string | null,
    likesCount: num(raw.likesCount),
    commentsCount: num(raw.commentsCount),
    scope: str(raw.scope, "national") as PromptWinnerScope,
    rank: raw.rank === undefined ? undefined : num(raw.rank),
    points: num(raw.points),
    awardedAt: raw.awardedAt as string | undefined,
  };
}

export async function calculatePromptWinners(id: string, confirm = false): Promise<PromptWinnerResult> {
  const payload = await call<RawRecord>(`/api/admin/prompts/${id}/calculate-winners`, {
    method: "POST",
    body: JSON.stringify({ confirm }),
  });
  const root = (payload.data as RawRecord) ?? payload;
  const winners = asArray(root.winners) ?? [];

  return {
    message: str(root.message),
    alreadyCalculated: Boolean(root.alreadyCalculated),
    confirmed: Boolean(root.confirmed),
    awardsCount: num(root.awardsCount),
    winners: winners.map(normalizeWinner),
  };
}
