"use client";

import { GraduationCap, MapPin, Send, TrendingUp, UserPlus, Gift } from "lucide-react";

import {
  HOW_IT_WORKS,
  PRIZE_FINE_PRINT,
  PRIZE_TIERS,
  TOTAL_PRIZE_POOL,
  TOTAL_WINNERS,
} from "@/lib/ambassador-prizes";
import { AmbassadorGuard } from "../_components";
import { CAMPUS_GREEN, Eyebrow, GOLD, MAROON, SurfaceCard, TEAL } from "../_ui";

const NATIONAL = PRIZE_TIERS.find((tier) => tier.scope === "national")!;
const MARKET = PRIZE_TIERS.find((tier) => tier.scope === "market")!;
const CAMPUS = PRIZE_TIERS.find((tier) => tier.scope === "campus")!;

/** Each place on the national ladder carries its own colour in the artboard. */
const NATIONAL_COLOURS = [GOLD, TEAL, MAROON];

const HOW_IT_WORKS_ICONS = [
  <Send key="share" className="size-5" />,
  <UserPlus key="signup" className="size-5" />,
  <TrendingUp key="climb" className="size-5" />,
  <Gift key="win" className="size-5" />,
];

export default function AmbassadorPrizesPage() {
  return (
    <AmbassadorGuard>
      <main className="flex-1 flex flex-col gap-5 md:gap-6 min-w-0">
        <div className="grid gap-5 lg:grid-cols-[1fr_360px] lg:items-start">
          <div>
            <h1 className="font-canela text-[30px] md:text-[46px] leading-tight tracking-[0.01em] text-black">
              Prizes
            </h1>
            <p className="mt-2 font-lato text-[15px] md:text-[17px] font-medium leading-relaxed text-[#7c7c7c]">
              Amazing rewards for the top ambassadors.
              <br />
              Three levels of prizes, simultaneously.
            </p>
            <p className="mt-3 font-lato text-[12px] font-medium text-[#9a948d]">
              *Note: Ambassadors can invite friends outside their campus, all count.
            </p>
          </div>

          <SurfaceCard className="px-6 py-6 text-center">
            <Eyebrow>Total prize pool</Eyebrow>
            <p className="mt-2 font-canela text-[38px] md:text-[44px] leading-none" style={{ color: TEAL }}>
              {TOTAL_PRIZE_POOL}
            </p>
            <p className="mt-3 font-lato text-[11px] font-bold uppercase tracking-[0.14em] text-[#6f6a63]">
              Cash &amp; merch prizes
            </p>
            <p
              className="mt-1 font-lato text-[11px] font-bold uppercase tracking-[0.14em]"
              style={{ color: "#a9743f" }}
            >
              {TOTAL_WINNERS}
            </p>
          </SurfaceCard>
        </div>

        <SurfaceCard className="px-6 py-6 md:px-8 md:py-7">
          <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:items-center">
            <div>
              <Eyebrow>{NATIONAL.eyebrow}</Eyebrow>
              <h2 className="mt-2 font-canela text-[26px] md:text-[30px] leading-tight text-black">
                National
                <br />
                Winners
              </h2>
              <p className="mt-2 font-lato text-[14px] md:text-[15px] font-medium leading-snug text-[#7c7c7c]">
                Top performers across
                <br />
                the nation
              </p>
            </div>

            <div className="grid grid-cols-1 divide-y divide-[#e8e4dd] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {NATIONAL.places.map((place, index) => (
                <div key={place.place} className="px-0 py-4 text-center sm:px-4 sm:py-0">
                  <p className="font-lato text-[11px] font-bold uppercase tracking-[0.14em] text-[#6f6a63]">
                    {place.place}
                  </p>
                  <p
                    className="mt-2 font-canela text-[26px] md:text-[30px] leading-none"
                    style={{ color: NATIONAL_COLOURS[index] }}
                  >
                    {place.amount}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </SurfaceCard>

        <div className="grid gap-5 lg:grid-cols-2">
          <TierCard
            icon={<MapPin className="size-5" />}
            tone="#e6eeee"
            title={MARKET.title}
            places={MARKET.places}
            colour={TEAL}
            blurb={MARKET.blurb}
          />
          <TierCard
            icon={<GraduationCap className="size-5" />}
            tone="#eaeee1"
            title={CAMPUS.title}
            places={CAMPUS.places}
            colour={CAMPUS_GREEN}
            blurb={CAMPUS.blurb}
          />
        </div>

        <SurfaceCard className="px-6 py-5">
          {PRIZE_FINE_PRINT.map((line) => (
            <p key={line} className="font-lato text-[13px] font-medium leading-relaxed text-[#4a4741]">
              {line}
            </p>
          ))}
        </SurfaceCard>

        <SurfaceCard className="px-6 py-6 md:px-8">
          <h2 className="font-canela text-[24px] md:text-[26px] text-black">How it works</h2>

          <div className="mt-5 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {HOW_IT_WORKS.map((step, index) => (
              <div key={step.title} className="flex items-start gap-3.5">
                <span
                  className="grid size-[42px] shrink-0 place-items-center rounded-full"
                  style={{ backgroundColor: step.tone, color: "#3f3b36" }}
                >
                  {HOW_IT_WORKS_ICONS[index]}
                </span>
                <span>
                  <p className="font-lato text-[14px] font-bold text-black">{step.title}</p>
                  <p className="mt-1 font-lato text-[13px] font-medium leading-snug text-[#7c7c7c]">
                    {step.description}
                  </p>
                </span>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </main>
    </AmbassadorGuard>
  );
}

function TierCard({
  icon,
  tone,
  title,
  places,
  colour,
  blurb,
}: {
  icon: React.ReactNode;
  tone: string;
  title: string;
  places: Array<{ place: string; amount: string }>;
  colour: string;
  blurb: string;
}) {
  return (
    <SurfaceCard className="px-6 py-6">
      <div className="flex items-center gap-3">
        <span
          className="grid size-[38px] shrink-0 place-items-center rounded-full"
          style={{ backgroundColor: tone, color: "#3f3b36" }}
        >
          {icon}
        </span>
        <p className="font-lato text-[12px] font-bold uppercase tracking-[0.14em] text-[#4a4741]">{title}</p>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {places.map((place) => (
          <div key={place.place}>
            <p className="font-lato text-[11px] font-bold uppercase tracking-[0.12em] text-[#6f6a63]">
              {place.place}
            </p>
            <p className="mt-1.5 font-canela text-[22px] md:text-[25px] leading-none" style={{ color: colour }}>
              {place.amount}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-5 font-lato text-[14px] font-medium text-[#7c7c7c]">{blurb}</p>
    </SurfaceCard>
  );
}
