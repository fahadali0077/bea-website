// Tracks how far a person has legitimately progressed through the six-step
// ambassador onboarding flow, so someone can't skip ahead by typing a later
// step's URL directly. Order matters — index position is the "stage".
export const ONBOARDING_STEPS = [
  "onboarding",
  "the-role",
  "verify-email",
  "account",
  "your-school",
  "youre-in",
] as const;

export type OnboardingStepId = (typeof ONBOARDING_STEPS)[number];

const STAGE_KEY = "ambassador_onboarding_stage";

/** The furthest step index the person has legitimately reached (0 = Welcome). */
export function getReachedStepIndex(): number {
  if (typeof window === "undefined") return 0;
  const raw = sessionStorage.getItem(STAGE_KEY);
  const parsed = raw ? Number(raw) : 0;
  return Number.isFinite(parsed) ? parsed : 0;
}

/** Records that the person has reached `step` — never moves the stage backward. */
export function markStepReached(step: OnboardingStepId) {
  if (typeof window === "undefined") return;
  const index = ONBOARDING_STEPS.indexOf(step);
  if (index < 0) return;
  if (index > getReachedStepIndex()) {
    sessionStorage.setItem(STAGE_KEY, String(index));
  }
}

/** Maps a pathname like "/your-school" to its step index, or -1 if unrecognized. */
export function stepIndexFromPath(pathname: string): number {
  const clean = pathname.replace(/^\//, "").split("?")[0].split("/")[0];
  return ONBOARDING_STEPS.indexOf(clean as OnboardingStepId);
}

export function resetOnboardingProgress() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STAGE_KEY);
}