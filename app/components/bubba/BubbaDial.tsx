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
            <stop offset="0%" stopColor="#ADC3A5" stopOpacity="1" />
            <stop offset="47%" stopColor="#6F8670" stopOpacity="1" />
            <stop offset="100%" stopColor="#2C4433" stopOpacity="1" />
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
          strokeWidth="2.2"
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
        {/*<img src={BUBBA_BRAND.bolt} alt="" className="bb-dial-bolt" />*/}
        <svg width="28" height="42" className="bb-dial-bolt" viewBox="0 0 28 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.44551 41.87C9.28551 41.87 9.11545 41.84 8.95545 41.77C8.40545 41.53 8.1055 40.9301 8.2555 40.3501L12.4055 23.65H1.22547C0.825474 23.65 0.445464 23.45 0.215464 23.12C-0.0145362 22.79 -0.0645411 22.36 0.0854589 21.98L8.28547 0.780029C8.46547 0.310029 8.92549 0 9.42549 0H20.7055C21.1155 0 21.5055 0.210059 21.7355 0.560059C21.9655 0.910059 21.9955 1.35009 21.8355 1.72009L16.9755 12.74H26.5754C27.0254 12.74 27.4355 12.98 27.6555 13.38C27.8755 13.78 27.8555 14.25 27.6155 14.63L10.4855 41.3101C10.2555 41.6701 9.85545 41.87 9.45545 41.87H9.44551Z" fill="#294431"/>
        </svg>

      </div>
    </div>
  );
}
