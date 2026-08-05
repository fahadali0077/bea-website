"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Gift,
  MapPin,
  Menu,
  Trophy,
  UserPlus,
  X,
} from "lucide-react";

import { WAITLIST_APP_SHELL } from "@/lib/waitlist-page-content";

const NAV_ICONS = {
  today: CalendarDays,
  voices: Trophy,
  markets: MapPin,
  invite: UserPlus,
  rewards: Gift,
} as const;

export function WaitlistPrizesAppBar() {
  const [open, setOpen] = useState(false);
  const { logo, profile, nav, ranks } = WAITLIST_APP_SHELL;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="waitlist-appbar">
        <button
          type="button"
          className="waitlist-appbar-icon"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Menu size={22} strokeWidth={1.75} />
        </button>

        <Link href="/" className="waitlist-appbar-logo">
          {logo}
        </Link>

        <button
          type="button"
          className="waitlist-appbar-profile"
          aria-label={`${profile.name}, ${profile.org}`}
          onClick={() => setOpen(true)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="waitlist-appbar-avatar" src={profile.avatar} alt="" />
          <span className="waitlist-appbar-profile-text">
            <span className="waitlist-appbar-profile-name">{profile.name}</span>
            <span className="waitlist-appbar-profile-org">{profile.org}</span>
          </span>
          <ChevronDown size={15} strokeWidth={1.75} aria-hidden />
        </button>
      </header>

      {open && (
        <div className="waitlist-drawer-root">
          <button
            type="button"
            className="waitlist-drawer-backdrop"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <nav className="waitlist-drawer" aria-label="Main menu">
            <div className="waitlist-drawer-head">
              <span className="waitlist-appbar-logo">{logo}</span>
              <button
                type="button"
                className="waitlist-appbar-icon"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <X size={20} strokeWidth={1.75} />
              </button>
            </div>

            <div className="waitlist-drawer-profile">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="waitlist-appbar-avatar waitlist-appbar-avatar--lg"
                src={profile.avatar}
                alt=""
              />
              <div className="waitlist-drawer-profile-text">
                <p className="waitlist-drawer-profile-name">{profile.name}</p>
                <p className="waitlist-drawer-profile-org">{profile.org}</p>
              </div>
              <ChevronDown size={18} strokeWidth={1.75} aria-hidden />
            </div>

            <ul className="waitlist-drawer-nav">
              {nav.map((item) => {
                const Icon = NAV_ICONS[item.icon];
                const active = "active" in item && item.active;
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      className={
                        "waitlist-drawer-link" + (active ? " is-active" : "")
                      }
                      onClick={() => setOpen(false)}
                    >
                      <Icon size={20} strokeWidth={1.6} aria-hidden />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="waitlist-drawer-ranks">
              {ranks.map((r) => (
                <div key={r.detail} className="waitlist-drawer-rank">
                  <span className="waitlist-drawer-rank-dot" aria-hidden />
                  <div>
                    <p className="waitlist-drawer-rank-org">{r.org}</p>
                    <p className="waitlist-drawer-rank-detail">{r.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
