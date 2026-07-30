"use client";

import { useGetAmbassadorCalendarQuery } from "@/features/api/apiSlice";
import { AmbassadorGuard, AmbassadorPageHeader, DashboardNotice, Panel } from "../_components";

export default function AmbassadorCalendarPage() {
  const { data = [], isLoading, error } = useGetAmbassadorCalendarQuery();

  return (
    <AmbassadorGuard>
      <main className="flex-1 flex flex-col gap-6 md:gap-8">
        <AmbassadorPageHeader
          title="Calendar"
          subtitle="Competition start, end, grace-period dates, onboarding, and daily prompt milestones."
        />
        {isLoading ? <DashboardNotice>Loading ambassador calendar...</DashboardNotice> : null}
        {error ? <DashboardNotice>Unable to load ambassador calendar.</DashboardNotice> : null}

        <Panel title="Events">
          <div className="flex flex-col divide-y divide-neutral-200/70">
            {data.length ? data.map((event) => (
              <div key={event.id} className="py-4 first:pt-0 last:pb-0 grid md:grid-cols-[160px_1fr_140px] gap-3 items-start">
                <span className="font-lato text-[13px] font-bold text-neutral-700">{new Date(event.date).toLocaleString()}</span>
                <div>
                  <p className="font-lato text-[15px] font-bold text-neutral-900">{event.title}</p>
                  <p className="font-lato text-[13px] font-semibold text-neutral-500 mt-1">{event.description}</p>
                </div>
                <span className="rounded-full bg-[#f2eee7] px-3 py-1 font-lato text-[11px] font-bold uppercase tracking-[0.08em] text-[#584939] justify-self-start md:justify-self-end">
                  {event.type.replaceAll("_", " ")}
                </span>
              </div>
            )) : (
              <p className="font-lato text-[13px] font-semibold text-neutral-500">No calendar events yet.</p>
            )}
          </div>
        </Panel>
      </main>
    </AmbassadorGuard>
  );
}
