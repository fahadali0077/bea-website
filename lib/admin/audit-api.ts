import { asArray, call, num, str, type RawRecord } from "./http";

export type AdminAuditEvent = {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  entityType: string;
  entityId: string | null;
  entityLabel: string | null;
  beforeValues: unknown;
  afterValues: unknown;
  metadata: unknown;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
};

export type AuditFilters = {
  page: number;
  limit: number;
  search?: string;
  action?: string;
  entityType?: string;
  entityId?: string;
  from?: string;
  to?: string;
};

export type AuditListResult = {
  items: AdminAuditEvent[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

function normalizeAudit(raw: RawRecord): AdminAuditEvent {
  const admin = (raw.admin ?? {}) as RawRecord;
  return {
    id: str(raw.id),
    adminId: str(raw.adminId),
    adminName: str(admin.fullName || admin.email || raw.adminId, "Unknown admin"),
    action: str(raw.action),
    entityType: str(raw.entityType),
    entityId: raw.entityId == null ? null : str(raw.entityId),
    entityLabel: raw.entityLabel == null ? null : str(raw.entityLabel),
    beforeValues: raw.beforeValues ?? null,
    afterValues: raw.afterValues ?? null,
    metadata: raw.metadata ?? null,
    ipAddress: raw.ipAddress == null ? null : str(raw.ipAddress),
    userAgent: raw.userAgent == null ? null : str(raw.userAgent),
    createdAt: str(raw.createdAt),
  };
}

function buildQuery(filters: AuditFilters): string {
  const params = new URLSearchParams();
  params.set("page", String(filters.page));
  params.set("limit", String(filters.limit));
  if (filters.search?.trim()) params.set("search", filters.search.trim());
  if (filters.action?.trim()) params.set("action", filters.action.trim());
  if (filters.entityType?.trim()) params.set("entityType", filters.entityType.trim());
  if (filters.entityId?.trim()) params.set("entityId", filters.entityId.trim());
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  return params.toString();
}

export async function listAuditEvents(filters: AuditFilters): Promise<AuditListResult> {
  const payload = await call<RawRecord>(`/api/admin/audit-events?${buildQuery(filters)}`);
  const root = (payload.data as RawRecord) ?? payload;
  const pagination = ((root.pagination ?? {}) as RawRecord);
  const items = asArray(root.items) ?? [];

  return {
    items: items.map(normalizeAudit),
    pagination: {
      total: num(pagination.total),
      page: num(pagination.page, filters.page) || filters.page,
      limit: num(pagination.limit, filters.limit) || filters.limit,
      totalPages: num(pagination.totalPages, 1) || 1,
    },
  };
}

export function auditExportUrl(filters: AuditFilters): string {
  return `/api/admin/audit-events/export?${buildQuery({ ...filters, page: 1, limit: 100 })}`;
}
