"use client";

import { useGetAmbassadorDashboardQuery } from "@/features/api/apiSlice";
import { AmbassadorGuard, AmbassadorPageHeader, DashboardNotice, Panel } from "../_components";

export default function AmbassadorPrizesPage() {
  const { data, isLoading, error } = useGetAmbassadorDashboardQuery();
  const prizes = data?.prizes ?? [];

  return (
    <AmbassadorGuard>
      <main className="flex-1 flex flex-col gap-6 md:gap-8">
        <AmbassadorPageHeader
          title="Ambassador Prizes"
          subtitle="Ambassador prizes use the shared rewards system with ambassador-specific eligibility."
        />
        {isLoading ? <DashboardNotice>Loading ambassador prizes...</DashboardNotice> : null}
        {error ? <DashboardNotice>Unable to load ambassador prizes.</DashboardNotice> : null}

        <Panel title="Prize Progress">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {prizes.length ? prizes.map((prize) => (
              <div key={prize.id} className="rounded-[10px] border border-neutral-200/70 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-lato text-[15px] font-black text-neutral-900">{prize.title}</p>
                    {prize.description ? <p className="mt-1 font-lato text-[12px] font-semibold text-neutral-500">{prize.description}</p> : null}
                  </div>
                  <span className="rounded-full bg-[#f2eee7] px-2.5 py-1 font-lato text-[11px] font-bold uppercase text-[#584939]">
                    {prize.unlockStatus}
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  <Progress label="Completed signups" current={prize.progress.completedSignups.current} required={prize.progress.completedSignups.required} percent={prize.progress.completedSignups.percent} />
                  <Progress label="Rank" current={prize.progress.rank.current ?? "N/A"} required={prize.progress.rank.required ?? "N/A"} percent={prize.progress.rank.percent} />
                </div>
              </div>
            )) : (
              <p className="font-lato text-[13px] font-semibold text-neutral-500">No ambassador prizes are active yet.</p>
            )}
          </div>
        </Panel>
      </main>
    </AmbassadorGuard>
  );
}

function Progress({ label, current, required, percent }: { label: string; current: string | number; required: string | number; percent: number }) {
  return (
    <div>
      <div className="flex justify-between gap-3 font-lato text-[12px] font-bold text-neutral-600">
        <span>{label}</span>
        <span>{current} / {required}</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-neutral-100">
        <div className="h-full rounded-full bg-[#584939]" style={{ width: `${Math.min(percent, 100)}%` }} />
      </div>
    </div>
  );
}
