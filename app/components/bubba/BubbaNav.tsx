"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { BUBBA_BRAND, BUBBA_NAV_LINKS, type BubbaNavKey } from "@/lib/bubba-content";

type Props = {
  active?: BubbaNavKey;
};

export function BubbaNav({ active = "home" }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <nav className={`bb-nav${scrolled ? " bb-nav--scrolled" : ""}`}>
        <div className="bb-nav-inner">
          <div className="bb-nav-left">
            <button
              type="button"
              className="bb-nav-burger"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
            >
              <Menu size={22} strokeWidth={1.8} />
            </button>

            <div className="bb-nav-links">
              {BUBBA_NAV_LINKS.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className={`bb-nav-link${active === link.key ? " bb-nav-link--active" : ""}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <Link href="/" className="bb-nav-brand" aria-label="Bubba — home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BUBBA_BRAND.wordmark} alt="Bubba" />
          </Link>

          <div className="bb-nav-right">
            <Link href="/waitlist/start" className="bb-btn bb-btn--ink bb-nav-cta">
              Join waitlist
            </Link>
          </div>
        </div>
      </nav>

      {open ? (
        <>
          <div
            className="bb-drawer-scrim"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="bb-drawer" role="dialog" aria-modal="true" aria-label="Menu">
            <div className="bb-drawer-head">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={BUBBA_BRAND.wordmark} alt="Bubba" />
              <button
                type="button"
                className="bb-drawer-close"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X size={22} strokeWidth={1.8} />
              </button>
            </div>

            <div className="bb-drawer-links">
                {BUBBA_NAV_LINKS.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className="bb-drawer-link"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/faq" className="bb-drawer-link" onClick={() => setOpen(false)}>
                FAQ
              </Link>
            </div>

            <div className="bb-drawer-foot">
              <Link
                href="/waitlist/start"
                className="bb-btn bb-btn--solid"
                onClick={() => setOpen(false)}
              >
                Join waitlist
              </Link>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
