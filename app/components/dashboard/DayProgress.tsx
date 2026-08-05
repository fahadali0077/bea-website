"use client";

type DayProgressProps = {
  /** Current day, 1-based. Null when no competition is running. */
  dayNumber: number | null;
  totalDays: number;
  label: string;
};

/**
 * Header progress indicator.
 *
 * Replaces a hardcoded run of dots (one peach, a line, one black, five grey)
 * that always showed day 2 regardless of the actual competition day, at three
 * different dot sizes with uneven gaps. This renders one evenly-sized segment
 * per day and fills them from the real dayNumber.
 */
export function DayProgress({ dayNumber, totalDays, label }: DayProgressProps) {
  if (!dayNumber) {
    return (
      <span className="text-[10px] md:text-[11px] font-lato font-bold text-neutral-500 uppercase tracking-[0.14em] whitespace-nowrap">
        {label}
      </span>
    );
  }

  return (
    <div
      className="flex items-center gap-2 md:gap-3 min-w-0"
      role="progressbar"
      aria-valuenow={dayNumber}
      aria-valuemin={1}
      aria-valuemax={totalDays}
      aria-label={label}
    >
      <span className="text-[10px] md:text-[11px] font-lato font-bold text-neutral-500 uppercase tracking-[0.14em] whitespace-nowrap tabular-nums">
        Day {dayNumber}
        <span className="text-neutral-400"> / {totalDays}</span>
      </span>

      <div className="flex items-center gap-[3px] md:gap-1 shrink-0" aria-hidden="true">
        {Array.from({ length: totalDays }, (_, i) => {
          const day = i + 1;
          const done = day < dayNumber;
          const current = day === dayNumber;
          return (
            <span
              key={day}
              className={
                "h-[3px] rounded-full transition-colors " +
                (current
                  ? "w-4 md:w-5 bg-[#e8a588]"
                  : done
                    ? "w-2 md:w-2.5 bg-neutral-800"
                    : "w-2 md:w-2.5 bg-neutral-300")
              }
            />
          );
        })}
      </div>
    </div>
  );
}