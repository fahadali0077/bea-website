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
          <img src="/bubba/logo.png" alt="Bubba" />
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
                  <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.8499 17.5628C11.4999 17.2128 11.4999 16.6525 11.8499 16.3025L18.3499 9.80254H0.889893C0.399893 9.80254 0 9.40289 0 8.91289C0 8.42289 0.399893 8.02275 0.889893 8.02275H18.3499L11.8499 1.52275C11.4999 1.17275 11.4999 0.6125 11.8499 0.2625C12.1999 -0.0875 12.7599 -0.0875 13.1099 0.2625L21.1399 8.29277C21.4899 8.64277 21.4899 9.20254 21.1399 9.55254L13.1099 17.5828C12.7599 17.9328 12.1999 17.9328 11.8499 17.5828V17.5628Z" fill="white"/>
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
