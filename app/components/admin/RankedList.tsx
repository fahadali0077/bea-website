"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SlideOver } from "@/app/components/admin/SlideOver";

export type RankedItem = { label: string; value: number };
type RankedRow = RankedItem & { rank: number };

const INLINE_LIMIT = 8;

function RankRow({ item, max, unit }: { item: RankedRow; max: number; unit?: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-sfpro text-[12px] font-bold text-neutral-400 w-5 text-right shrink-0">{item.rank}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-lato text-[13px] font-semibold text-neutral-700 truncate">{item.label}</span>
          <span className="font-lato text-[13px] font-bold text-neutral-800 shrink-0">
            {item.value.toLocaleString()}
            {unit ? <span className="text-neutral-400 font-medium"> {unit}</span> : null}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-[#efebe5] overflow-hidden mt-1.5">
          <div className="h-full rounded-full bg-[#c48b58]" style={{ width: `${(item.value / max) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}

function SearchBox({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" strokeWidth={2} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search…"
        className="w-full font-lato text-[13px] text-neutral-800 bg-white border border-neutral-200/70 rounded-[8px] pl-9 pr-3 py-2 focus:outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
      />
    </div>
  );
}

function FullList({ ranked, max, unit }: { ranked: RankedRow[]; max: number; unit?: string }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? ranked.filter((i) => i.label.toLowerCase().includes(q)) : ranked;
  }, [ranked, query]);

  return (
    <div className="flex flex-col gap-4">
      <SearchBox value={query} onChange={setQuery} />
      <div className="flex flex-col gap-3.5">
        {filtered.length === 0 ? (
          <p className="font-lato text-[13px] font-medium text-neutral-400 py-2">No matches.</p>
        ) : (
          filtered.map((item) => <RankRow key={item.label} item={item} max={max} unit={unit} />)
        )}
      </div>
    </div>
  );
}

export function RankedList({
  items,
  unit,
  title = "All results",
}: {
  items: RankedItem[];
  unit?: string;
  title?: string;
}) {
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const ranked = useMemo<RankedRow[]>(
    () => [...items].sort((a, b) => b.value - a.value).map((item, index) => ({ ...item, rank: index + 1 })),
    [items],
  );

  const max = Math.max(1, ...items.map((i) => i.value));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? ranked.filter((i) => i.label.toLowerCase().includes(q)) : ranked;
  }, [ranked, query]);

  const inline = filtered.slice(0, INLINE_LIMIT);
  const hasMore = items.length > INLINE_LIMIT;

  return (
    <div className="flex flex-col gap-3">
      <SearchBox value={query} onChange={setQuery} />

      <div className="flex flex-col gap-3.5">
        {inline.length === 0 ? (
          <p className="font-lato text-[13px] font-medium text-neutral-400 py-2">No matches.</p>
        ) : (
          inline.map((item) => <RankRow key={item.label} item={item} max={max} unit={unit} />)
        )}
      </div>

      <div className="flex items-center justify-between gap-3 pt-2 border-t border-neutral-200/40">
        <span className="font-lato text-[12px] font-medium text-neutral-400">
          {query.trim() ? `${filtered.length} of ${items.length}` : `${items.length} total`}
        </span>
        {hasMore && (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="font-lato text-[12px] font-semibold text-[#584939] underline underline-offset-2 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            View all
          </button>
        )}
      </div>

      {showAll && (
        <SlideOver
          onClose={() => setShowAll(false)}
          header={
            <div>
              <p className="font-canela text-[20px] font-medium text-neutral-900 leading-tight">{title}</p>
              <p className="font-lato text-[13px] font-medium text-neutral-500 mt-0.5">{items.length} total</p>
            </div>
          }
        >
          <FullList ranked={ranked} max={max} unit={unit} />
        </SlideOver>
      )}
    </div>
  );
}
