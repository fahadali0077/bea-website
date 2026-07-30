import Link from "next/link";
import { ArrowRight } from "lucide-react";

import "@/styles/login.css";

import {
  getMobileTitleLines,
  ONBOARDING_PAGE_CONTENT,
  type OnboardingPageKey,
} from "@/lib/onboarding-page-content";
import { ARTBOARD } from "@/lib/design";

import { OnboardingMobileContent, YoureInShareSection } from "./OnboardingMobileContent";

type Props = {
  pageKey: OnboardingPageKey;
};

export function OnboardingMobilePage({ pageKey }: Props) {
  const content = ONBOARDING_PAGE_CONTENT[pageKey];
  const titleLines = getMobileTitleLines(pageKey);
  const isYoureIn = pageKey === "youre-in";
  const isAccount = pageKey === "account";

  if (isYoureIn) {
    return (
      <div
        className="ambassador-login-root onboarding-inner-mobile onboarding-inner-mobile--centered onboarding-youre-in-mobile"
        style={{ backgroundColor: ARTBOARD.bg }}
      >
        <div className="onboarding-inner-panel">
          <div className="right-form-wrap">
            <h1 className="form-title onboarding-form-title font-canela text-center">{titleLines[0]}</h1>

            <p className="onboarding-youre-in-school font-canela onboarding-heading">
              University of Connecticut
            </p>

            <p className="form-eyebrow onboarding-step-eyebrow onboarding-youre-in-eyebrow">
              {content.eyebrow}
            </p>

            <p className="form-subtitle text-center mx-auto">{content.subtitle}</p>

            <div className="onboarding-mobile-body">
              <OnboardingMobileContent pageKey={pageKey} />
            </div>

            <Link href={content.cta.href} className="btn-login onboarding-btn-link onboarding-youre-in-cta">
              <span>{content.cta.label}</span>
            </Link>

            <YoureInShareSection />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ambassador-login-root onboarding-inner-mobile" style={{ backgroundColor: ARTBOARD.bg }}>
      <div className="onboarding-inner-panel">
        <div className="right-form-wrap">
          <p className="form-eyebrow onboarding-step-eyebrow onboarding-step-eyebrow--sr">
            {content.eyebrow}
          </p>

          <h1 className="form-title onboarding-form-title font-canela">
            {titleLines.map((line, i) => (
              <span key={line}>
                {line}
                {i < titleLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </h1>

          <p className="form-subtitle">{content.subtitle}</p>

          <div className="onboarding-mobile-body">
            <OnboardingMobileContent pageKey={pageKey} />
          </div>

          {!isAccount && (
            <Link href={content.cta.href} className="btn-login onboarding-btn-link">
              <span>{content.cta.label}</span>
              <span className="btn-arrow">
                <ArrowRight strokeWidth={2} aria-hidden="true" />
              </span>
            </Link>
          )}

          {isAccount && (
            <Link href={content.cta.href} className="btn-login onboarding-btn-link justify-center">
              <span>{content.cta.label}</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
