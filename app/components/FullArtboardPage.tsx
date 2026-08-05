import Link from "next/link";

import overlays from "@/lib/artboard-overlays.json";

import { artboardActiveIndex } from "@/lib/design";

import { ArtboardStepHeader } from "./ArtboardStepHeader";
import { MobileNav } from "./MobileNav";
import { OnboardingMobilePage } from "./OnboardingMobilePage";
import { OnboardingStepper } from "./OnboardingStepper";

export type Rect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type OverlayLink = Rect & {
  href: string;
  label: string;
};

type Props = {
  pageKey: Exclude<keyof typeof overlays.pages, "welcome">;
  children?: React.ReactNode;
};

export function FullArtboardPage({ pageKey, children }: Props) {
  const { width, height } = overlays;
  const page = overlays.pages[pageKey];
  const activeIndex = artboardActiveIndex[pageKey];
  const hitLinks: OverlayLink[] = page.cta ? [page.cta] : [];

  return (
    <>
      {/* ── Phones only: login-style layout (never scaled artboard) ── */}
      <div className="onboarding-page-mobile">
        <MobileNav activeIndex={activeIndex} />
        {pageKey !== "youre-in" && (
          <OnboardingStepper activeIndex={activeIndex} layout="mobile" />
        )}
        <OnboardingMobilePage pageKey={pageKey} />
      </div>

      {/* ── Tablet + laptop + desktop: original artboard PNG ── */}
      <div className="onboarding-page-desktop">
        <div className="onboarding-artboard-viewport">
          <div className="onboarding-artboard-canvas artboard-stage">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={page.src}
              alt=""
              width={width}
              height={height}
              draggable={false}
              style={{ width, height, display: "block", userSelect: "none" }}
            />

            <ArtboardStepHeader
              activeIndex={activeIndex}
              showStepper={pageKey !== "youre-in"}
            />

            {hitLinks.map((link) => (
              <Link
                key={`${link.label}-${link.href}`}
                href={link.href}
                aria-label={link.label}
                className="artboard-hit"
                style={{
                  left: link.left,
                  top: link.top,
                  width: link.width,
                  height: link.height,
                }}
              />
            ))}

            {children}
          </div>
        </div>
      </div>
    </>
  );
}
