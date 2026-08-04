import type {
  AmbassadorLeaderboardEntry,
  AmbassadorNetworkNode,
  AmbassadorReferralNetwork,
} from "@/lib/api/ambassador.types";

/**
 * The API's `totalReferralNetwork` counts every COUNTED referral rooted at the
 * ambassador, which already includes their own direct invites. The designs
 * split the same total into three visible numbers:
 *
 *   Invites  = people who joined on the ambassador's own link  (direct)
 *   Network  = people who joined through someone the ambassador invited
 *   Impact   = the two added together
 *
 * Keeping the arithmetic in one place stops the leaderboard and the overview
 * from drifting apart.
 */
export const directInvitesOf = (row: Pick<AmbassadorLeaderboardEntry, "directInvites">) =>
  row.directInvites;

export const networkInvitesOf = (
  row: Pick<AmbassadorLeaderboardEntry, "directInvites" | "totalReferralNetwork">,
) => Math.max(0, row.totalReferralNetwork - row.directInvites);

export const impactOf = (row: Pick<AmbassadorLeaderboardEntry, "totalReferralNetwork">) =>
  row.totalReferralNetwork;

export type LeaderboardScope = "campus" | "market" | "national";

export const SCOPE_LABELS: Record<LeaderboardScope, string> = {
  campus: "Campus",
  market: "Market",
  national: "National",
};

/**
 * The leaderboard endpoint returns one national list; every row carries its
 * school and market, so campus and market boards are the same list filtered to
 * the viewer's own school/market and re-ranked from 1.
 */
export function scopeLeaderboard(
  rows: AmbassadorLeaderboardEntry[],
  scope: LeaderboardScope,
  viewer: { schoolId?: string | null; marketId?: string | null; school: string | null; market: string | null },
): AmbassadorLeaderboardEntry[] {
  // Ids are authoritative — two campuses can share a display name. The name
  // comparison is only a fallback for rows that predate the id fields.
  const sameCampus = (row: AmbassadorLeaderboardEntry) =>
    viewer.schoolId && row.schoolId
      ? row.schoolId === viewer.schoolId
      : Boolean(row.school) && row.school === viewer.school;

  const sameMarket = (row: AmbassadorLeaderboardEntry) =>
    viewer.marketId && row.marketId
      ? row.marketId === viewer.marketId
      : Boolean(row.market) && row.market === viewer.market;

  const filtered =
    scope === "campus" ? rows.filter(sameCampus) : scope === "market" ? rows.filter(sameMarket) : rows;

  return filtered.map((row, index) => ({ ...row, rank: index + 1 }));
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** A referral counts toward a window once it has been verified, not when it landed. */
const settledAt = (node: AmbassadorNetworkNode) =>
  new Date(node.countedAt ?? node.joinedAt).getTime();

const withinLastDay = (node: AmbassadorNetworkNode, now: number) =>
  node.isCompleted && now - settledAt(node) <= DAY_MS;

export type ImpactDelta = {
  direct: number;
  network: number;
  total: number;
};

/**
 * "+20 direct / +22 network / +42 net impact" in the last 24 hours, derived
 * from the referral network's own timestamps rather than a separate endpoint.
 */
export function impactDelta(
  network: AmbassadorReferralNetwork | undefined,
  now = Date.now(),
): ImpactDelta {
  if (!network) return { direct: 0, network: 0, total: 0 };

  const direct = network.directReferrals.filter((node) => withinLastDay(node, now)).length;
  const indirect = network.downstreamNetwork.filter(
    (node) => node.referralDepth > 1 && withinLastDay(node, now),
  ).length;

  return { direct, network: indirect, total: direct + indirect };
}

/** How far the viewer trails the leader on the board they're looking at. */
export function behindLeader(
  rows: AmbassadorLeaderboardEntry[],
  userId: string | undefined,
): number | null {
  if (!rows.length || !userId) return null;
  const me = rows.find((row) => row.userId === userId);
  if (!me || me.rank === 1) return null;
  return Math.max(0, impactOf(rows[0]) - impactOf(me));
}

/** Depth 1 is a direct invite; deeper referrals are labelled by their distance. */
export function referralTypeLabel(depth: number): string {
  if (depth <= 1) return "Direct";
  if (depth === 2) return "Network";
  return `Network + ${depth - 1}`;
}

export function formatCount(value: number): string {
  return value.toLocaleString("en-US");
}

/** "Joined 2h ago" / "Joined 3d ago" — the relative stamp used in activity lists. */
export function relativeJoined(iso: string, now = Date.now()): string {
  const elapsed = now - new Date(iso).getTime();
  const minutes = Math.floor(elapsed / 60000);

  if (minutes < 1) return "Joined just now";
  if (minutes < 60) return `Joined ${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Joined ${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `Joined ${days}d ago`;

  return `Joined ${new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

/** TODAY / YESTERDAY / an explicit date — the group headings on the impact page. */
export function dayBucketLabel(iso: string, now = new Date()): string {
  const date = new Date(iso);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const stamp = date.getTime();

  if (stamp >= startOfToday) return "TODAY";
  if (stamp >= startOfToday - DAY_MS) return "YESTERDAY";

  return date
    .toLocaleDateString("en-US", { month: "long", day: "numeric" })
    .toUpperCase();
}

export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
};

export function countdownTo(endDate: string | null | undefined, now = Date.now()): Countdown | null {
  if (!endDate) return null;

  const remaining = new Date(endDate).getTime() - now;
  if (Number.isNaN(remaining)) return null;

  if (remaining <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  return {
    days: Math.floor(remaining / DAY_MS),
    hours: Math.floor((remaining / 3600000) % 24),
    minutes: Math.floor((remaining / 60000) % 60),
    seconds: Math.floor((remaining / 1000) % 60),
    expired: false,
  };
}
