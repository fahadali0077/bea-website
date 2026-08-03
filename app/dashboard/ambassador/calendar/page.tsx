"use client";

import { CirclePlay, CircleDot, Sparkles, Trophy, Zap } from "lucide-react";
import { useGetAmbassadorCalendarQuery } from "@/features/api/apiSlice";
import { AmbassadorGuard, AmbassadorPageHeader, DashboardNotice, Panel } from "../_components";

const ICON_BY_TYPE: Record<string, JSX.Element> = {
  COMPETITION_START: (
    <span className="grid size-13.5 shrink-0 place-items-center rounded-full bg-[#e6eeee]">
      <CirclePlay className="size-6.25" />
    </span>
  ),
  WAITLIST_EXPERIENCE: (
    <span className="grid size-13.5 shrink-0 place-items-center rounded-full bg-[#fdeedc]">
      <Sparkles className="size-6.25" />
    </span>
  ),
  WAITLIST_ENDS: (
    <span className="grid size-13.5 shrink-0 place-items-center rounded-full bg-[#ede7ef]">
      <CircleDot className="size-6.25" />
    </span>
  ),
  APP_LAUNCH: (
    <span className="grid size-13.5 shrink-0 place-items-center rounded-full bg-[#eaeee1]">
      <Zap className="size-6.25" />
    </span>
  ),
  COMPETITION_SCORING: (
    <span className="grid size-13.5 shrink-0 place-items-center rounded-full bg-[#ede2ea]">
      <Trophy className="size-6.25" />
    </span>
  ),
};

export default function AmbassadorCalendarPage() {
  const { data = [], isLoading, error } = useGetAmbassadorCalendarQuery();
  const formatDate = (date: string) => {
    const d = new Date(date);

    const day = d.getDate();

    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
          ? "nd"
          : day % 10 === 3 && day !== 13
            ? "rd"
            : "th";

    return `${d.toLocaleString("en-US", {
      month: "long",
    })} ${day}${suffix}, ${d.getFullYear()}`;
  };
  return (
    <AmbassadorGuard>
      <main className="flex-1 flex flex-col gap-6 md:gap-8">
        <AmbassadorPageHeader
          title="Important Dates"
          subtitle="Key dates for the waitlist competition"
        />
        {isLoading ? <DashboardNotice>Loading ambassador calendar...</DashboardNotice> : null}
        {error ? <DashboardNotice>Unable to load ambassador calendar.</DashboardNotice> : null}

        <Panel title="">
          <div className="flex flex-col divide-y divide-neutral-200/70">
            {data.length ? data.map((event) => (
              <div key={event.id} className="py-4 items-center first:pt-0 last:pb-0 grid md:grid-cols-[350px_1fr_1fr] gap-3 items-start">
                <span className="flex items-center gap-3">
                  {ICON_BY_TYPE[event.type] ?? <span className="size-13.5 shrink-0" />}
                  <span className="font-lato text-[18px] font-bold text-[#000000] ml-13.5">{formatDate(event.date)}</span>
                </span>
                <p className="font-lato text-[18px] font-medium text-[#000000]">{event.title}</p>
                <p className="font-lato text-[18px] font-medium leading-snug text-[#7F7F7F]">{event.description}</p>
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
