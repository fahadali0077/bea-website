export type RawRecord = Record<string, unknown>;

export function num(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function asArray(value: unknown): RawRecord[] | null {
  return Array.isArray(value) ? (value as RawRecord[]) : null;
}

export class SessionExpiredError extends Error {}

export async function call<T>(url: string, init?: RequestInit): Promise<T> {
  const isFormData = init?.body instanceof FormData;
  const defaultHeaders: Record<string, string> = isFormData ? {} : { "Content-Type": "application/json" };

  const res = await fetch(url, {
    ...init,
    headers: { ...defaultHeaders, ...(init?.headers as Record<string, string> ?? {}) },
  });
  const data = (await res.json().catch(() => null)) as T & { message?: string };

  if (res.status === 401) {
    if (typeof window !== "undefined") window.location.href = "/auth/admin";
    throw new SessionExpiredError("Session expired");
  }
  if (!res.ok) {
    throw new Error(data?.message ?? "Request failed");
  }
  return data;
}
