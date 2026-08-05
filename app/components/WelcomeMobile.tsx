import Link from "next/link";
import { ArrowRight } from "lucide-react";

import "@/styles/login.css";

import { MobileNav } from "./MobileNav";
import { OnboardingStepper } from "./OnboardingStepper";
import { PrizeCard, type PrizeCardData } from "./PrizeCard";

import { ARTBOARD } from "@/lib/design";

const prizeCards: PrizeCardData[] = [
  {
    illustration: "/images/illus-campus.png",
    title: "Campus Champion",
    subtitle: "Win at your school",
    badgeText: "TOP PRIZE $240",
    badge: {
      backgroundColor: "#e4eddf",
      borderColor: "#99aa87",
      color: "#3f5236",
    },
    width: 380,
  },
  {
    illustration: "/images/illus-market.png",
    title: "Market Champion",
    subtitle: "Win in your market",
    badgeText: "TOP PRIZE $2400",
    badge: {
      backgroundColor: "#ebe4f4",
      borderColor: "#b0a3c6",
      color: "#534663",
    },
    width: 380,
  },
  {
    illustration: "/images/illus-national.png",
    title: "National Champion",
    subtitle: "Win across the country",
    badgeText: "TOP PRIZE $24,000",
    badge: {
      backgroundColor: "#f5ebe0",
      borderColor: "#c9b59a",
      color: "#6b5340",
    },
    width: 400,
  },
];

export function WelcomeMobile() {
  return (
    <div
      className="onboarding-welcome-mobile min-h-screen w-full overflow-x-hidden pb-[env(safe-area-inset-bottom)]"
      style={{ backgroundColor: ARTBOARD.bg }}
    >
      <MobileNav activeIndex={0} />
      <OnboardingStepper activeIndex={0} layout="mobile" />

      <div
        className="ambassador-login-root onboarding-inner-mobile"
        style={{ backgroundColor: ARTBOARD.bg }}
      >
        <div className="onboarding-inner-panel">
          <div className="right-form-wrap">
            <p className="form-eyebrow onboarding-step-eyebrow onboarding-step-eyebrow--sr">
              Step 1 of 6
            </p>

            <h1 className="form-title onboarding-form-title">
              Welcome to
              <br />
              Campus launch
            </h1>

            <p className="form-subtitle">
              A little friendly competition to help launch bea on your campus.
            </p>

            <Link href="/your-school" className="btn-login onboarding-btn-link">
              <span>Start your journey</span>
              <span className="btn-arrow">
                <ArrowRight strokeWidth={2} aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>

        <section className="onboarding-welcome-prizes">
          <div className="onboarding-welcome-prizes-header">
            <h2 className="font-canela onboarding-heading text-[22px] leading-tight">
              Represent. Grow. Win.
            </h2>
            <p className="onboarding-welcome-prizes-sub">
              Prizes at the campus, market, and national level.
            </p>
          </div>

          <ul className="onboarding-prize-list onboarding-welcome-prize-list">
            {prizeCards.map((card) => (
              <li key={card.title}>
                <PrizeCard card={card} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
