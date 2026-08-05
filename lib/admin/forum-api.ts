import { asArray, call, num, str, type RawRecord } from "./http";

export type ForumScope = "CAMPUS" | "MARKET" | "NATIONAL";
export type ForumStatus = "ACTIVE" | "INACTIVE";

export type AdminForumUser = {
  id: string;
  email?: string;
  fullName?: string;
  role?: string;
};

export type AdminForumPost = {
  id: string;
  title: string | null;
  body: string;
  scope: ForumScope;
  status: ForumStatus;
  isPinned: boolean;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  user?: AdminForumUser | null;
  school?: { id: string; name: string } | null;
  market?: { id: string; name: string } | null;
  comments?: AdminForumComment[];
  moderationActions?: ForumModerationAction[];
};

export type AdminForumComment = {
  id: string;
  postId: string;
  commentText: string;
  status: ForumStatus;
  createdAt: string;
  user?: AdminForumUser | null;
};

export type ForumModerationAction = {
  id: string;
  moderatorAdminId: string;
  actionType: string;
  targetType: string;
  postId?: string | null;
  commentId?: string | null;
  reason: string;
  originalTitle?: string | null;
  originalBody?: string | null;
  originalCommentText?: string | null;
  createdAt: string;
  moderator?: AdminForumUser | null;
};

export type ForumPostFilters = {
  page: number;
  limit: number;
  scope?: ForumScope | "";
  status?: ForumStatus | "";
  search?: string;
};

export type ForumListResult = {
  items: AdminForumPost[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

const SCOPES: ForumScope[] = ["CAMPUS", "MARKET", "NATIONAL"];
const STATUSES: ForumStatus[] = ["ACTIVE", "INACTIVE"];

function normalizeUser(raw: unknown): AdminForumUser | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as RawRecord;
  return {
    id: str(record.id),
    email: str(record.email),
    fullName: str(record.fullName),
    role: str(record.role),
  };
}

function normalizeModerationAction(raw: RawRecord): ForumModerationAction {
  return {
    id: str(raw.id),
    moderatorAdminId: str(raw.moderatorAdminId),
    actionType: str(raw.actionType),
    targetType: str(raw.targetType),
    postId: (raw.postId ?? null) as string | null,
    commentId: (raw.commentId ?? null) as string | null,
    reason: str(raw.reason),
    originalTitle: (raw.originalTitle ?? null) as string | null,
    originalBody: (raw.originalBody ?? null) as string | null,
    originalCommentText: (raw.originalCommentText ?? null) as string | null,
    createdAt: str(raw.createdAt),
    moderator: normalizeUser(raw.moderator),
  };
}

function normalizeComment(raw: RawRecord): AdminForumComment {
  const status = str(raw.status, "ACTIVE").toUpperCase();
  return {
    id: str(raw.id),
    postId: str(raw.postId),
    commentText: str(raw.commentText),
    status: (STATUSES.includes(status as ForumStatus) ? status : "ACTIVE") as ForumStatus,
    createdAt: str(raw.createdAt),
    user: normalizeUser(raw.user),
  };
}

function normalizePost(raw: RawRecord): AdminForumPost {
  const scope = str(raw.scope, "NATIONAL").toUpperCase();
  const status = str(raw.status, "ACTIVE").toUpperCase();
  const comments = asArray(raw.comments) ?? [];
  const moderationActions = asArray(raw.moderationActions) ?? [];
  const school = raw.school as RawRecord | undefined;
  const market = raw.market as RawRecord | undefined;

  return {
    id: str(raw.id),
    title: (raw.title ?? null) as string | null,
    body: str(raw.body),
    scope: (SCOPES.includes(scope as ForumScope) ? scope : "NATIONAL") as ForumScope,
    status: (STATUSES.includes(status as ForumStatus) ? status : "ACTIVE") as ForumStatus,
    isPinned: Boolean(raw.isPinned),
    likesCount: num(raw.likesCount),
    commentsCount: num(raw.commentsCount),
    createdAt: str(raw.createdAt),
    user: normalizeUser(raw.user),
    school: school ? { id: str(school.id), name: str(school.name) } : null,
    market: market ? { id: str(market.id), name: str(market.name) } : null,
    comments: comments.map(normalizeComment),
    moderationActions: moderationActions.map(normalizeModerationAction),
  };
}

function buildQuery(filters: ForumPostFilters): string {
  const params = new URLSearchParams();
  params.set("page", String(filters.page));
  params.set("limit", String(filters.limit));
  if (filters.scope) params.set("scope", filters.scope);
  if (filters.status) params.set("status", filters.status);
  if (filters.search?.trim()) params.set("search", filters.search.trim());
  return params.toString();
}

export async function listForumPostsAdmin(filters: ForumPostFilters): Promise<ForumListResult> {
  const payload = await call<RawRecord>(`/api/admin/forum/posts?${buildQuery(filters)}`);
  const root = (payload.data as RawRecord) ?? payload;
  const items = asArray(root.items) ?? [];
  const meta = (root.pagination ?? root) as RawRecord;
  const total = num(meta.total, items.length);
  const limit = num(meta.limit, filters.limit) || filters.limit;
  const page = num(meta.page, filters.page) || filters.page;
  return {
    items: items.map(normalizePost),
    total,
    limit,
    page,
    totalPages: num(meta.totalPages, Math.max(1, Math.ceil(total / limit))),
  };
}

export async function getForumPostAdmin(id: string): Promise<AdminForumPost> {
  const payload = await call<RawRecord>(`/api/admin/forum/posts/${id}`);
  const root = (payload.data as RawRecord) ?? payload;
  return normalizePost(root);
}

export async function setForumPostPinned(id: string, isPinned: boolean, reason: string): Promise<void> {
  await call(`/api/admin/forum/posts/${id}/pin`, {
    method: "POST",
    body: JSON.stringify({ isPinned, reason }),
  });
}

export async function removeForumPost(id: string, reason: string): Promise<void> {
  await call(`/api/admin/forum/posts/${id}`, {
    method: "DELETE",
    body: JSON.stringify({ reason }),
  });
}

export async function restoreForumPost(id: string, reason: string): Promise<void> {
  await call(`/api/admin/forum/posts/${id}/restore`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export async function removeForumComment(id: string, reason: string): Promise<void> {
  await call(`/api/admin/forum/comments/${id}`, {
    method: "DELETE",
    body: JSON.stringify({ reason }),
  });
}

export async function restoreForumComment(id: string, reason: string): Promise<void> {
  await call(`/api/admin/forum/comments/${id}/restore`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}
