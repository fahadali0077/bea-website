"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Copy, Check } from "lucide-react";

import { BUBBA_BRAND } from "@/lib/bubba-content";
import { useAppSelector } from "@/store/hooks";

export function JoinDone() {
  const { form, joinResult, waitlistPosition } = useAppSelector((s) => s.waitlist);
  const [copied, setCopied] = useState(false);

  const link = joinResult?.referralLink ?? "";
  const place = waitlistPosition ?? joinResult?.waitlistPosition ?? null;
  /* Someone can land here directly — a bookmark, a refresh after the store
     cleared, a shared URL — with nothing to show. Say so plainly and give
     them a way back rather than rendering an empty shell. */
  const noResult = !joinResult && place === null;

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch {
      /* Clipboard blocked — the link is selectable in the field regardless. */
    }
  };

  return (
    <div className="jn-page jn-page--done">
      <header className="jn-top jn-top--intro">
        <Link href="/" className="jn-brand" aria-label="Bubba — home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BUBBA_BRAND.wordmark} alt="Bubba" />
        </Link>
      </header>

      <main className="jn-main jn-main--done">
        <div className="jn-done-art" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/bubba/done-envelope.png" alt="" />
        </div>

        <h1 className="jn-done-title">
          {noResult ? "Nothing to show yet." : "You\u2019re on the list."}
        </h1>

        <p className="jn-done-sub">
          {noResult ? (
            "We can't find a waitlist entry for this session. If you already joined, check your email for the invite."
          ) : (
            <>
              The waiting room commences in <strong>3 days</strong>.
            </>
          )}
        </p>

        {noResult ? null : (
        <section className="jn-place">
          <p className="jn-place-label">Your place in line</p>
          <p className="jn-place-num">
            <span className="jn-place-hash">#</span>
            {place !== null ? place.toLocaleString() : "—"}
          </p>
          {form.marketName ? (
            <p className="jn-place-where">in {form.marketName}</p>
          ) : null}
        </section>
        )}

        {link ? (
          <section className="jn-invite">
            <p className="jn-invite-label">Your invite link</p>
            <div className="jn-invite-row">
              <input readOnly value={link} aria-label="Your invite link" />
              <button type="button" onClick={copy} aria-label="Copy invite link">
                {copied ? <Check size={16} strokeWidth={2.2} /> : <Copy size={16} strokeWidth={1.8} />}
              </button>
            </div>
          </section>
        ) : null}

        <Link
          href={noResult ? "/waitlist/start" : "/"}
          className="jn-done-link"
        >
          {noResult ? "Start again" : "Enter the waiting room"}
        </Link>
      </main>
    </div>
  );
}
