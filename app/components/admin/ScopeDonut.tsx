"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

export type DonutSlice = { label: string; value: number; color: string };

export function ScopeDonut({ data }: { data: DonutSlice[] }) {
  const total = data.reduce((sum, slice) => sum + slice.value, 0);

  if (total === 0) {
    return <p className="font-lato text-[13px] font-medium text-neutral-400 py-2">No data yet.</p>;
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 py-2">
      <div className="relative h-[300px] w-full max-w-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="label" innerRadius={92} outerRadius={132} paddingAngle={2} stroke="none">
              {data.map((slice) => (
                <Cell key={slice.label} fill={slice.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${Number(value).toLocaleString()} events`, String(name)]}
              contentStyle={{ borderRadius: 8, border: "1px solid #e3ded6", fontSize: 12, fontFamily: "var(--font-lato)" }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-lato text-[32px] font-bold text-neutral-800 leading-none">{total.toLocaleString()}</span>
          <span className="font-lato text-[12px] font-medium text-neutral-400 mt-1">events</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {data.map((slice) => {
          const percent = Math.round((slice.value / total) * 100);
          return (
            <span key={slice.label} className="flex items-center gap-2 font-lato text-[13px] font-semibold text-neutral-700">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: slice.color }} />
              {slice.label}
              <span className="font-bold text-neutral-800">{slice.value.toLocaleString()}</span>
              <span className="text-neutral-400 font-medium">· {percent}%</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
