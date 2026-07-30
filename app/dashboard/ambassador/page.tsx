"use client";

import Link from "next/link";

import { useGetAmbassadorDashboardQuery } from "@/features/api/apiSlice";
import { AmbassadorGuard, AmbassadorPageHeader, DashboardNotice, MetricCard, MovementBadge, Panel, StatusPill } from "./_components";

const shortcuts = [
  { href: "/dashboard/ambassador/network", label: "Referral Network" },
  { href: "/dashboard/ambassador/leaderboard", label: "Leaderboard" },
  { href: "/dashboard/ambassador/calendar", label: "Calendar" },
  { href: "/dashboard/ambassador/prizes", label: "Prizes" },
  { href: "/dashboard/ambassador/rules", label: "Rules" },
];

export default function AmbassadorOverviewPage() {
  const { data, isLoading, error } = useGetAmbassadorDashboardQuery();

  return (
    <AmbassadorGuard>
      <main className="flex-1 flex flex-col gap-6 md:gap-8">
        <AmbassadorPageHeader
          title="Ambassador Overview"
          subtitle="Track your referral-network performance, competition standing, recent activity, and prize progress."
        />

        {isLoading ? <DashboardNotice>Loading ambassador overview...</DashboardNotice> : null}
        {error ? <DashboardNotice>Ambassador dashboard is unavailable for this account.</DashboardNotice> : null}

        {data ? (
          <>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              <MetricCard label="National Rank" value={data.overview.rank ? `#${data.overview.rank}` : "New"} note={data.overview.rankMovementLabel} />
              <MetricCard label="Rank Movement" value={<MovementBadge direction={data.overview.rankMovementDirection} value={data.overview.rankMovement} />} />
              <MetricCard label="Direct Referrals" value={data.overview.directInvites} note="Completed direct referrals" />
              <MetricCard label="Total Network" value={data.overview.totalReferralNetwork} note="Completed downstream signups" />
              <MetricCard label="Completed Signups" value={data.overview.completedSignups} />
              <MetricCard label="Pending Referrals" value={data.overview.pendingReferrals} note="Visible, excluded from ranking" />
              <MetricCard label="Prize Progress" value={`${data.overview.prizeProgress.unlocked}/${data.overview.prizeProgress.total}`} note="Unlocked ambassador prizes" />
              <MetricCard label="Referral Link" value="Copy" note={data.user.referralLink.replace(/^https?:\/\//, "")} />
            </div>

            <div className="grid xl:grid-cols-[1.4fr_1fr] gap-5">
              <Panel title="Recent Activity" action={{ href: "/dashboard/ambassador/network", label: "View network" }}>
                <div className="flex flex-col divide-y divide-neutral-200/70">
                  {data.recentActivity.length ? data.recentActivity.map((activity) => (
                    <div key={activity.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-lato text-[14px] font-bold text-neutral-900 truncate">{activity.fullName}</p>
                        <p className="font-lato text-[12px] font-semibold text-neutral-500 truncate">
                          {activity.maskedEmail ?? "Email hidden"} / depth {activity.referralDepth}
                        </p>
                      </div>
                      <StatusPill status={activity.status} />
                    </div>
                  )) : (
                    <p className="font-lato text-[13px] font-semibold text-neutral-500">No referral activity yet.</p>
                  )}
                </div>
              </Panel>

              <Panel title="Shortcuts">
                <div className="grid grid-cols-1 gap-2">
                  {shortcuts.map((shortcut) => (
                    <Link
                      key={shortcut.href}
                      href={shortcut.href}
                      className="rounded-[8px] border border-neutral-200/70 bg-white px-4 py-3 font-lato text-[13px] font-bold text-neutral-800 hover:bg-[#f2eee7]"
                    >
                      {shortcut.label}
                    </Link>
                  ))}
                </div>
              </Panel>
            </div>
          </>
        ) : null}
      </main>
    </AmbassadorGuard>
  );
}
