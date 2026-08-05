import Link from "next/link";
import overlays from "@/lib/artboard-overlays.json";

export function ArtboardHeroLogo() {
  const { left, top, width, height } = overlays.heroLogo;

  return (
    <Link
      href="/onboarding"
      className="artboard-hero-logo-hit artboard-hit"
      style={{ left, top, width, height }}
      aria-label="bea home"
    />
  );
}
