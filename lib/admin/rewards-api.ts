import { asArray, call, num, str, type RawRecord } from "./http";

export type RewardStatus = "ACTIVE" | "INACTIVE";
export type RedemptionStatus = "REQUESTED" | "APPROVED" | "REJECTED" | "CANCELLED" | "REDEEMED" | "EXPIRED";
export type RedemptionAction = "APPROVED" | "REJECTED" | "CANCELLED" | "REDEEMED" | "EXPIRED";
export type RewardAudience = "ALL_USERS" | "NORMAL_USER" | "AMBASSADOR";

export const REWARD_TYPES = [
  "MERCH",
  "GIFT_CARD",
  "EARLY_ACCESS",
  "CASH",
  "CAMPUS_PRIZE",
  "MARKET_PRIZE",
  "NATIONAL_PRIZE",
  "AMBASSADOR_PRIZE",
  "APP_DOWNLOAD",
  "OTHER",
] as const;

export const UNLOCK_TYPES = [
  "POINTS",
  "INVITES",
  "RANK",
  "AMBASSADOR_RANK",
  "APP_DOWNLOAD",
  "MANUAL",
  "MIXED",
] as const;

export const AUDIENCE_TYPES: RewardAudience[] = ["ALL_USERS", "NORMAL_USER", "AMBASSADOR"];

export type RewardCondition = {
  key: string;
  label: string;
  current: number | null;
  required: number | null;
  met: boolean;
  enabled: boolean;
  autoUnlockable: boolean;
  percent: number;
};

export type RewardInventory = {
  quantity: number | null;
  reserved: number;
  redeemed: number;
  available: number | null;
  limited: boolean;
  outOfStock: boolean;
};

export type ApiReward = {
  id: string;
  title: string;
  description: string | null;
  rewardType: string;
  unlockType: string;
  audienceType: RewardAudience;
  ruleOperator: "ALL" | "ANY";
  isEnabled: boolean;
  isVisible: boolean;
  isRepeatable: boolean;
  maxRedemptionsPerUser: number | null;
  requiredPoints: number | null;
  requiredInvites: number | null;
  requiredRank: number | null;
  requiredAppDownloads: number | null;
  quantity: number | null;
  quantityReserved: number;
  quantityRedeemed: number;
  status: RewardStatus;
  createdAt?: string;
};

export type CreateRewardInput = {
  title: string;
  description?: string | null;
  rewardType: string;
  unlockType: string;
  audienceType?: RewardAudience;
  ruleOperator?: "ALL" | "ANY";
  isEnabled?: boolean;
  isVisible?: boolean;
  isRepeatable?: boolean;
  maxRedemptionsPerUser?: number | null;
  requiredPoints?: number | null;
  requiredInvites?: number | null;
  requiredRank?: number | null;
  requiredAppDownloads?: number | null;
  quantity?: number | null;
};

export type ApiRedemptionAudit = {
  id: string;
  previousStatus: RedemptionStatus | null;
  newStatus: RedemptionStatus;
  adminName: string | null;
  reason: string | null;
  internalNotes: string | null;
  inventoryChange: number;
  createdAt?: string;
};

export type ApiRedemption = {
  id: string;
  status: RedemptionStatus;
  userId: string;
  rewardId: string;
  userName: string | null;
  userEmail: string | null;
  rewardTitle: string | null;
  rewardType: string | null;
  reservedQuantity: number;
  redemptionSlot: number;
  redeemedAt: string | null;
  createdAt?: string;
  auditActions: ApiRedemptionAudit[];
};

function normalizeStatus(value: unknown): RewardStatus {
  return str(value, "ACTIVE").toUpperCase() === "INACTIVE" ? "INACTIVE" : "ACTIVE";
}

function normalizeAudience(value: unknown): RewardAudience {
  const normalized = str(value, "ALL_USERS").toUpperCase();
  if (normalized === "ALL") return "ALL_USERS";
  return (AUDIENCE_TYPES.includes(normalized as RewardAudience) ? normalized : "ALL_USERS") as RewardAudience;
}

function normalizeRedemptionStatus(value: unknown): RedemptionStatus {
  const status = str(value, "REQUESTED").toUpperCase();
  return (["REQUESTED", "APPROVED", "REJECTED", "CANCELLED", "REDEEMED", "EXPIRED"].includes(status)
    ? status
    : "REQUESTED") as RedemptionStatus;
}

