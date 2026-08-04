"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Avatar } from "@/app/components/dashboard/Avatar";
import {
  useGetAmbassadorDashboardQuery,
  useGetAmbassadorLeaderboardQuery,
  useGetAmbassadorReferralsQuery,
} from "@/features/api/apiSlice";
import {
  behindLeader,
  directInvitesOf,
  formatCount,
  impactDelta,
  impactOf,
  networkInvitesOf,
  scopeLeaderboard,
  type LeaderboardScope,
} from "@/lib/ambassador-metrics";
import { topPrizeForScope } from "@/lib/ambassador-prizes";
import { AmbassadorGuard, DashboardNotice } from "../_components";
import { CountdownText, GREEN, MovementCell, RankMedal, ScopeTabs, StatBlock, SurfaceCard, TEAL } from "../_ui";

const SCOPE_PLACE_LABEL: Record<LeaderboardScope, string> = {
  campus: "Your campus",
  market: "Your market",
  national: "Board",
};

export default function AmbassadorLeaderboardPage() {
  const [scope, setScope] = useState<LeaderboardScope>("campus");

  const { data: dashboard } = useGetAmbassadorDashboardQuery();
  const { data: rows = [], isLoading, error } = useGetAmbassadorLeaderboardQuery();
  const { data: network } = useGetAmbassadorReferralsQuery();

  const viewer = useMemo(
    () => ({
      schoolId: dashboard?.school?.id ?? null,
      marketId: dashboard?.market?.id ?? null,
      school: dashboard?.school?.name ?? null,
      market: dashboard?.market?.name ?? null,
    }),
    [dashboard?.school?.id, dashboard?.market?.id, dashboard?.school?.name, dashboard?.market?.name],
  );
  const userId = dashboard?.user.id;

  const scoped = useMemo(() => scopeLeaderboard(rows, scope, viewer), [rows, scope, viewer]);
  const me = scoped.find((row) => row.userId === userId);
  const trailing = behindLeader(scoped, userId);
  const delta = useMemo(() => impactDelta(network), [network]);

  const placeName =
    scope === "campus"
      ? (viewer.school ?? "Your campus")
      : scope === "market"
        ? (viewer.market ?? "Your market")
        : "Nationwide";

  return (
    <AmbassadorGuard>
      <main className="flex-1 flex flex-col gap-6 md:gap-7 min-w-0">
        <h1 className="font-canela text-[30px] md:text-[46px] leading-tight tracking-[0.01em] text-black">
          Ambassador leaderboard
        </h1>

        <ScopeTabs value={scope} onChange={setScope} />

        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-8">
          <StatBlock label={SCOPE_PLACE_LABEL[scope]} value={placeName} />
          <StatBlock label="Total ambassadors" value={formatCount(scoped.length)} />
          <StatBlock label="Top Prize" value={topPrizeForScope(scope)} />
          <StatBlock
            label="Competition ends"
            value={<CountdownText endDate={dashboard?.competition?.endDate} />}
          />
        </div>

        {isLoading ? <DashboardNotice>Loading the leaderboard…</DashboardNotice> : null}
        {error ? <DashboardNotice>The leaderboard is unavailable right now. Try again shortly.</DashboardNotice> : null}

        {me ? (
          <SurfaceCard className="px-5 py-5 md:px-7 md:py-6">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:gap-8">
              <div className="flex items-center gap-4 xl:w-[280px] xl:shrink-0">
                <Avatar name={me.fullName} size={72} />
                <div>
                  <p className="font-lato text-[16px] md:text-[18px] font-bold text-black">Your Standing</p>
                  <p className="font-lato text-[30px] md:text-[36px] font-black leading-none" style={{ color: TEAL }}>
                    #{me.rank}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 xl:w-[190px] xl:shrink-0">
                <MovementCell direction={me.rankMovementDirection} value={me.rankMovement} className="text-[20px]" />
                <p className="font-lato text-[13px] font-medium leading-tight text-[#7c7c7c]">
                  positions
                  <br />
                  since yesterday
                </p>
              </div>

              <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-3">
                <DeltaStat label="Net impact (24h)" value={delta.total} />
                <DeltaStat label="Direct invites (24h)" value={delta.direct} />
                <DeltaStat label="Network invites (24h)" value={delta.network} />
              </div>

              {trailing !== null ? (
                <div className="border-t border-[#e8e4dd] pt-4 text-center xl:w-[130px] xl:shrink-0 xl:border-t-0 xl:border-l xl:pt-0 xl:pl-6">
                  <p className="font-lato text-[24px] font-bold text-black">{formatCount(trailing)}</p>
                  <p className="font-lato text-[12px] font-medium text-[#7c7c7c]">behind #1</p>
                </div>
              ) : null}
            </div>
          </SurfaceCard>
        ) : null}

        <SurfaceCard className="px-2 py-5 md:px-6 md:py-6 min-h-[420px]">
          <div className="overflow-x-auto">
            <div className="min-w-[760px]">
              <div className="grid grid-cols-[70px_minmax(220px,1.6fr)_110px_110px_110px_70px] items-center gap-4 border-b border-[#eeeae3] px-3 pb-4 font-lato text-[14px] font-medium text-[#7c7c7c]">
                <span>Rank</span>
                <span>Ambassador</span>
                <span className="text-right">Invites</span>
                <span className="text-right">Network</span>
                <span className="text-right">Impact</span>
                <span />
              </div>

              {scoped.length ? (
                scoped.map((row) => {
                  const isMe = row.userId === userId;
                  const rowClass = `grid grid-cols-[70px_minmax(220px,1.6fr)_110px_110px_110px_70px] items-center gap-4 border-b border-[#eeeae3] px-3 py-4 last:border-b-0 ${
                    isMe ? "bg-[#fdf0ea]/50 hover:bg-[#fdf0ea]" : ""
                  }`;
                  const cells = (
                    <>
                      <span className="flex items-center">
                        <RankMedal rank={row.rank} />
                      </span>

                      <span className="flex min-w-0 items-center gap-3">
                        <Avatar name={row.fullName} size={36} />
                        <span className="min-w-0">
                          <span className="block truncate font-lato text-[15px] font-bold text-black">
                            {row.fullName}
                            {isMe ? " (You)" : ""}
                          </span>
                          {row.school ? (
                            <span className="block truncate font-lato text-[13px] font-medium text-[#7c7c7c]">
                              {row.school}
                            </span>
                          ) : null}
                        </span>
                      </span>

                      <span className="text-right font-lato text-[16px] font-medium text-black">
                        {formatCount(directInvitesOf(row))}
                      </span>
                      <span className="text-right font-lato text-[16px] font-medium text-black">
                        {formatCount(networkInvitesOf(row))}
                      </span>
                      <span className="text-right font-lato text-[16px] font-bold text-black">
                        {formatCount(impactOf(row))}
                      </span>

                      <span className="text-right">
                        <MovementCell direction={row.rankMovementDirection} value={row.rankMovement} />
                      </span>
                    </>
                  );

                  /* The viewer's own row opens their impact activity. */
                  return isMe ? (
                    <Link key={row.userId} href="/dashboard/ambassador/impact" className={rowClass}>
                      {cells}
                    </Link>
                  ) : (
                    <div key={row.userId} className={rowClass}>
                      {cells}
                    </div>
                  );
                })
              ) : (
                <p className="px-3 py-8 font-lato text-[14px] font-medium text-[#7c7c7c]">
                  {isLoading ? "" : "No ambassadors are ranked on this board yet."}
                </p>
              )}
            </div>
          </div>
        </SurfaceCard>
      </main>
    </AmbassadorGuard>
  );
}

function DeltaStat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="font-lato text-[13px] font-medium text-[#7c7c7c]">{label}</p>
      <p className="mt-1 font-lato text-[22px] md:text-[26px] font-bold" style={{ color: GREEN }}>
        +{formatCount(value)}
      </p>
    </div>
  );
}
