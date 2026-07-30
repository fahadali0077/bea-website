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
        <span className="launch-header-brand font-canela onboarding-heading">Bubba</span>
        <LaunchStepper currentStep={currentStep} />
      </div>
    </header>
  );
}