function nullableNum(value: unknown): number | null {
  return value == null ? null : num(value);
}

function normalizeReward(raw: RawRecord): ApiReward {
  return {
    id: str(raw.id),
    title: str(raw.title),
    description: (raw.description ?? null) as string | null,
    rewardType: str(raw.rewardType),
    unlockType: str(raw.unlockType),
    audienceType: normalizeAudience(raw.audienceType),
    ruleOperator: str(raw.ruleOperator, "ALL").toUpperCase() === "ANY" ? "ANY" : "ALL",
    isEnabled: Boolean(raw.isEnabled ?? true),
    isVisible: Boolean(raw.isVisible ?? true),
    isRepeatable: Boolean(raw.isRepeatable ?? false),
    maxRedemptionsPerUser: nullableNum(raw.maxRedemptionsPerUser),
    requiredPoints: nullableNum(raw.requiredPoints),
    requiredInvites: nullableNum(raw.requiredInvites),
    requiredRank: nullableNum(raw.requiredRank),
    requiredAppDownloads: nullableNum(raw.requiredAppDownloads),
    quantity: nullableNum(raw.quantity),
    quantityReserved: num(raw.quantityReserved),
    quantityRedeemed: num(raw.quantityRedeemed),
    status: normalizeStatus(raw.status),
    createdAt: raw.createdAt as string | undefined,
  };
}

function normalizeAudit(raw: RawRecord): ApiRedemptionAudit {
  const admin = (raw.admin ?? {}) as RawRecord;
  return {
    id: str(raw.id),
    previousStatus: raw.previousStatus == null ? null : normalizeRedemptionStatus(raw.previousStatus),
    newStatus: normalizeRedemptionStatus(raw.newStatus),
    adminName: (admin.fullName ?? admin.email ?? null) as string | null,
    reason: (raw.reason ?? null) as string | null,
    internalNotes: (raw.internalNotes ?? null) as string | null,
    inventoryChange: num(raw.inventoryChange),
    createdAt: raw.createdAt as string | undefined,
  };
}

function normalizeRedemption(raw: RawRecord): ApiRedemption {
  const user = (raw.user ?? {}) as RawRecord;
  const reward = (raw.reward ?? {}) as RawRecord;
  return {
    id: str(raw.id),
    status: normalizeRedemptionStatus(raw.status),
    userId: str(raw.userId ?? user.id),
    rewardId: str(raw.rewardId ?? reward.id),
    userName: (user.fullName ?? user.name ?? null) as string | null,
    userEmail: (user.email ?? null) as string | null,
    rewardTitle: (reward.title ?? null) as string | null,
    rewardType: (reward.rewardType ?? null) as string | null,
    reservedQuantity: num(raw.reservedQuantity),
    redemptionSlot: num(raw.redemptionSlot),
    redeemedAt: (raw.redeemedAt ?? null) as string | null,
    createdAt: raw.createdAt as string | undefined,
    auditActions: (asArray(raw.auditActions) ?? []).map(normalizeAudit),
  };
}

export async function listRewards(): Promise<ApiReward[]> {
  const payload = await call<RawRecord>(`/api/admin/rewards`);
  const items = asArray(payload.data) ?? asArray((payload.data as RawRecord)?.items) ?? asArray(payload) ?? [];
  return items.map(normalizeReward);
}

export async function createReward(input: CreateRewardInput): Promise<void> {
  await call(`/api/admin/rewards`, { method: "POST", body: JSON.stringify(input) });
}

export async function updateRewardStatus(id: string, status: RewardStatus): Promise<void> {
  await call(`/api/admin/rewards/${id}`, { method: "PUT", body: JSON.stringify({ status }) });
}

export async function listRedemptions(status?: RedemptionStatus): Promise<ApiRedemption[]> {
  const query = status ? `?status=${status}` : "";
  const payload = await call<RawRecord>(`/api/admin/rewards/redemptions${query}`);
  const root = (payload.data as RawRecord) ?? payload;
  const items = asArray(root) ?? asArray(root.items) ?? [];
  return items.map(normalizeRedemption);
}

export async function updateRedemptionStatus(
  id: string,
  status: RedemptionAction,
  details: { reason?: string; internalNotes?: string } = {},
): Promise<void> {
  await call(`/api/admin/rewards/redemptions/${id}/status`, {
    method: "POST",
    body: JSON.stringify({ status, ...details }),
  });
}
