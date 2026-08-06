/**
 * Waitlist join flow — mobile.
 *
 * Type, colour and size values are taken from Join_waitlist.ai (562pt
 * artboards). Point sizes scale to a 390px viewport by 390/562 = 0.694,
 * which is why a 36pt heading lands at 25px and 24pt body at 16.5px.
 *
 * The dot indicator carries one dot per collecting step, so JOIN_STEPS is
 * the single source for both the route order and the indicator length.
 */

export type JoinStepSlug =
  | "city"
  | "campus"
  | "ambassador"
  | "basics"
  | "email";

export type JoinStep = {
  slug: JoinStepSlug;
  eyebrow: string;
  heading: string[];
  sub: string[];
};

export const JOIN_STEPS: JoinStep[] = [
  {
    slug: "city",
    eyebrow: "Select city",
    heading: ["Where do you want", "to date?"],
    sub: ["Choose the city you want to join.", "(This helps with launch)"],
  },
  {
    slug: "campus",
    eyebrow: "Campus",
    heading: ["Are you part of a", "school community?"],
    sub: ["This campus is used to choose", "your waiting room"],
  },
  {
    slug: "ambassador",
    eyebrow: "Ambassador credit",
    heading: ["Did an ambassador", "bring you here"],
    sub: [
      "If you heard about us through an ambassador",
      "please give them credit!",
    ],
  },
  {
    slug: "basics",
    eyebrow: "Basics",
    heading: ["A little about you"],
    sub: ["This will be used for the waiting room."],
  },
  {
    slug: "email",
    eyebrow: "Confirm email",
    heading: ["Where should we", "send your invite?"],
    sub: ["We'll let you know the", "moment Bubba opens up."],
  },
];

export const JOIN_STEP_SLUGS = JOIN_STEPS.map((s) => s.slug);

export function getJoinStep(slug: string): JoinStep | undefined {
  return JOIN_STEPS.find((s) => s.slug === slug);
}

export function joinStepIndex(slug: string): number {
  return JOIN_STEPS.findIndex((s) => s.slug === slug);
}

export function joinStepHref(index: number): string {
  const step = JOIN_STEPS[index];
  return step ? `/waitlist/${step.slug}` : "/waitlist/done";
}

/**
 * City card artwork, keyed by a slug derived from the market name so it
 * survives the API returning "New York" vs "New York, NY". Markets without
 * art fall through to a plain tinted card rather than a broken image.
 */
const CITY_ART_SLUGS = new Set([
  "new-york",
  "boston",
  "miami",
  "los-angeles",
  "chicago",
  "austin",
  "phoenix",
  "atlanta",
  "charlotte",
  "denver",
  "columbus",
  "washington-dc",
]);

export function cityArt(marketName: string): string | null {
  const slug = marketName
    .toLowerCase()
    .replace(/[.,]/g, "")
    .replace(/\bdc\b/, "dc")
    .trim()
    .replace(/\s+/g, "-");

  const direct = slug.split("-").slice(0, 3).join("-");
  for (const candidate of [slug, direct, slug.replace(/-[a-z]{2}$/, "")]) {
    if (CITY_ART_SLUGS.has(candidate)) {
      return `/bubba/city-${candidate}.png`;
    }
  }
  return null;
}
