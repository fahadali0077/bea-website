import { stepRoutes } from "@/lib/design";

export type OnboardingStep = {
  label: string;
  href: (typeof stepRoutes)[number];
  left: number;
  top: number;
};

export const ONBOARDING_STEPS: OnboardingStep[] = [
  { label: "Welcome", href: "/onboarding", left: 472, top: 78 },
  { label: "The Role", href: "/the-role", left: 579, top: 78 },
  { label: "Verify Email", href: "/verify-email", left: 735, top: 78 },
  { label: "Account creation", href: "/account", left: 886, top: 78 },
  { label: "Your School", href: "/your-school", left: 1022, top: 78 },
  { label: "You're In", href: "/youre-in", left: 1139, top: 78 },
];
