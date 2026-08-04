import type { LeaderboardScope } from "@/lib/ambassador-metrics";

/**
 * The competition's prize ladder. These are fixed terms published to
 * ambassadors, not per-account data, so they live alongside the rules copy
 * rather than coming from the rewards API — the same reason the rules page
 * keeps its clauses in the file. If the ladder ever needs to change per
 * competition, this is the one place to swap for an endpoint.
 */
export type PrizePlace = {
  place: string;
  amount: string;
};

export type PrizeTier = {
  scope: LeaderboardScope;
  eyebrow: string;
  title: string;
  blurb: string;
  places: PrizePlace[];
};

export const PRIZE_TIERS: PrizeTier[] = [
  {
    scope: "national",
    eyebrow: "Ultimate stage",
    title: "National Winners",
    blurb: "Top performers across the nation",
    places: [
      { place: "1st place", amount: "$24,000" },
      { place: "2nd place", amount: "$12,000" },
      { place: "3rd place", amount: "$6,000" },
    ],
  },
  {
    scope: "market",
    eyebrow: "Market winners",
    title: "Market Winners",
    blurb: "Win in your city",
    places: [
      { place: "1st place", amount: "$2,400" },
      { place: "2nd place", amount: "$1,200" },
      { place: "3rd place", amount: "$600" },
    ],
  },
  {
    scope: "campus",
    eyebrow: "Campus winners",
    title: "Campus Winners",
    blurb: "Win on your campus",
    places: [
      { place: "1st place", amount: "$240" },
      { place: "2nd place", amount: "$120" },
      { place: "3rd place", amount: "$60" },
    ],
  },
];

export const TOTAL_PRIZE_POOL = "$126,000";
export const TOTAL_WINNERS = "333 winners";
export const TOP_PRIZE = "$24,000 + merch";

/** The headline prize for a given board, shown above the leaderboard. */
export function topPrizeForScope(scope: LeaderboardScope): string {
  return PRIZE_TIERS.find((tier) => tier.scope === scope)?.places[0].amount ?? "—";
}

export const PRIZE_FINE_PRINT = [
  "Final winners are determined by app downloads in the first week of launch.",
  "Invites must use the same email as the waitlist to join the app to verify competition points.",
  "Prizes are non-transferable.",
];

export const HOW_IT_WORKS = [
  {
    title: "Share your link",
    description: "Share your unique link with friends.",
    tone: "#eaeee1",
  },
  {
    title: "They sign up",
    description: "Each verified sign-up counts as one invite.",
    tone: "#e6eeee",
  },
  {
    title: "Climb the leaderboard",
    description: "Track your progress and rank on campus and overall.",
    tone: "#fdeedc",
  },
  {
    title: "Win amazing prizes",
    description: "Top ambassadors win cash, merch, and in-app prizes.",
    tone: "#ede7ef",
  },
];
