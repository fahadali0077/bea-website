"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

import { BUBBA_COOKIE_NOTICE } from "@/lib/bubba-content";

const STORAGE_KEY = "bubba.cookie-consent";

/**
 * Bottom sheet shown until the visitor acknowledges it.
 *
 * The choice is kept in localStorage rather than a cookie so that dismissing
 * the notice doesn't itself set the thing being consented to. Rendering waits
 * for mount — reading storage during SSR would cause a hydration mismatch, and
 * flashing the sheet at someone who already dismissed it is worse than a beat
 * of delay.
 */
export function BubbaCookieBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // Private browsing or storage disabled — show it, don't crash.
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // Nothing to persist to; closing for this session is the best we can do.
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      className="bb-cookie"
      role="dialog"
      aria-label="Cookie notice"
      aria-live="polite"
    >
      <button
        type="button"
        className="bb-cookie-x"
        onClick={dismiss}
        aria-label="Dismiss cookie notice"
      >
        <X size={18} strokeWidth={1.8} />
      </button>

      <p className="bb-cookie-body">{BUBBA_COOKIE_NOTICE.body}</p>

      <Link href="/legal/cookies" className="bb-cookie-prefs">
        {BUBBA_COOKIE_NOTICE.preferences}
      </Link>

      <button type="button" className="bb-cookie-accept" onClick={dismiss}>
        {BUBBA_COOKIE_NOTICE.accept}
      </button>
    </aside>
  );
}
