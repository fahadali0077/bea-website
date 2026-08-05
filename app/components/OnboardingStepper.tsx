import Link from "next/link";

import { ONBOARDING_STEPS } from "@/lib/onboarding-steps";
import { fontAptos } from "@/lib/design";

export type StepperLayout = "mobile" | "pixel";

type Props = {
  activeIndex: number;
  layout?: StepperLayout;
};

export function OnboardingStepper({ activeIndex, layout = "pixel" }: Props) {
  const active = ONBOARDING_STEPS[activeIndex];
  const progress = ((activeIndex + 1) / ONBOARDING_STEPS.length) * 100;

  if (layout === "pixel") {
    return (
      <nav
        className="artboard-stepper"
        style={{ fontFamily: fontAptos }}
        aria-label="Onboarding progress"
      >
        {ONBOARDING_STEPS.map((step, i) => {
          const isActive = i === activeIndex;
          return (
            <Link
              key={step.label}
              href={step.href}
              className="artboard-step"
              style={{ left: step.left, top: step.top }}
            >
              <span
                className={
                  "artboard-step-circle" + (isActive ? " artboard-step-circle--active" : "")
                }
              >
                {i + 1}
              </span>
              <span
                className={
                  "artboard-step-label" + (isActive ? " artboard-step-label--active" : "")
                }
              >
                {step.label}
              </span>
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <div
      className="onboarding-compact-stepper relative z-10 border-b bg-[#f8f3ef] px-5 py-4 sm:px-6"
      style={{ borderColor: "#edeceb", fontFamily: fontAptos }}
      aria-label="Onboarding progress"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <p className="shrink-0 text-[11px] font-medium uppercase tracking-[0.14em] text-[#9a9490]">
          Step {activeIndex + 1} of {ONBOARDING_STEPS.length}
        </p>
        <p className="text-[13px] font-semibold leading-snug text-[#1a1a1a] sm:max-w-[58%] sm:text-right">
          {active?.label}
        </p>
      </div>

      <div
        className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-[#e8e4df]"
        role="progressbar"
        aria-valuenow={activeIndex + 1}
        aria-valuemin={1}
        aria-valuemax={ONBOARDING_STEPS.length}
        aria-label={`Onboarding step ${activeIndex + 1}: ${active?.label}`}
      >
        <div
          className="onboarding-progress-fill h-full rounded-full bg-[#c48b58]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ol className="mt-4 flex items-center justify-between gap-1">
        {ONBOARDING_STEPS.map((step, i) => {
          const isActive = i === activeIndex;
          const isComplete = i < activeIndex;
          return (
            <li key={step.label} className="flex flex-1 justify-center">
              <Link
                href={step.href}
                className="group flex flex-col items-center gap-1.5"
                aria-label={step.label}
                aria-current={isActive ? "step" : undefined}
              >
                <span
                  className={
                    "inline-flex h-[26px] w-[26px] items-center justify-center rounded-full text-[11px] font-semibold transition-colors" +
                    (isActive
                      ? " bg-white border border-[#e8e4df] text-[#c48b58] shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
                      : isComplete
                        ? " bg-[#f5ebe4]/60 text-[#c48b58] border border-[#e2d5cb]/50"
                        : " border border-[#dcd8d3] text-[#c5c1bd]")
                  }
                >
                  {i + 1}
                </span>
                    <span
                      className={
                        "hidden max-w-[4.5rem] text-center text-[10px] leading-snug sm:block" +
                        (isActive ? " font-semibold text-[#1a1a1a]" : " text-[#c5c1bd]")
                      }
                    >
                      {step.label}
                    </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
