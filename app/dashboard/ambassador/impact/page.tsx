"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowLeft, TrendingUp } from "lucide-react";

import { Avatar } from "@/app/components/dashboard/Avatar";
import { useGetAmbassadorDashboardQuery, useGetAmbassadorReferralsQuery } from "@/features/api/apiSlice";
import type { AmbassadorNetworkNode } from "@/lib/api/ambassador.types";
import {
  dayBucketLabel,
  formatCount,
  impactDelta,
  referralTypeLabel,
  relativeJoined,
} from "@/lib/ambassador-metrics";
import { AmbassadorGuard, DashboardNotice } from "../_components";
import { Eyebrow, GREEN, TEAL } from "../_ui";

export default function AmbassadorImpactPage() {
  const { data: dashboard } = useGetAmbassadorDashboardQuery();
  const { data: network, isLoading, error } = useGetAmbassadorReferralsQuery();

  const delta = useMemo(() => impactDelta(network), [network]);

  /** Direct and downstream arrive separately and can overlap; one list, newest first. */
  const activity = useMemo(() => {
    if (!network) return [] as AmbassadorNetworkNode[];

    const byId = new Map<string, AmbassadorNetworkNode>();
    for (const node of [...network.directReferrals, ...network.downstreamNetwork]) {
      byId.set(node.id, node);
    }

    return [...byId.values()].sort(
      (a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime(),
    );
  }, [network]);

  const groups = useMemo(() => {
    const buckets: Array<{ label: string; rows: AmbassadorNetworkNode[] }> = [];
    for (const node of activity) {
      const label = dayBucketLabel(node.joinedAt);
      const last = buckets[buckets.length - 1];
      if (last && last.label === label) last.rows.push(node);
      else buckets.push({ label, rows: [node] });
    }
    return buckets;
  }, [activity]);

  const fullName = dashboard?.user.fullName ?? "You";
  const direct = network?.totals.directCompleted ?? 0;
  const indirect = Math.max(0, (network?.totals.completed ?? 0) - direct);
  const impact = network?.totals.completed ?? 0;

  return (
    <AmbassadorGuard>
      <main className="flex-1 flex flex-col gap-6 min-w-0">
        <Link
          href="/dashboard/ambassador/leaderboard"
          className="inline-flex items-center gap-2.5 font-lato text-[14px] font-medium text-[#4a4741] hover:text-black"
        >
          <ArrowLeft className="size-4" />
          Back to campus leaderboard
        </Link>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-7">
          <Avatar name={fullName} size={92} />
          <div className="min-w-0">
            <h1 className="font-canela text-[26px] md:text-[32px] leading-tight text-black">{fullName}</h1>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <HeadlineStat value={direct} label="invites" />
              <HeadlineStat value={indirect} label="network" />
              <HeadlineStat value={impact} label="total impact" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-[10px] bg-[#eef5ef] px-5 py-4">
          <span className="flex items-center gap-2.5 font-lato text-[18px] font-bold" style={{ color: GREEN }}>
            <TrendingUp className="size-5" />+{formatCount(delta.total)} today
          </span>
          <span className="font-lato text-[15px] font-medium text-[#4a4741]">
            {formatCount(delta.direct)} direct
          </span>
          <span className="text-[#c3c0ba]">•</span>
          <span className="font-lato text-[15px] font-medium text-[#4a4741]">
            {formatCount(delta.network)} network
          </span>
        </div>

        {isLoading ? <DashboardNotice>Loading your impact activity…</DashboardNotice> : null}
        {error ? <DashboardNotice>Your impact activity is unavailable right now.</DashboardNotice> : null}

        <div>
          <Eyebrow className="!text-[13px] !tracking-[0.16em]">Your impact activity</Eyebrow>

          <div className="mt-4 overflow-x-auto">
            <div className="min-w-[680px]">
              <div className="grid grid-cols-[1.2fr_1fr_1fr_140px] gap-4 border-b border-[#eeeae3] pb-3 font-lato text-[12px] font-bold uppercase tracking-[0.12em] text-[#9a948d]">
                <span>{groups[0]?.label ?? "Activity"}</span>
                <span>Type</span>
                <span>Source</span>
                <span className="text-right">Time</span>
              </div>

              {groups.length ? (
                groups.map((group, groupIndex) => (
                  <div key={group.label}>
                    {groupIndex > 0 ? (
                      <p className="border-b border-[#eeeae3] pt-6 pb-3 font-lato text-[12px] font-bold uppercase tracking-[0.12em] text-[#9a948d]">
                        {group.label}
                      </p>
                    ) : null}

                    {group.rows.map((row) => (
                      <div
                        key={row.id}
                        className="grid grid-cols-[1.2fr_1fr_1fr_140px] items-center gap-4 border-b border-[#eeeae3] py-4"
                      >
                        <span className="truncate font-lato text-[15px] font-medium text-black">
                          {row.fullName}
                        </span>
                        <span className="font-lato text-[15px] font-medium text-[#3f3b36]">
                          {referralTypeLabel(row.referralDepth)}
                        </span>
                        <span className="truncate font-lato text-[15px] font-medium text-[#3f3b36]">
                          {row.referredByUserId === dashboard?.user.id ? "You" : row.referrerName}
                        </span>
                        <span className="text-right font-lato text-[14px] font-medium text-[#9a948d]">
                          {relativeJoined(row.joinedAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <p className="py-8 font-lato text-[14px] font-medium text-[#7c7c7c]">
                  {isLoading ? "" : "No invites yet. Share your link to start your network."}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </AmbassadorGuard>
  );
}

function HeadlineStat({ value, label }: { value: number; label: string }) {
  return (
    <span className="flex items-baseline gap-2">
      <span className="font-canela text-[28px] md:text-[34px] leading-none" style={{ color: TEAL }}>
        {formatCount(value)}
      </span>
      <span className="font-lato text-[14px] font-medium text-[#7c7c7c]">{label}</span>
    </span>
  );
}
