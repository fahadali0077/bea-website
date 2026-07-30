import { asArray, call, num, str, type RawRecord } from "./http";

export type PointRule = {
  id: string;
  action: string;
  points: number;
  updatedAt?: string;
};

function normalizeRule(raw: RawRecord): PointRule {
  return {
    id: str(raw.id),
    action: str(raw.action),
    points: num(raw.points),
    updatedAt: raw.updatedAt as string | undefined,
  };
}

export async function listPointRules(): Promise<PointRule[]> {
  const payload = await call<RawRecord>(`/api/admin/point-rules`);
  const items = asArray(payload.data) ?? asArray(payload) ?? [];
  return items.map(normalizeRule);
}

export async function updatePointRule(action: string, points: number): Promise<void> {
  await call(`/api/admin/point-rules/${encodeURIComponent(action)}`, {
    method: "PUT",
    body: JSON.stringify({ points }),
  });
}
