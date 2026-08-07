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
  /* Dark tick = time already spent today; sage track = time still left. */
  const elapsed = 1 - (remaining ?? DAY_MS) / DAY_MS;
  const offset = CIRCUMFERENCE * (1 - elapsed);

  return (
    <div className="bb-dial">
      <svg className="bb-dial-svg" viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <linearGradient id="bb-dial-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9eb8a2" />
            <stop offset="100%" stopColor="#1e3a29" />
          </linearGradient>
        </defs>
        <circle
          className="bb-dial-track"
          cx="50"
          cy="50"
          r={RADIUS}
          stroke="url(#bb-dial-grad)"
        />
        {/* Top black tick mark */}
        <path
          d="M 45,3 A 47,47 0 0,1 55,3"
          fill="none"
          stroke="#000"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
      </svg>

      <div className="bb-dial-inner">
        <div className="bb-dial-readout" suppressHydrationWarning>
          <div className="bb-dial-group">
            <span className="bb-dial-time">{pad(h)}</span>
            <span className="bb-dial-unit">HRS</span>
          </div>
          <span className="bb-dial-colon" aria-hidden="true">:</span>
          <div className="bb-dial-group">
            <span className="bb-dial-time">{pad(m)}</span>
            <span className="bb-dial-unit">MIN</span>
          </div>
          <span className="bb-dial-colon" aria-hidden="true">:</span>
          <div className="bb-dial-group">
            <span className="bb-dial-time">{pad(s)}</span>
            <span className="bb-dial-unit">SEC</span>
          </div>
        </div>
        <span className="bb-sr">
          {h} hours, {m} minutes and {s} seconds left today
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={BUBBA_BRAND.bolt} alt="" className="bb-dial-bolt" />
      </div>
    </div>
  );
}
