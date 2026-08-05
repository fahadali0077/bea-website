"use client";

import { useEffect, useState } from "react";

import { BUBBA_BRAND } from "@/lib/bubba-content";

const DAY_MS = 24 * 60 * 60 * 1000;
const RADIUS = 47;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function msLeftToday() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}

function split(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    h: Math.floor(total / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Counts down the hours left in the visitor's own day — the product thesis
 * rendered literally. Rendered blank on the server so the first paint can't
 * disagree with the client's clock.
 */
export function BubbaDial() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    setRemaining(msLeftToday());
    const id = window.setInterval(() => setRemaining(msLeftToday()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const { h, m, s } = split(remaining ?? DAY_MS);
  const fraction = (remaining ?? DAY_MS) / DAY_MS;
  const offset = CIRCUMFERENCE * (1 - fraction);
  const readout = `${pad(h)}:${pad(m)}:${pad(s)}`;

  return (
    <div className="bb-dial">
      <svg className="bb-dial-svg" viewBox="0 0 100 100" aria-hidden="true">
        <circle className="bb-dial-track" cx="50" cy="50" r={RADIUS} />
        <circle
          className="bb-dial-arc"
          cx="50"
          cy="50"
          r={RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
        />
      </svg>

      <div className="bb-dial-inner">
        <span className="bb-dial-time" suppressHydrationWarning>
          {readout}
        </span>
        <span className="bb-sr">
          {h} hours, {m} minutes and {s} seconds left today
        </span>
        <div className="bb-dial-units" aria-hidden="true">
          <span>HRS</span>
          <span>MIN</span>
          <span>SEC</span>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={BUBBA_BRAND.bolt} alt="" className="bb-dial-bolt" />
      </div>
    </div>
  );
}
