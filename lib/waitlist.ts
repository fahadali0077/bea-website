export const WAITLIST = {
  bg: "#fbf5ef",
  text: "#1a1a1a",
  muted: "#9a9490",
  border: "#d8d5cf",
  barInactive: "#e8e0d8",
  barActive: "#1a1a1a",
  inputBg: "#ffffff",
  pillInactive: "#ffffff",
  pillActive: "#1a1a1a",
} as const;

export type WaitlistArtboardId = "1" | "3" | "4" | "5" | "7" | "8" | "9";

export type WaitlistStepArtboardId = "3" | "4" | "5" | "7";

export type WaitlistArtboardMeta = {
  id: WaitlistArtboardId;
  file: string;
  label: string;
  href: string;
  progressIndex: number | null;
  backHref: string | null;
  nextHref: string | null;
};

export const WAITLIST_ARTBOARDS: Record<WaitlistArtboardId, WaitlistArtboardMeta> = {
  "1": {
    id: "1",
    file: "Artboard 1.png",
    label: "Landing",
    href: "/waitlist",
    progressIndex: null,
    backHref: null,
    nextHref: "/waitlist/3",
  },
  "3": {
    id: "3",
    file: "3.png",
    label: "Market",
    href: "/waitlist/3",
    progressIndex: 1,
    backHref: "/waitlist",
    nextHref: "/waitlist/4",
  },
  "4": {
    id: "4",
    file: "4.png",
    label: "Name",
    href: "/waitlist/4",
    progressIndex: 2,
    backHref: "/waitlist/3",
    nextHref: "/waitlist/5",
  },
  "5": {
    id: "5",
    file: "5.png",
    label: "School",
    href: "/waitlist/5",
    progressIndex: 3,
    backHref: "/waitlist/4",
    nextHref: "/waitlist/7",
  },
  "7": {
    id: "7",
    file: "7.png",
    label: "Email",
    href: "/waitlist/7",
    progressIndex: 4,
    backHref: "/waitlist/5",
    nextHref: "/waitlist/8",
  },
  "8": {
    id: "8",
    file: "8.png",
    label: "Confirmed",
    href: "/waitlist/8",
    progressIndex: null,
    backHref: "/waitlist/7",
    nextHref: "/waitlist/9",
  },
  "9": {
    id: "9",
    file: "9.png",
    label: "Prizes",
    href: "/waitlist/9",
    progressIndex: null,
    backHref: "/waitlist/8",
    nextHref: null,
  },
};

export const WAITLIST_JOIN_FLOW: WaitlistArtboardId[] = ["3", "4", "5", "7", "8", "9"];

export const WAITLIST_PROGRESS_STEP_HREFS = [
  "/waitlist/3",
  "/waitlist/4",
  "/waitlist/5",
  "/waitlist/7",
] as const;

export const WAITLIST_CITIES = [
  {
    id: "nyc",
    name: "New York",
    plans: "2,481",
    waitlist: "14.2K",
    image: "/waitlist/cities/new-york.png?v=3",
  },
  {
    id: "boston",
    name: "Boston",
    plans: "1,202",
    waitlist: "8.7K",
    image: "/waitlist/cities/boston.png?v=3",
  },
  {
    id: "miami",
    name: "Miami",
    plans: "973",
    waitlist: "6.1K",
    image: "/waitlist/cities/miami.png?v=3",
  },
  {
    id: "la",
    name: "Los Angeles",
    plans: "1,156",
    waitlist: "9.3K",
    image: "/waitlist/cities/los-angeles.png?v=3",
  },
] as const;

export const WAITLIST_HERO_CITIES = [
  "NYC",
  "Boston",
  "Miami",
  "Los Angeles",
  "Chicago",
  "Austin",
  "Phoenix",
  "Atlanta",
  "Charlotte",
  "Denver",
  "Columbus",
  "DC",
] as const;

export const WAITLIST_HERO_IMAGE = "/waitlist/hero/couple.png";

export type WaitlistCity = (typeof WAITLIST_CITIES)[number];

export function waitlistHref(id: WaitlistArtboardId): string {
  return WAITLIST_ARTBOARDS[id].href;
}
