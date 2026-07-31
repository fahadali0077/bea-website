"use client";

import { useMemo } from "react";

import {
  useGetMyRewardProgressQuery,
  useGetSchoolRankingQuery,
} from "@/features/api/apiSlice";
import type { RewardProgress } from "@/lib/api/rewards.types";
import { WAITLIST_PRIZES_DETAIL } from "@/lib/waitlist-page-content";

/**
 * Maps live reward data onto the same shape the Rewards components already
 * render, so the markup stays untouched while the numbers become real.
 *
 * Static copy (headings, the prompt-points breakdown, section labels) still
 * comes from WAITLIST_PRIZES_DETAIL, because none of it has a database source.
 */

export interface RewardCardView {
  id: string | null;
  status: string;
  title: string;
  desc: string[];
  cost: string;
  cta: string;
  canRedeem: boolean;
  disabledReason: string | null;
}

const FALLBACK_DESC = ["Details coming soon."];

/** How far along the user is toward a reward, honouring its ALL/ANY operator. */
const rewardPercent = (reward: RewardProgress): number => {
  const active = reward.conditions.filter((condition) => condition.enabled);
  if (!active.length) return reward.eligible ? 100 : 0;

  const percents = active.map((condition) => condition.percent);
  return reward.ruleOperator === "ANY"
    ? Math.max(...percents)
    : Math.min(...percents);
};

/** Badge text mirroring the original "100% Unlocked" pill. */
const statusLabel = (reward: RewardProgress): string => {
  switch (reward.unlockStatus) {
    case "UNLOCKED":
      return "100% Unlocked";
    case "OUT_OF_STOCK":
      return "Out of stock";
    case "REQUESTED":
      return "Redemption requested";
    case "APPROVED":
      return "Approved";
    case "REDEEMED":
      return "Redeemed";
    case "REJECTED":
      return "Not approved";
    case "EXPIRED":
      return "Expired";
    case "CANCELLED":
      return "Cancelled";
    case "UNAVAILABLE":
      return "Unavailable";
    default:
      return `${rewardPercent(reward)}% Unlocked`;
  }
};

/** Mirrors the original "1200 points" / "Most points" cost line. */
const costLabel = (reward: RewardProgress): string => {
  if (reward.requiredPoints) return `${reward.requiredPoints} points`;
  if (reward.requiredInvites) return `${reward.requiredInvites} invites`;
  if (reward.requiredRank) return `Top ${reward.requiredRank}`;
  if (reward.requiredAppDownloads) {
    return `${reward.requiredAppDownloads} app download${reward.requiredAppDownloads > 1 ? "s" : ""}`;
  }
  return "Most points";
};

const disabledReason = (reward: RewardProgress): string | null => {
  if (reward.eligible) return null;
  if (reward.inventory.outOfStock) return "This reward is out of stock.";
  if (reward.redemptionLimitReached) return "You have already claimed this reward.";
  if (reward.unlockStatus === "REQUESTED") return "Your redemption is being reviewed.";
  if (reward.unlockStatus === "UNAVAILABLE") return "This reward is not currently available.";
  return "Keep earning points to unlock this reward.";
};

const toCard = (reward: RewardProgress): RewardCardView => ({
  id: reward.rewardId,
  status: statusLabel(reward),
  title: reward.title,
  desc: reward.description
    ? reward.description.split("\n").filter(Boolean)
    : FALLBACK_DESC,
  cost: costLabel(reward),
  cta: "Redeem",
  canRedeem: reward.eligible,
  disabledReason: disabledReason(reward),
});

export function useRewardsContent() {
  const {
    data: progress,
    isLoading: isLoadingRewards,
    isError: isRewardsError,
    error: rewardsError,
    refetch,
  } = useGetMyRewardProgressQuery();

  // Only the top row is needed for the "current leader" strip.
  const { data: ranking } = useGetSchoolRankingQuery({ page: 1, limit: 1 });

  const content = useMemo(() => {
    const base = WAITLIST_PRIZES_DETAIL;
    const rewards = progress?.rewardsProgress ?? [];

    // Progress bar tracks the nearest reward the user has not unlocked yet.
    const lockedPercents = rewards
      .filter((reward) => !reward.eligible)
      .map(rewardPercent);
    const nextRewardPercent = lockedPercents.length
      ? Math.max(...lockedPercents)
      : rewards.length
        ? 100
        : 0;

    const nationalRank = progress?.ranks?.nationalRank ?? null;
    const leader = ranking?.items?.[0] ?? null;

    return {
      ...base,
      points: {
        ...base.points,
        value:
          progress != null ? progress.totalPoints.toLocaleString("en-US") : "—",
        percent: nextRewardPercent,
        // No percentile is computed anywhere, so show the real national rank
        // instead of the hardcoded "Top 10% of all participants".
        note: nationalRank
          ? `National rank #${nationalRank.toLocaleString("en-US")}`
          : "Start earning points to get ranked",
      },
      featured: {
        ...base.featured,
        rewards: rewards.slice(0, 3).map(toCard),
      },
      school: {
        ...base.school,
        leaderName: leader?.schoolName ?? "No leader yet",
        leaderPts: leader ? `${leader.total.toLocaleString("en-US")} pts` : "—",
      },
    };
  }, [progress, ranking]);

  const allRewards = useMemo(
    () => (progress?.rewardsProgress ?? []).map(toCard),
    [progress]
  );

  return {
    content,
    allRewards,
    hasRewards: (progress?.rewardsProgress?.length ?? 0) > 0,
    isLoading: isLoadingRewards,
    isError: isRewardsError,
    errorMessage:
      (rewardsError as { message?: string } | undefined)?.message ??
      "We could not load your rewards right now.",
    refetch,
  };
}
