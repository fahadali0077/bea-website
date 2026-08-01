"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Palette for initial-only avatars. Muted tones drawn from the brand's warm
 * neutrals so a wall of avatars stays calm rather than looking like a chart.
 */
const AVATAR_COLOURS = [
  { bg: "#1f4d3a", fg: "#ffffff" }, // forest green
  { bg: "#5c6fae", fg: "#ffffff" }, // atlantic blue
  { bg: "#584939", fg: "#ffffff" }, // bark
  { bg: "#8a6a4f", fg: "#ffffff" }, // clay
  { bg: "#7c7f6b", fg: "#ffffff" }, // olive
  { bg: "#a8574a", fg: "#ffffff" }, // terracotta
];

/** Stable per-person colour: the same name always lands on the same swatch. */
const pickColour = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AVATAR_COLOURS[hash % AVATAR_COLOURS.length];
};

const firstInitial = (name: string) => {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  return [...trimmed][0].toUpperCase();
};

type AvatarProps = {
  name: string;
  /** Omit or pass null to render the initial fallback. */
  src?: string | null;
  /** Rendered pixel size; also drives the initial's font size. */
  size?: number;
  className?: string;
};

export function Avatar({ name, src, size = 36, className = "" }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;
  const colour = pickColour(name || "?");

  return (
    <div
      className={
        "relative rounded-full overflow-hidden border border-neutral-200/70 shrink-0 flex items-center justify-center " +
        className
      }
      style={{
        width: size,
        height: size,
        background: showImage ? "#f5f5f2" : colour.bg,
      }}
    >
      {showImage ? (
        <Image
          src={src as string}
          alt={`${name} profile avatar`}
          fill
          sizes={`${size}px`}
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span
          className="font-canela leading-none select-none"
          style={{
            color: colour.fg,
            // Optical size: initials read best at roughly 45% of the circle.
            fontSize: Math.round(size * 0.45),
            // Canela's cap height sits high; nudge down to centre it.
            transform: `translateY(${Math.round(size * 0.02)}px)`,
          }}
          aria-hidden="true"
        >
          {firstInitial(name)}
        </span>
      )}
      <span className="sr-only">{name}</span>
    </div>
  );
}