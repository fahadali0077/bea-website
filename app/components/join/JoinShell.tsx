"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { BUBBA_BRAND } from "@/lib/bubba-content";

import { JoinDots } from "./JoinDots";
import { getJoinStep, joinStepHref, joinStepIndex } from "@/lib/join";

type Props = {
  slug: string;
  children: ReactNode;
  /** Blocks Continue until the step has what it needs. */
  canContinue?: boolean;
  /** Runs before navigating; return false to stay put. */
  onContinue?: () => boolean | void;
  /** Optional link rendered above the Continue button. */
  skip?: { label: string; onClick: () => void };
  busy?: boolean;
  error?: string | null;
};

export function JoinShell({
  slug,
  children,
  canContinue = true,
  onContinue,
  skip,
  busy,
  error,
}: Props) {
  const router = useRouter();
  const index = joinStepIndex(slug);
  const step = getJoinStep(slug);

  if (!step) return null;

  const advance = () => {
    if (onContinue && onContinue() === false) return;
    router.push(joinStepHref(index + 1));
  };

  return (
    <div className="jn-page">
      <header className="jn-top">
        <Link href="/" className="jn-brand" aria-label="Bubba — home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BUBBA_BRAND.wordmark} alt="Bubba" />
        </Link>
        <JoinDots current={index} />
      </header>

      <main className="jn-main">
        <p className="jn-eyebrow">{step.eyebrow}</p>
        <h1 className="jn-heading">
          {step.heading.map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </h1>
        <p className="jn-sub">
          {step.sub.map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </p>

        <div className="jn-body">{children}</div>
      </main>

      <footer className="jn-foot">
        {error ? (
          <p className="jn-error" role="alert">
            {error}
          </p>
        ) : null}

        {skip ? (
          <button type="button" className="jn-skip" onClick={skip.onClick}>
            {skip.label}
          </button>
        ) : null}

        <button
          type="button"
          className="jn-cta"
          onClick={advance}
          disabled={!canContinue || busy}
        >
          {busy ? "Just a moment…" : "Continue"}
          <ArrowRight size={18} strokeWidth={2} />
        </button>
      </footer>
    </div>
  );
}
