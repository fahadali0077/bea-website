/**
 * Legal document registry.
 *
 * The design supplies the *layout* for these pages (summary callout at the top,
 * long-form numbered sections below) but not the operative text — the mock
 * itself shows lorem ipsum in the summary boxes. Every document below therefore
 * ships with its structure in place and a visible placeholder where counsel's
 * copy needs to be dropped in. Nothing here should be treated as legal wording.
 */

export type LegalSummaryItem = { term: string; detail: string };

export type LegalSection = {
  heading: string;
  /** Paragraphs of real, non-operative descriptive copy, if any. */
  body?: string[];
  /** When true the section renders the "copy needed" placeholder block. */
  awaitingCopy?: boolean;
};

export type LegalDoc = {
  slug: string;
  title: string;
  updated: string;
  intro: string;
  summary?: { heading: string; items: LegalSummaryItem[] };
  sections: LegalSection[];
};

const AWAITING: LegalSection[] = [
  { heading: "1. Introduction", awaitingCopy: true },
  { heading: "2. Scope", awaitingCopy: true },
  { heading: "3. Your rights", awaitingCopy: true },
  { heading: "4. Contact", awaitingCopy: true },
];

export const BUBBA_LEGAL_DOCS: LegalDoc[] = [
  {
    slug: "terms",
    title: "Terms of Use",
    updated: "Not yet published",
    intro:
      "These Terms govern your access to and use of the Bubba website, mobile application, and any related products, features, content, or services.",
    summary: {
      heading: "Here is a short summary of our Terms of Use",
      items: [
        {
          term: "California subscribers",
          detail:
            "Summary of the California-specific subscription and cancellation rights.",
        },
        {
          term: "Automatic renewal",
          detail:
            "Summary of how subscriptions renew and how to turn renewal off.",
        },
        {
          term: "App store refunds",
          detail:
            "Summary of how refunds are handled when you purchase through an app store.",
        },
      ],
    },
    sections: [
      {
        heading: "1. Introduction",
        body: [
          "Welcome to Bubba, operated by Bubba Operating Company, LLC (\u201cBubba\u201d, \u201cwe\u201d, \u201cus\u201d, \u201cour\u201d, or the \u201cCompany\u201d).",
          "By creating an account, accessing, or using our services, you agree to be bound by these Terms, our Privacy Policy, our Community Guidelines, our Cookie Policy where applicable, and any additional terms presented to you when you purchase premium features or other services. If you do not agree to these Terms, you may not access or use our services.",
        ],
      },
      { heading: "2. Eligibility and your account", awaitingCopy: true },
      { heading: "3. Subscriptions, billing and renewal", awaitingCopy: true },
      { heading: "4. Acceptable use", awaitingCopy: true },
      { heading: "5. Content and licence", awaitingCopy: true },
      { heading: "6. Termination", awaitingCopy: true },
      { heading: "7. Disclaimers and limitation of liability", awaitingCopy: true },
      { heading: "8. Governing law and disputes", awaitingCopy: true },
      {
        heading: "9. Company information",
        body: [
          "Bubba Operating Company, LLC, 580 Farmington Avenue, Hartford, CT 06105, United States.",
        ],
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    updated: "Not yet published",
    intro:
      "How Bubba collects, uses, shares and protects your personal information, and the choices you have.",
    sections: AWAITING,
  },
  {
    slug: "cookies",
    title: "Cookie Policy",
    updated: "Not yet published",
    intro:
      "What cookies and similar technologies Bubba uses, what they do, and how to manage them.",
    sections: AWAITING,
  },
  {
    slug: "community-guidelines",
    title: "Community Guidelines",
    updated: "Not yet published",
    intro:
      "What we expect from everyone on Bubba, what isn't allowed, and what happens when someone crosses the line.",
    sections: AWAITING,
  },
  {
    slug: "official-rules",
    title: "Official Competition Rules",
    updated: "Not yet published",
    intro:
      "How the Bubba Ambassador Program competition works, how points are earned, and how prizes are awarded.",
    sections: [
      { heading: "1. How invites work", awaitingCopy: true },
      { heading: "2. How points are counted", awaitingCopy: true },
      { heading: "3. Competition structure", awaitingCopy: true },
      { heading: "4. Prizes and payouts", awaitingCopy: true },
      { heading: "5. Eligibility", awaitingCopy: true },
      { heading: "6. Fair play", awaitingCopy: true },
      { heading: "7. Ties and disputes", awaitingCopy: true },
      { heading: "8. Official terms", awaitingCopy: true },
    ],
  },
  {
    slug: "consumer-health-data",
    title: "Consumer Health Data Privacy Policy",
    updated: "Not yet published",
    intro:
      "Additional disclosures for consumer health data under applicable state privacy laws.",
    sections: AWAITING,
  },
  {
    slug: "colorado-safety",
    title: "Colorado Safety Policy Information",
    updated: "Not yet published",
    intro:
      "Safety information and disclosures required for Colorado users of dating platforms.",
    sections: AWAITING,
  },
  {
    slug: "accessibility",
    title: "Accessibility Statement",
    updated: "Not yet published",
    intro:
      "Our commitment to making Bubba usable by everyone, and how to tell us when we fall short.",
    sections: AWAITING,
  },
];

export function getLegalDoc(slug: string): LegalDoc | undefined {
  return BUBBA_LEGAL_DOCS.find((doc) => doc.slug === slug);
}
