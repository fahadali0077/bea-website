"use client";

import { useEffect, useState, type ReactNode } from "react";

import { countdownTo, SCOPE_LABELS, type LeaderboardScope } from "@/lib/ambassador-metrics";
import type { AmbassadorRankMovementDirection } from "@/lib/api/ambassador.types";

/** Palette lifted from the dashboard artboards. */
export const INK = "#000000";
export const TEAL = "#0a4c56";
export const GREEN = "#3d8a5a";
export const RED = "#b3453a";
export const GOLD = "#bf8a22";
export const MAROON = "#93342a";
export const CAMPUS_GREEN = "#3b743d";
export const MUTED = "#7c7c7c";
export const HAIRLINE = "#e8e4dd";
export const CREAM = "#faf7f0";
export const SURFACE = "#fbfbf9";

/** The plain bordered container every panel on these screens sits in. */
export function SurfaceCard({
  children,
  className = "",
  tone = "white",
}: {
  children: ReactNode;
  className?: string;
  tone?: "white" | "cream";
}) {
  return (
    <section
      className={`rounded-[12px] border border-[#e8e4dd] ${
        tone === "cream" ? "bg-[#faf7f0]" : "bg-[#fdfdfb]"
      } ${className}`}
    >
      {children}
    </section>
  );
}

/** Small uppercase caption that heads a stat or a card. */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={`font-lato text-[11px] md:text-[12px] font-bold uppercase tracking-[0.14em] text-[#6f6a63] ${className}`}
    >
      {children}
    </p>
  );
}

/** Label over value, used across the header strips. */
export function StatBlock({
  label,
  value,
  note,
  valueClassName = "",
}: {
  label: string;
  value: ReactNode;
  note?: ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="min-w-0">
      <p className="font-lato text-[13px] md:text-[15px] font-medium text-[#7c7c7c]">{label}</p>
      <p className={`mt-1 font-lato text-[15px] md:text-[17px] font-bold text-black ${valueClassName}`}>
        {value}
      </p>
      {note ? <p className="mt-0.5 font-lato text-[12px] font-medium text-[#9a948d]">{note}</p> : null}
    </div>
  );
}

const SCOPES: LeaderboardScope[] = ["campus", "market", "national"];

/** Campus / Market / National segmented control. */
export function ScopeTabs({
  value,
  onChange,
}: {
  value: LeaderboardScope;
  onChange: (scope: LeaderboardScope) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Leaderboard scope"
      className="grid w-full max-w-[640px] grid-cols-3 overflow-hidden rounded-[10px] border border-[#e8e4dd]"
    >
      {SCOPES.map((scope, index) => {
        const active = scope === value;
        return (
          <button
            key={scope}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(scope)}
            className={`cursor-pointer py-3.5 font-lato text-[14px] md:text-[16px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a4c56]/40 ${
              index > 0 ? "border-l border-[#e8e4dd]" : ""
            } ${active ? "bg-[#fdf0ea] font-bold text-black" : "bg-white font-medium text-[#4a4741] hover:bg-[#faf7f0]"}`}
          >
            {SCOPE_LABELS[scope]}
          </button>
        );
      })}
    </div>
  );
}

const MEDALS: Record<number, { ring: string; face: string; ink: string }> = {
  1: { ring: "#c9a227", face: "#f0d47a", ink: "#6b4f0a" },
  2: { ring: "#a8adb5", face: "#dfe2e6", ink: "#4b5058" },
  3: { ring: "#a9714a", face: "#d5a173", ink: "#5c3418" },
};

/** Medal for the top three, plain numeral below that. */
export function RankMedal({ rank }: { rank: number }) {
  const medal = MEDALS[rank];

  if (!medal) {
    return <span className="font-lato text-[16px] font-bold text-[#3f3b36]">{rank}</span>;
  }

  return (
    <span
      className="grid size-[26px] place-items-center rounded-full font-lato text-[12px] font-black"
      style={{ background: medal.face, border: `1.5px solid ${medal.ring}`, color: medal.ink }}
      aria-label={`Rank ${rank}`}
    >
      {rank}
    </span>
  );
}

/** ↑2 / ↓2 / — movement indicator. */
export function MovementCell({
  direction,
  value,
  className = "",
}: {
  direction?: AmbassadorRankMovementDirection;
  value?: number;
  className?: string;
}) {
  const amount = Math.abs(value ?? 0);

  if (direction === "UP" && amount > 0) {
    return (
      <span className={`font-lato text-[15px] font-bold ${className}`} style={{ color: GREEN }}>
        ↑ {amount}
      </span>
    );
  }

  if (direction === "DOWN" && amount > 0) {
    return (
      <span className={`font-lato text-[15px] font-bold ${className}`} style={{ color: RED }}>
        ↓ {amount}
      </span>
    );
  }

  if (direction === "NEW") {
    return <span className={`font-lato text-[13px] font-bold text-[#5576ee] ${className}`}>New</span>;
  }

  return (
    <span className={`font-lato text-[15px] font-bold text-[#b8b3ac] ${className}`} aria-label="No change">
      —
    </span>
  );
}

/** Re-renders on a fixed tick so countdowns stay live. */
export function useNow(intervalMs: number): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return now;
}

/**
 * "4d 6h 5m", or "2d 14h 32m 18s" when seconds are shown. Renders nothing but a
 * dash when there is no competition end date to count down to.
 */
export function CountdownText({
  endDate,
  withSeconds = false,
  className = "",
}: {
  endDate: string | null | undefined;
  withSeconds?: boolean;
  className?: string;
}) {
  const now = useNow(withSeconds ? 1000 : 30000);
  const countdown = countdownTo(endDate, now);

  if (!countdown) {
    return <span className={className}>—</span>;
  }

  if (countdown.expired) {
    return <span className={className}>Closed</span>;
  }

  const parts = [`${countdown.days}d`, `${countdown.hours}h`, `${countdown.minutes}m`];
  if (withSeconds) parts.push(`${countdown.seconds}s`);

  return (
    <span className={className} suppressHydrationWarning>
      {parts.join(" ")}
    </span>
  );
}
