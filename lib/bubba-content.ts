/**
 * Copy + data for the public marketing pages.
 * Transcribed from the approved design screenshots so the pages stay
 * content-driven rather than hard-coding strings into JSX.
 */

export const BUBBA_BRAND = {
  /** Green wordmark is the default; the black cut is for dark-on-light overlays. */
  wordmark: "/bubba/wordmark-green.png",
  wordmarkBlack: "/bubba/wordmark-black.png",
  /** Circular "B" seal used in the footer baseline. */
  mark: "/bubba/mark-b.png",
  scene: "/bubba/hero-scene.png",
  faqScene: "/bubba/faq-cyclist.png",
  /** Campus line art — reserved for the Competition Rules page. */
  campus: "/bubba/campus.png",
  bolt: "/bubba/bolt.png",
  tagline: "Together, today.",
  supportEmail: "support@joinbubba.co",
  partnershipsEmail: "partnerships@joinbubba.co",
  pressEmail: "press@joinbubba.co",
  legalEmail: "legal@joinbubba.co",
} as const;

/** Nav — left links; the wordmark sits centred and the CTA sits right. */
export const BUBBA_NAV_LINKS = [
  { key: "waiting-room", label: "The Waiting Room", href: "/waiting-room" },
  { key: "ambassadors", label: "Ambassadors", href: "/login" },
  { key: "faq", label: "FAQs", href: "/faq" },
  { key: "contact", label: "Contact", href: "/contact" },
] as const;

export type BubbaNavKey =
  | (typeof BUBBA_NAV_LINKS)[number]["key"]
  | "calendar"
  | "home";

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
  { label: "The Waiting Room", href: "/waiting-room" },
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
  "Bubba was started to reduce friction found in modern dating apps. Each conversation is limited to 24 hours and users only see recently active profiles, designed to get you on a date the very same day. We celebrate dating for the sake of dating, learning about yourself, and experiencing life through new people and adventures.";

/** Site-wide announcement strip above the nav. */
export const BUBBA_ANNOUNCEMENT =
  "The Waiting Room opens August 18\u201324 at participating schools.";

export const BUBBA_COOKIE_NOTICE = {
  body: "We use cookies to improve your experience, remember your settings, and help us build a better Bubba.",
  accept: "Continue",
  preferences: "Preferences",
} as const;

/** Mobile drawer — a longer list than the desktop nav rail. */
export const BUBBA_DRAWER_LINKS = [
  { label: "The Waiting Room", href: "/waiting-room" },
  { label: "Ambassadors", href: "/login" },
  { label: "FAQs", href: "/faq" },
  { label: "Contact", href: "/contact" },
] as const;

export const BUBBA_DRAWER_LEGAL = [
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Terms of Use", href: "/legal/terms" },
  { label: "Cookies", href: "/legal/cookies" },
] as const;

export const BUBBA_SOCIALS = [
  { key: "instagram", label: "Instagram", href: "https://instagram.com" },
  { key: "tiktok", label: "TikTok", href: "https://tiktok.com" },
] as const;

/**
 * The Waiting Room announcement card. Dates are deliberately unset — the
 * design calls for "TBD" until ambassador onboarding closes.
 */
export const BUBBA_WAITING_ROOM = {
  month: "September",
  day: "TBD",
  note: "We\u2019ll announce dates after ambassador onboarding is complete",
  title: "The Waiting Room",
  lede: "One week of daily prompts at selected schools across the country.",
  items: [
    {
      key: "prompt",
      title: "One daily prompt",
      body: "See, like, & contribute responses to a sample of our icebreakers",
    },
    {
      key: "compete",
      title: "Compete across campus",
      body: "Earn points for your responses, and have a few laughs",
    },
    {
      key: "prizes",
      title: "Redeem prizes",
      body: "Use your points for exclusive Bubba merch & app perks",
    },
  ],
  footnote:
    "Cities will launch one at a time shortly after the waiting room ends",
  cta: { label: "Learn more", href: "/calendar" },
} as const;

/**
 * The Waiting Room detail page (/waiting-room) — the full page that "The
 * Waiting Room" nav/footer/drawer links open into. Separate from
 * BUBBA_WAITING_ROOM above, which is the gold teaser card on the home page
 * and is intentionally left untouched.
 *
 * Dates and counts are placeholders pending real numbers from him. Hero
 * photo, the Snap card photo, and all five prize images are now real
 * assets he supplied (public/bubba/wrp-*.jpg — cropped from his composite
 * reference shots).
 */
export const BUBBA_WRP_HERO = {
  kicker: "By Bubba",
  sub: "The experience starts before the app does.",
  dateRange: "August 18–24",
  tagline: "Seven days. 100 schools. Many winners.",
  photo: "/bubba/wrp-hero.jpg" as string | null,
  benefits: [
    { key: "prompts", label: "Daily prompts & challenges" },
    { key: "leaderboard", label: "Climb the leaderboard" },
    { key: "prizes", label: "Earn points & win prizes" },
  ],
  stats: [
    { key: "campuses", value: "100+", label: "Campuses" },
    { key: "ambassadors", value: "500+", label: "Ambassadors" },
    { key: "days", value: "7", label: "Days" },
  ],
  statCta: { label: "Let\u2019s have a good laugh" },
} as const;

