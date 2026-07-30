import Link from "next/link";

import overlays from "@/lib/artboard-overlays.json";

import { ArtboardStepHeader } from "./ArtboardStepHeader";
import { ArtboardHeroLogo } from "./ArtboardHeroLogo";

const { width, height } = overlays;
const welcomeCta = overlays.pages.welcome.cta;

export function WelcomeDesktop() {
  return (
    <div className="onboarding-artboard-viewport">
      <div className="onboarding-artboard-canvas artboard-stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/artboards/welcome.png"
          alt="Welcome to Campus launch"
          width={width}
          height={height}
          draggable={false}
          style={{ width, height, display: "block", userSelect: "none" }}
        />

        <ArtboardStepHeader activeIndex={0} variant="welcome" />
        <ArtboardHeroLogo />

        <Link
          href={welcomeCta.href}
          aria-label={welcomeCta.label}
          className="artboard-hit"
          style={{
            left: welcomeCta.left,
            top: welcomeCta.top,
            width: welcomeCta.width,
            height: welcomeCta.height,
          }}
        />
      </div>
    </div>
  );
}
