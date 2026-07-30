"use client";

import { useGetAmbassadorReferralsQuery } from "@/features/api/apiSlice";
import type { AmbassadorNetworkNode } from "@/lib/api/ambassador.types";
import { AmbassadorGuard, AmbassadorPageHeader, DashboardNotice, MetricCard, Panel, StatusPill } from "../_components";

export default function AmbassadorNetworkPage() {
  const { data, isLoading, error } = useGetAmbassadorReferralsQuery();

  return (
    <AmbassadorGuard>
      <main className="flex-1 flex flex-col gap-6 md:gap-8">
        <AmbassadorPageHeader
          title="Referral Network"
          subtitle="Review your direct referrals and full downstream network. Pending referrals are visible but excluded from ranking until verified."
        />

        {isLoading ? <DashboardNotice>Loading referral network...</DashboardNotice> : null}
        {error ? <DashboardNotice>Unable to load the ambassador referral network.</DashboardNotice> : null}

        {data ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard label="Direct Referrals" value={data.totals.directCompleted} note={`${data.totals.directPending} pending`} />
              <MetricCard label="Completed Network" value={data.totals.completed} note="Counts toward ranking" />
              <MetricCard label="Pending Network" value={data.totals.pending} note="Excluded until verified" />
              <MetricCard label="Total Visible" value={data.totals.total} note="Completed plus pending" />
            </div>

            <Panel title="Depth Totals">
              <div className="grid md:grid-cols-3 gap-3">
                {data.depthTotals.length ? data.depthTotals.map((row) => (
                  <div key={row.depth} className="rounded-[8px] border border-neutral-200/70 bg-white p-4">
                    <p className="font-lato text-[12px] font-bold uppercase tracking-[0.12em] text-neutral-500">Depth {row.depth}</p>
                    <p className="mt-2 font-lato text-[22px] font-black text-neutral-900">{row.completed}</p>
                    <p className="font-lato text-[12px] font-semibold text-neutral-400">{row.pending} pending / {row.total} total</p>
                  </div>
                )) : <p className="font-lato text-[13px] font-semibold text-neutral-500">No depth totals yet.</p>}
              </div>
            </Panel>

            <Panel title="Direct Referrals">
              <ReferralRows rows={data.directReferrals} />
            </Panel>

            <Panel title="Full Downstream Network">
              <ReferralRows rows={data.downstreamNetwork} showReferrer />
            </Panel>
          </>
        ) : null}
      </main>
    </AmbassadorGuard>
  );
}

function ReferralRows({
  rows,
  showReferrer = false,
}: {
  rows: AmbassadorNetworkNode[];
  showReferrer?: boolean;
}) {
  if (!rows.length) {
    return <p className="font-lato text-[13px] font-semibold text-neutral-500">No referrals yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[720px] divide-y divide-neutral-200/70">
        <div className="grid grid-cols-[1.3fr_1.2fr_100px_100px_1fr] gap-4 pb-3 font-sfpro text-[12px] font-bold uppercase tracking-[0.12em] text-[#402b23]">
          <span>Name</span>
          <span>Email</span>
          <span>Depth</span>
          <span>Status</span>
          <span>{showReferrer ? "Referrer" : "Joined"}</span>
        </div>
        {rows.map((row) => (
          <div key={row.id} className="grid grid-cols-[1.3fr_1.2fr_100px_100px_1fr] gap-4 py-3 items-center">
            <span className="font-lato text-[14px] font-bold text-neutral-900 truncate">{row.fullName}</span>
            <span className="font-lato text-[13px] font-semibold text-neutral-500 truncate">{row.maskedEmail ?? "Hidden"}</span>
            <span className="font-lato text-[13px] font-semibold text-neutral-700">{row.referralDepth}</span>
            <StatusPill status={row.status} />
            <span className="font-lato text-[13px] font-semibold text-neutral-500 truncate">
              {showReferrer ? row.referrerName : new Date(row.joinedAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
