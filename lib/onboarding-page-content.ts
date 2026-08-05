import type { artboardActiveIndex } from "@/lib/design";

export type OnboardingPageKey = keyof typeof artboardActiveIndex;

export type OnboardingPageContent = {
  step: number;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: { href: string; label: string };
};

export const ONBOARDING_PAGE_CONTENT: Record<OnboardingPageKey, OnboardingPageContent> = {
  "your-school": {
    step: 2,
    eyebrow: "STEP 2 OF 6",
    title: "Your school & market",
    subtitle:
      "Help represent Bea with your peers. Our interactive waitlist experience stems from your invites.",
    cta: { href: "/prizes", label: "Claim my spot" },
  },
  prizes: {
    step: 3,
    eyebrow: "STEP 3 OF 6",
    title: "Three ways to win",
    subtitle:
      "The competition period will last for one week. Winners will be determined by app downloads upon launch.",
    cta: { href: "/account", label: "Continue" },
  },
  account: {
    step: 4,
    eyebrow: "STEP 4 OF 6",
    title: "Create your account",
    subtitle: "Build your profile, track your impact, and climb the leaderboard.",
    cta: { href: "/invites", label: "Create account" },
  },
  invites: {
    step: 5,
    eyebrow: "STEP 5 OF 6",
    title: "Everyone counts. Your network creates your impact",
    subtitle:
      "The people you invite count. The people they invite count too. Grow the largest network and climb the leaderboard.",
    cta: { href: "/youre-in", label: "Continue" },
  },
  "youre-in": {
    step: 6,
    eyebrow: "AMBASSADOR",
    title: "You're In.",
    subtitle: "Welcome to the waitlist experience.",
    cta: { href: "/dashboard", label: "Open Dashboard" },
  },
};

export const PRIZE_LEVEL_ROWS = [
  {
    icon: "campus" as const,
    title: "Campus Champion",
    description: "Win at your school and earn cash prizes.",
  },
  {
    icon: "market" as const,
    title: "Market Champion",
    description: "The biggest network created in your market wins.",
  },
  {
    icon: "national" as const,
    title: "National Champion",
    description: "The biggest network created across the country wins.",
  },
];

export function getMobileTitleLines(pageKey: OnboardingPageKey): string[] {
  const { title } = ONBOARDING_PAGE_CONTENT[pageKey];
  if (pageKey === "invites") {
    return ["Everyone counts.", "Your network creates", "your impact"];
  }
  return [title];
}
