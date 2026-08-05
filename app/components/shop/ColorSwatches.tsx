"use client";

import { COLOR_SWATCHES } from "@/lib/shop";

export function ColorSwatches({
  colors,
  selected,
  onSelect,
  swatchClass = "w-5 h-5",
}: {
  colors: string[];
  selected: string | null;
  onSelect: (value: string) => void;
  swatchClass?: string;
}) {
  if (colors.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      {colors.map((value) => {
        const active = selected === value;
        const swatch = COLOR_SWATCHES[value] ?? "#d4d4d4";
        return (
          <span key={value} className="relative group inline-flex">
            <button
              type="button"
              onClick={() => onSelect(value)}
              aria-label={value}
              aria-pressed={active}
              className={`${swatchClass} rounded-full border transition-all cursor-pointer ${
                active ? "ring-2 ring-offset-2 ring-[#584939] border-transparent" : "border-black/15 hover:scale-110"
              }`}
              style={{ backgroundColor: swatch }}
            />
            <span
              role="tooltip"
              className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-neutral-900 px-2 py-1 font-lato text-[11px] font-semibold text-white opacity-0 shadow-sm transition-opacity duration-100 group-hover:opacity-100"
            >
              {value}
            </span>
          </span>
        );
      })}
    </div>
  );
}
