import { WAITLIST_STEPPER } from "@/lib/waitlist-progress";
import { waitlistScaledHitStyle } from "@/lib/waitlist-scaled-hit";

type Props = {
  filledCount: number;
  designWidth: number;
};

export function WaitlistScaledProgress({ filledCount, designWidth }: Props) {
  const { top, height, trackLeft, segments, cover } = WAITLIST_STEPPER;

  let x = trackLeft;
  const bars = segments.map((seg, i) => {
    const bar = { x, width: seg.width, filled: i < filledCount };
    x += seg.width + seg.gapAfter;
    return bar;
  });

  const maskX = cover.left;
  const maskY = cover.top;

  return (
    <svg
      className="waitlist-scaled-progress-svg"
      style={waitlistScaledHitStyle(cover, designWidth)}
      viewBox={`0 0 ${cover.width} ${cover.height}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      {/* Erase static PNG stepper */}
      <rect
        x={0}
        y={0}
        width={cover.width}
        height={cover.height}
        fill={WAITLIST_STEPPER.maskBg}
      />
      {bars.map((bar, i) => (
        <rect
          key={i}
          x={bar.x - maskX}
          y={top - maskY}
          width={bar.width}
          height={height}
          fill={bar.filled ? WAITLIST_STEPPER.barActive : WAITLIST_STEPPER.barInactive}
        />
      ))}
    </svg>
  );
}