export const BUBBA_WRP_PROMO = {
  kicker: "The Waiting Room",
  title: ["One daily promo.", "Every campus."],
  body: [
    "Over 300 participating schools across the country. Each school receives the same prompt.",
    "Submit your response daily, like and comment. See responses from your school and around the country.",
  ],
} as const;

/** The three floating prompt-type cards beside the promo copy. */
export const BUBBA_WRP_CARDS = [
  {
    id: "snap",
    chip: "Snap",
    tone: "blue",
    title: "My idea of fun looks something like",
    art: "/bubba/wrp-snap.jpg" as string | null,
    likes: 73,
    action: "View top responses",
  },
  {
    id: "game",
    chip: "Game",
    tone: "clay",
    title: "If you had one forever\u2026",
    likes: 48,
    detail: "Match paired one word from Islam to Joe Bogen for a laugh.",
    action: "View top responses",
  },
  {
    id: "prompt",
    chip: "Prompt",
    tone: "green",
    title: "The one thing I\u2019ll never get tired of",
    likes: 124,
    action: "View top responses",
  },
] as const;

export type BubbaWrpDayType = "prompt" | "game" | "snap" | "mystery";

export const BUBBA_WRP_SCHEDULE: {
  day: string;
  date: string;
  type: BubbaWrpDayType;
  label: string;
}[] = [
  { day: "Day 1", date: "Mon 8/18", type: "prompt", label: "Prompt" },
  { day: "Day 2", date: "Tue 8/19", type: "game", label: "Game" },
  { day: "Day 3", date: "Wed 8/20", type: "snap", label: "Snap" },
  { day: "Day 4", date: "Thu 8/21", type: "prompt", label: "Prompt" },
  { day: "Day 5", date: "Fri 8/22", type: "game", label: "Game" },
  { day: "Day 6", date: "Sat 8/23", type: "snap", label: "Snap" },
  { day: "Day 7", date: "Sun 8/24", type: "mystery", label: "???" },
];

export const BUBBA_WRP_CALENDAR = {
  kicker: "Only 7 days",
  title: "August 18\u201324",
  body: "Get a sneak peek at some of our icebreakers and submit your best response. Top responses earn the most points, redeemable for prizes.",
} as const;

export const BUBBA_WRP_CAMPUS_PRIZE = {
  kicker: "The Campus Prize",
  title: ["Win free Premium", "for your school."],
  body: "In every market, the school with the most points wins one month of Bubba Premium for everyone on campus.",
  ticket: {
    label: "Bubba Premium",
    headline: "Unlocked",
    sub: "For your whole campus",
    pill: "1 month = free",
  },
  annotation: "one month for everyone on the waitlist",
  marketsKicker: "Active markets",
  premiumKicker: "1 month of Premium",
  requestCta: "Request my campus",
} as const;

export const BUBBA_WRP_HOW_IT_WORKS = [
  {
    key: "prompts",
    title: "Daily prompts",
    body: "One new prompt each day, across every campus.",
  },
  {
    key: "invite",
    title: "Invite friends",
    body: "Earn a spot toward a Premium membership by inviting friends.",
  },
  {
    key: "points",
    title: "Earn points",
    body: "Get points for engaging \u2014 see who has the most.",
  },
  {
    key: "redeem",
    title: "Redeem prizes",
    body: "We put together some fun merch, ready to be won. Limited time only.",
  },
  {
    key: "launch",
    title: "City launches",
    body: "Straight out of the Waiting Room and into the app \u2014 we\u2019ll launch one city at a time.",
  },
] as const;

/**
 * Real product photography (scooter + merch) not supplied yet — `art` is
 * null until it is, and the page renders a plain placeholder tile instead
 * of a broken image.
 */
export const BUBBA_WRP_PRIZES = {
  kicker: "Sneak peek the prizes",
  title: "Redeem your points",
  grand: {
    label: "Grand prize",
    name: "The Bubba Vespa",
    art: "/bubba/wrp-vespa.jpg" as string | null,
    points: "30,000 pts",
    cta: "Redeem for 30,000 pts",
  },
  items: [
    {
      id: "picnic-set",
      name: "Picnic set",
      sub: "Everything you need",
      points: "7,500 pts",
      art: "/bubba/wrp-picnic.jpg" as string | null,
    },
    {
      id: "crewneck",
      name: "Bubba crewneck",
      sub: "Classic look",
      points: "6,000 pts",
      art: "/bubba/wrp-crewneck.jpg" as string | null,
    },
    {
      id: "hat",
      name: "Bubba hat",
      sub: "Classic everyday",
      points: "3,500 pts",
      art: "/bubba/wrp-hat.jpg" as string | null,
    },
    {
      id: "beach-chair",
      name: "Beach chair",
      sub: "Take it easy",
      points: "6,000 pts",
      art: "/bubba/wrp-beach-chair.jpg" as string | null,
    },
  ],
} as const;

export const BUBBA_WRP_CLOSER = {
  title: "Seven day competition, then we launch.",
  sub: "Let\u2019s have a good laugh.",
  annotation: "see you in the waiting room",
  cta: { label: "Join the waitlist", href: "/waitlist/start" },
} as const;
