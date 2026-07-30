import { asArray, call, num, str, type RawRecord } from "./http";

export type MessageTargetType = "all" | "ambassadors" | "school" | "market";
export type DeliveryChannel = "forum" | "email" | "both";

export type ApiMessage = {
  id: string;
  title: string;
  body: string;
  targetType: MessageTargetType;
  targetId: string | null;
  targetName: string | null;
  deliveryChannel: DeliveryChannel;
  sentAt: string | null;
  createdAt?: string;
};

export type SendMessageInput = {
  title: string;
  body: string;
  targetType: MessageTargetType;
  targetId?: string;
  deliveryChannel: DeliveryChannel;
};

export type MessageListResult = {
  items: ApiMessage[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const TARGET_TYPES: MessageTargetType[] = ["all", "ambassadors", "school", "market"];
const CHANNELS: DeliveryChannel[] = ["forum", "email", "both"];

function normalizeMessage(raw: RawRecord): ApiMessage {
  const targetType = str(raw.targetType, "all").toLowerCase() as MessageTargetType;
  const channel = str(raw.deliveryChannel, "forum").toLowerCase() as DeliveryChannel;
  const nestedTarget = (raw.school ?? raw.market ?? {}) as RawRecord;
  return {
    id: str(raw.id),
    title: str(raw.title),
    body: str(raw.body),
    targetType: TARGET_TYPES.includes(targetType) ? targetType : "all",
    targetId: (raw.targetId ?? null) as string | null,
    targetName: (nestedTarget.name ?? null) as string | null,
    deliveryChannel: CHANNELS.includes(channel) ? channel : "forum",
    sentAt: (raw.sentAt ?? null) as string | null,
    createdAt: raw.createdAt as string | undefined,
  };
}

export async function listMessages(page: number, limit: number): Promise<MessageListResult> {
  const payload = await call<RawRecord>(`/api/admin/messages?page=${page}&limit=${limit}`);
  const root = (payload.data as RawRecord) ?? payload;
  const items = asArray(root.items) ?? asArray(root.messages) ?? asArray(root) ?? [];
  const meta = (root.pagination ?? root) as RawRecord;

  const total = num(meta.total, items.length);
  const resolvedLimit = num(meta.limit, limit) || limit;
  const resolvedPage = num(meta.page, page) || page;
  const totalPages = num(meta.totalPages, Math.max(1, Math.ceil(total / resolvedLimit)));

  return { items: items.map(normalizeMessage), page: resolvedPage, limit: resolvedLimit, total, totalPages };
}

export async function sendMessage(input: SendMessageInput): Promise<void> {
  await call(`/api/admin/messages/send`, { method: "POST", body: JSON.stringify(input) });
}
