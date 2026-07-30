export const LAUNCH_BRAND = "Bubba";

export const LAUNCH_STEP_ROUTES = [
  "/onboarding",
  "/the-role",
  "/verify-email",
  "/account",
  "/your-school",
  "/youre-in",
] as const;

export const LAUNCH_TOTAL_STEPS = LAUNCH_STEP_ROUTES.length;

export const WELCOME_STEP = {
  eyebrow: "You're invited",
  titleLines: ["You've been", "chosen to be a", "Bubba Ambassador."],
  subtitle: "Help launch something meaningful.\nBuild your community. Earn rewards.",
  cta: { label: "See your invitation", href: "/the-role" },
  loginPrompt: "Already have an account? ",
  loginLabel: "Log in",
  loginHref: "/auth/login",
};

export type SchoolIcon = "early-access" | "rewards" | "community" | "impact";

export const SCHOOL_STEP = {
  eyebrow: "The role",
  titleLines: ["Be part of", "what's next."],
  subtitle: "As an Ambassador, you'll be the first to experience Bubba and help bring your people with you.",
  items: [
    {
      icon: "early-access" as SchoolIcon,
      title: "Early access",
      desc: "Be the first to try Bubba.",
    },
    {
      icon: "rewards" as SchoolIcon,
      title: "Earn rewards",
      desc: "Unlock exclusive perks as you invite.",
    },
    {
      icon: "community" as SchoolIcon,
      title: "Build community",
      desc: "Represent your campus and create connections that last.",
    },
    {
      icon: "impact" as SchoolIcon,
      title: "Make an impact",
      desc: "Help shape the way people meet—starting with you.",
    },
  ],
  cta: { label: "Continue", href: "/verify-email" },
  footnote: { label: "Learn more about the program", href: "#" },
};

export const WAYS_STEP = {
  eyebrow: "Verify your email",
  titleLines: ["Let's confirm", "it's you."],
  bodyPrefix: "We sent a verification link to",
  continuePrompt: "Click the link in your email\nto continue.",
  resend: { label: "Resend email" },
  useDifferentEmail: { label: "Use a different email" },
  cta: { label: "Continue", href: "/account" },
};

export const ACCOUNT_STEP = {
  eyebrow: "Create account",
  titleLines: ["Let's get you", "set up."],
  fields: [
    { name: "fullName", label: "Full name", type: "text" },
    { name: "email", label: "Email", type: "email" },
  ],
  alreadyRegisteredNote: "Email registered — you already have a Bea account. Continuing will sign you into it.",
  availableNote: "Email available.",
  legal: {
    prefix: "By continuing, you agree to Bubba's ",
    termsLabel: "Terms of Service",
    termsHref: "#",
    conjunction: " and ",
    privacyLabel: "Privacy Policy",
    privacyHref: "#",
  },
  cta: { label: "Create account", href: "/your-school" },
  loginPrompt: "Already have an account? ",
  loginLabel: "Log in",
  loginHref: "/auth/login",
};

const CURRENT_YEAR = new Date().getFullYear();
export const GRADUATION_YEARS = Array.from({ length: 8 }, (_, i) => String(CURRENT_YEAR + i));

export const AMBASSADOR_ROLE_OPTIONS = ["Ambassador"];

export const INVITE_STEP = {
  eyebrow: "Tell us about you",
  title: "Help us personalize your experience.",
  fields: [
    { name: "school", label: "School" },
    { name: "graduationYear", label: "Graduation year" },
    { name: "role", label: "Your role" },
    { name: "instagram", label: "Instagram (optional)" },
  ],
  agreement: "I agree to represent Bubba with integrity and follow the program guidelines.",
  cta: { label: "Join the community", href: "/youre-in" },
};

export type ShareIcon = "instagram" | "messages" | "whatsapp" | "share";

export const YOUREIN_STEP = {
  eyebrow: "Welcome, ambassador",
  title: "You're in.",
  subtitleLines: ["Thanks for being part of the", "Bubba community."],
  linkLabel: "Your invite link",
  link: "bubba.app/invite/sophia",
  shareHeading: "Share your link",
  shares: [
    { icon: "instagram" as ShareIcon, label: "Instagram" },
    { icon: "messages" as ShareIcon, label: "Messages" },
    { icon: "whatsapp" as ShareIcon, label: "Copy link" },
    { icon: "share" as ShareIcon, label: "More" },
  ],
  nextUp: {
    label: "Next up",
    text: "Explore the ambassador hub and start inviting.",
    cta: { label: "Go to dashboard", href: "/dashboard" },
  },
};
