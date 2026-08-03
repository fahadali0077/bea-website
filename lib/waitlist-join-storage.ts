import type { JoinWaitlistResponse } from "@/lib/api/types";

const STORAGE_KEY = "bea_waitlist_join_result";

export function persistJoinResult(result: JoinWaitlistResponse) {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result));
}

export function readStoredJoinResult(): JoinWaitlistResponse | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as JoinWaitlistResponse;
    if (typeof parsed.referralCode === "string" && parsed.referralCode) {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
}

export function formatWaitlistRankNumber(position: number | null | undefined) {
  if (position == null) {
    return null;
  }

  return `#${position.toLocaleString()}`;
}
