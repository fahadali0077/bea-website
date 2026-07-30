"use client";

import { useGetAmbassadorLeaderboardQuery } from "@/features/api/apiSlice";
import { AmbassadorGuard, AmbassadorPageHeader, DashboardNotice, MovementBadge, Panel } from "../_components";

export default function AmbassadorLeaderboardPage() {
  const { data = [], isLoading, error } = useGetAmbassadorLeaderboardQuery();

  return (
    <AmbassadorGuard>
      <main className="flex-1 flex flex-col gap-6 md:gap-8">
        <AmbassadorPageHeader
          title="Ambassador Leaderboard"
          subtitle="Ambassador ranking is based on verified referral-network performance, separate from normal-user points."
        />

        {isLoading ? <DashboardNotice>Loading ambassador leaderboard...</DashboardNotice> : null}
        {error ? <DashboardNotice>Unable to load ambassador leaderboard.</DashboardNotice> : null}

        <Panel title="Rankings">
          <div className="overflow-x-auto">
            <div className="min-w-[1180px] divide-y divide-neutral-200/70">
              <div className="grid grid-cols-[80px_100px_1.4fr_120px_130px_110px_110px_110px_110px_100px_100px_100px] gap-4 pb-3 font-sfpro text-[12px] font-bold uppercase tracking-[0.12em] text-[#402b23]">
                <span>Rank</span>
                <span>Move</span>
                <span>Ambassador</span>
                <span>Direct</span>
                <span>Network</span>
                <span>Signups</span>
                <span>Accepted</span>
                <span>Pending</span>
                <span>Conversion</span>
                <span>Campus</span>
                <span>Market</span>
                <span>National</span>
              </div>
              {data.length ? data.map((row) => (
                <div key={row.userId} className="grid grid-cols-[80px_100px_1.4fr_120px_130px_110px_110px_110px_110px_100px_100px_100px] gap-4 py-4 items-center">
                  <span className="font-lato text-[18px] font-black text-[#054d5a]">#{row.rank}</span>
                  <MovementBadge direction={row.rankMovementDirection} value={row.rankMovement} />
                  <span className="font-lato text-[14px] font-bold text-neutral-900 truncate">{row.fullName}</span>
                  <span>{row.directInvites}</span>
                  <span>{row.totalReferralNetwork}</span>
                  <span>{row.waitlistSignups}</span>
                  <span>{row.acceptedReferrals}</span>
                  <span>{row.pendingReferrals}</span>
                  <span>{row.conversionRateAvailable && row.conversionRate !== null ? `${row.conversionRate}%` : "N/A"}</span>
                  <span>{row.campusRank ? `#${row.campusRank}` : "N/A"}</span>
                  <span>{row.marketRank ? `#${row.marketRank}` : "N/A"}</span>
                  <span>#{row.nationalAmbassadorRank}</span>
                </div>
              )) : (
                <p className="py-6 font-lato text-[13px] font-semibold text-neutral-500">No ambassador leaderboard rows yet.</p>
              )}
            </div>
          </div>
        </Panel>
      </main>
    </AmbassadorGuard>
  );
}
