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
  /** Decorative artwork beside the step content. */
  art?: string;
  /** Which side the artwork sits on; the copy takes the other. */
  artSide?: "left" | "right";
};

export function JoinShell({
  slug,
  children,
  canContinue = true,
  onContinue,
  skip,
  busy,
  error,
  art,
  artSide = "left",
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
    <div
      className={
        "jn-page" +
        ` jn-page--${slug}` +
        (art ? " jn-page--art" : "") +
        (art && artSide === "right" ? " jn-page--art-right" : "")
      }
    >
      <header className="jn-top">
        <Link href="/" className="jn-brand" aria-label="Bubba — home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BUBBA_BRAND.wordmark} alt="Bubba" />
        </Link>
        <JoinDots current={index} />
      </header>

      <main className="jn-main">
        {art ? (
          <div className="jn-step-art" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={art} alt="" />
          </div>
        ) : null}

        <div className="jn-col-copy">
          <p className="jn-eyebrow">{step.eyebrow}</p>
          <h1 className="jn-heading">
            {step.heading.map((line, i) => (
              <span key={i}>{line}</span>
            ))}
          </h1>
          {/* Only the city step has a smaller, dimmer second line
              ("(This helps with launch)") — 21pt against 24pt in the .ai. */}
          <p className={"jn-sub" + (slug === "city" ? " jn-sub--aside" : "")}>
            {step.sub.map((line, i) => (
              <span key={i}>{line}</span>
            ))}
          </p>
        </div>

        <div className="jn-col-actions">
          <div className="jn-body">{children}</div>

          <div className="jn-actions">
            {error ? (
              <p className="jn-error" role="alert">
                {error}
              </p>
            ) : null}

            {/* The artboards treat these differently: the city skip is 24pt
                medium green, the ambassador one 18pt regular ink. */}
            {skip ? (
              <button type="button" className="jn-skip" onClick={skip.onClick}>
                {skip.label}
              </button>
            ) : null}

            <button
              type="button"
              className={"jn-cta" + (busy ? " jn-cta--busy" : "")}
              onClick={advance}
              disabled={!canContinue || busy}
              aria-busy={busy || undefined}
            >
              {busy ? (
                <>
                  <span className="jn-cta-spin" aria-hidden="true" />
                  Just a moment…
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight size={18} strokeWidth={2} />
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}