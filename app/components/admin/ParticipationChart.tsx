"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export type DailyMetric = {
  date: string;
  signups: number;
  active: number;
  participation?: number;
  referrals?: number;
  points?: number;
};

type RangeOption = { value: number; label: string };

const RANGES: RangeOption[] = [
  { value: 7, label: "Last 7 days" },
  { value: 14, label: "Last 14 days" },
  { value: 30, label: "Last 30 days" },
  { value: 90, label: "Last 90 days" },
];

const SERIES = [
  { key: "signups", label: "Waitlist signups", color: "#c48b58" },
  { key: "active", label: "Active users", color: "#3d7a6e" },
  { key: "participation", label: "Participation", color: "#5b6b7d" },
  { key: "referrals", label: "Referrals", color: "#8a6a3f" },
  { key: "points", label: "Points", color: "#b0453a" },
] as const;

type SeriesKey = (typeof SERIES)[number]["key"];

const labelFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

function formatLabel(date: string) {
  return labelFmt.format(new Date(`${date}T00:00:00`));
}

function ChartTooltip({ active, payload, label }: {
  active?: boolean;
  label?: string;
  payload?: Array<{ dataKey: string; value: number; color: string }>;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-neutral-200/70 rounded-[8px] shadow-[0_8px_24px_rgba(0,0,0,0.1)] px-3 py-2">
      <p className="font-lato text-[12px] font-bold text-neutral-800 mb-1">{label ? formatLabel(label) : ""}</p>
      {payload.map((entry) => {
        const series = SERIES.find((s) => s.key === entry.dataKey);
        return (
          <p key={entry.dataKey} className="font-lato text-[12px] font-medium text-neutral-600 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            {series?.label}: <span className="font-bold text-neutral-800">{entry.value.toLocaleString()}</span>
          </p>
        );
      })}
    </div>
  );
}

export function ParticipationChart({ data }: { data: DailyMetric[] }) {
  const [range, setRange] = useState(7);
  const [hidden, setHidden] = useState<Set<SeriesKey>>(new Set());

  const sliced = useMemo(() => data.slice(-range), [data, range]);

  const toggle = (key: SeriesKey) => {
    setHidden((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          {SERIES.map((series) => {
            const isHidden = hidden.has(series.key);
            return (
              <button
                key={series.key}
                type="button"
                onClick={() => toggle(series.key)}
                className={`flex items-center gap-2 font-lato text-[13px] font-semibold transition-opacity cursor-pointer ${isHidden ? "opacity-40" : "opacity-100"}`}
              >
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: series.color }} />
                {series.label}
              </button>
            );
          })}
        </div>
        <select
          value={range}
          onChange={(e) => setRange(Number(e.target.value))}
          className="self-start sm:self-auto font-lato text-[13px] font-medium text-neutral-700 bg-white border border-neutral-200/70 rounded-[8px] px-3 py-2 cursor-pointer focus:outline-none focus:border-neutral-400 transition-colors"
          aria-label="Select time range"
        >
          {RANGES.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sliced} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ece7e0" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatLabel}
              tick={{ fontSize: 11, fill: "#9a9490" }}
              tickLine={false}
              axisLine={{ stroke: "#e3ded6" }}
              minTickGap={range > 30 ? 24 : 8}
            />
            <YAxis tick={{ fontSize: 11, fill: "#9a9490" }} tickLine={false} axisLine={false} width={44} />
            <Tooltip content={<ChartTooltip />} />
            {SERIES.map((series) => (
              <Line
                key={series.key}
                type="monotone"
                dataKey={series.key}
                stroke={series.color}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
                hide={hidden.has(series.key)}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
