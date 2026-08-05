"use client";

import { usePathname } from "next/navigation";

import { LAUNCH_STEP_ROUTES } from "@/lib/launch";
import { LaunchStepper } from "./LaunchStepper";

export function LaunchHeader() {
  const pathname = usePathname();
  const stepIndex = LAUNCH_STEP_ROUTES.findIndex((route) => route === pathname);
  const currentStep = stepIndex === -1 ? 1 : stepIndex + 1;

  return (
    <header className="launch-header">
      <div className="launch-header-inner">
        <span className="launch-header-brand font-canela onboarding-heading">
          <span className="hidden md:inline">Bubba</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/4x/BubbaLogo.png" alt="Bubba" className="md:hidden" style={{ display: "block", width: "auto", height: 25 }} />
        </span>
        <LaunchStepper currentStep={currentStep} />
      </div>
    </header>
  );
}
