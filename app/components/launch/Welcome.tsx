"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { WELCOME_STEP } from "@/lib/launch";
import { markStepReached } from "@/lib/onboarding-progress";

export function Welcome() {
  const router = useRouter();
  const { eyebrow, titleLines, subtitle, cta, loginPrompt, loginLabel, loginHref } =
    WELCOME_STEP;

  const handleContinue = () => {
    markStepReached("the-role");
    router.push(cta.href);
  };

  return (
    <section className="launch-step launch-step--hero">
      <div className="launch-step-inner launch-step-inner--hero">
        <div className="hero-content">
          <p className="hero-eyebrow">{eyebrow}</p>
          <h1 className="hero-title font-canela onboarding-heading">
            {titleLines.map((line, i) => (
              <span key={line}>
                {line}
                {i < titleLines.length - 1 && <br />}
              </span>
            ))}
          </h1>
          <p className="hero-lede">
            {subtitle.split("\n").map((line, i, arr) => (
              <span key={line}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </p>

          <button type="button" onClick={handleContinue} className="hero-cta cursor-pointer">
            <span>{cta.label}</span>
            <ArrowRight size={18} strokeWidth={2} className="hero-cta-arrow" aria-hidden="true" />
          </button>

          <p className="hero-signin">
            {loginPrompt}
            <Link href={loginHref}>{loginLabel}</Link>
          </p>
        </div>

        <div className="hero-art">
          <Image
            src="/images/onboarding/beach-invitation.png"
            alt=""
            width={940}
            height={1136}
            priority
          />
        </div>
      </div>
    </section>
  );
}