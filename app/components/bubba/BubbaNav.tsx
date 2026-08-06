"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Instagram, Menu, Music2, X } from "lucide-react";

import {
  BUBBA_BRAND,
  BUBBA_DRAWER_LEGAL,
  BUBBA_DRAWER_LINKS,
  BUBBA_NAV_LINKS,
  BUBBA_SOCIALS,
  type BubbaNavKey,
} from "@/lib/bubba-content";

const SOCIAL_ICONS = { instagram: Instagram, tiktok: Music2 } as const;

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
              Join
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

            <nav className="bb-drawer-links">
              {BUBBA_DRAWER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="bb-drawer-link"
                  onClick={() => setOpen(false)}
                >
                  <span>{link.label}</span>
                  <ArrowRight size={18} strokeWidth={1.6} />
                </Link>
              ))}
            </nav>

            <Link
              href="/waitlist/start"
              className="bb-drawer-card"
              onClick={() => setOpen(false)}
            >
              <span>
                <span className="bb-drawer-card-title">Be the first to know</span>
                <span className="bb-drawer-card-body">
                  Join the waitlist for early access to Bubba
                </span>
              </span>
              <span className="bb-drawer-card-go" aria-hidden="true">
                <ArrowRight size={17} strokeWidth={2} />
              </span>
            </Link>

            <div className="bb-drawer-social">
              {BUBBA_SOCIALS.map((social) => {
                const Icon = SOCIAL_ICONS[social.key];
                return (
                  <a
                    key={social.key}
                    href={social.href}
                    className="bb-drawer-social-link"
                  >
                    <Icon size={18} strokeWidth={1.6} />
                    <span>{social.label}</span>
                  </a>
                );
              })}
            </div>

            <div className="bb-drawer-legal">
              {BUBBA_DRAWER_LEGAL.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <p className="bb-drawer-year">Bubba {new Date().getFullYear()}</p>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
