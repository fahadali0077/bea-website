import { LAUNCH_TOTAL_STEPS } from "@/lib/launch";

export function LaunchStepper({ currentStep }: { currentStep: number }) {
  const steps = Array.from({ length: LAUNCH_TOTAL_STEPS }, (_, i) => i + 1);

  return (
    <div className="launch-step-dots" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={LAUNCH_TOTAL_STEPS}>
      {steps.map((step, i) => (
        <div className="launch-step-dots-segment" key={step}>
          <span className={`launch-step-dot ${step <= currentStep ? "is-filled" : ""}`} />
          {i < steps.length - 1 && (
            <span className={`launch-step-dots-line ${step < currentStep ? "is-filled" : ""}`} />
          )}
        </div>
      ))}
    </div>
  );
}
