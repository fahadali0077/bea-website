/**
 * Copy + data for the public marketing pages.
 * Transcribed from the approved design screenshots so the pages stay
 * content-driven rather than hard-coding strings into JSX.
 */

export const BUBBA_BRAND = {
  wordmark: "/images/4x/BubbaLogo.png",
  scene: "/images/4x/hero-scene.png",
  faqScene: "/images/faq.jpg",
  tagline: "Together, today.",
  supportEmail: "support@joinbubba.co",
  partnershipsEmail: "partnerships@joinbubba.co",
  pressEmail: "press@joinbubba.co",
  legalEmail: "legal@joinbubba.co",
} as const;

/** Nav — left links; the wordmark sits centred and the CTA sits right. */
export const BUBBA_NAV_LINKS = [
  { key: "waiting-room", label: "Waiting Room", href: "/#waiting-room" },
  { key: "ambassadors", label: "Ambassadors", href: "/login" },
  { key: "calendar", label: "Calendar", href: "/calendar" },
] as const;

export type BubbaNavKey = (typeof BUBBA_NAV_LINKS)[number]["key"] | "home";

/** Hero city rail. */
export const BUBBA_LAUNCH_CITIES = [
  "NYC",
  "Boston",
  "Miami",
  "Los Angeles",
  "Chicago",
] as const;

/** Waiting Room prompt cards. */
export const BUBBA_PROMPT_CARDS = [
  {
    id: "prompt",
    chip: "Prompt",
    tone: "green",
    prompt: "If I had one last first date ever it would be…",
    art: null,
    likes: 184,
    action: "View top responses",
  },
  {
    id: "snap",
    chip: "Snap",
    tone: "blue",
    prompt: null,
    art: "camera",
    likes: null,
    action: "See what's next",
  },
  {
    id: "this-or-that",
    chip: "This or that",
    tone: "clay",
    prompt: null,
    art: "signpost",
    likes: null,
    action: "Pick your side",
  },
] as const;

/**
 * Launch calendar.
 *
 * NOTE: the design screenshot lists Washington DC under "NEW YORK" — that is a
 * copy-paste slip in the mock, corrected to District of Columbia here.
 * Dates are placeholders until the real launch schedule is confirmed.
 */
export type BubbaMarket = {
  id: string;
  city: string;
  state: string;
  progress: number;
  month: string;
  day: string;
  detail: string;
};

export const BUBBA_MARKETS: BubbaMarket[] = [
  {
    id: "nyc",
    city: "New York",
    state: "New York",
    progress: 82,
    month: "Jul",
    day: "24",
    detail:
      "Manhattan, Brooklyn and Queens open together. Campus partners across NYU, Columbia, Fordham and Hunter are already onboarding ambassadors.",
  },
  {
    id: "la",
    city: "Los Angeles",
    state: "California",
    progress: 78,
    month: "Jul",
    day: "24",
    detail:
      "Westside and Downtown first, with the Valley following two weeks later. USC and UCLA lead the campus rollout.",
  },
  {
    id: "boston",
    city: "Boston",
    state: "Massachusetts",
    progress: 74,
    month: "Jul",
    day: "24",
    detail:
      "One of our densest waitlists per square mile. Northeastern, BU and BC unlock on day one.",
  },
  {
    id: "miami",
    city: "Miami",
    state: "Florida",
    progress: 66,
    month: "Jul",
    day: "24",
    detail:
      "Brickell, Wynwood and South Beach at launch. University of Miami and FIU join the same week.",
  },
  {
    id: "chicago",
    city: "Chicago",
    state: "Illinois",
    progress: 71,
    month: "Jul",
    day: "24",
    detail:
      "River North and Lincoln Park first. Northwestern, DePaul and UChicago follow in the campus wave.",
  },
  {
    id: "dc",
    city: "Washington DC",
    state: "District of Columbia",
    progress: 63,
    month: "Jul",
    day: "24",
    detail:
      "The District plus Arlington and Bethesda. Georgetown, GW and Howard are in the first campus cohort.",
  },
  {
    id: "austin",
    city: "Austin",
    state: "Texas",
    progress: 58,
    month: "Jul",
    day: "24",
    detail:
      "Central Austin and East Side at launch, with UT Austin anchoring the campus rollout.",
  },
  {
    id: "phoenix",
    city: "Phoenix",
    state: "Arizona",
    progress: 52,
    month: "Jul",
    day: "24",
    detail:
      "Phoenix, Scottsdale and Tempe together. Arizona State opens alongside the city launch.",
  },
];

/** FAQ accordion. */
export const BUBBA_FAQS = [
  {
    q: "What's different about Bubba?",
    a: "Bubba limits conversations to 24 hours and only displays recently active profiles. It's designed to get you meeting people as soon as possible — less texting, more dating.",
  },
  {
    q: "How much does it cost to join?",
    a: "Bubba is free to join, so you can test the waters. Premium memberships are $24 a month and you can cancel anytime.",
  },
  {
    q: "Is this better than other dating apps?",
    a: "The experience on Bubba is different. We felt other dating apps simply take too long. Bubba is for the days when you just want to meet someone new and do something fun.",
  },
  {
    q: "What is the Waiting Room?",
    a: "Before your city launches, the Waiting Room is where your campus shows up. Every school gets the same prompt each day — answer it, vote on your favourites, and the points go to your school.",
  },
  {
    q: "When does Bubba reach my city?",
    a: "We're opening select markets this summer with a full rollout in the fall. The launch calendar tracks every market and where it stands.",
  },
] as const;

/** Footer. */
export const BUBBA_FOOTER_EXPLORE = [
  { label: "The Waiting Room", href: "/#waiting-room" },
  { label: "Ambassadors", href: "/login" },
  { label: "FAQs", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Join Waitlist", href: "/waitlist/start" },
  { label: "Press Kit", href: "/contact#press" },
] as const;

export const BUBBA_FOOTER_LEGAL = [
  { label: "Terms of Use", href: "/legal/terms" },
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Cookies", href: "/legal/cookies" },
  { label: "Community Guidelines", href: "/legal/community-guidelines" },
  { label: "Official Rules", href: "/legal/official-rules" },
  {
    label: "Consumer Health Data Privacy Policy",
    href: "/legal/consumer-health-data",
  },
  {
    label: "Colorado Safety Policy Information",
    href: "/legal/colorado-safety",
  },
  { label: "Accessibility Statement", href: "/legal/accessibility" },
] as const;

export const BUBBA_FOOTER_ABOUT =
  "Bubba was started to reduce the friction found in modern dating apps. Each conversation is limited to 24 hours and you only see recently active profiles, so you can get on a date the very same day. We celebrate dating for the sake of dating — learning about yourself and experiencing life through new people and new adventures.";
