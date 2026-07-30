"use client";

import React, { type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import Navbar from "../Navbar";

import { updateWaitlistForm } from "@/features/waitlist/waitlist.slice";
import { WAITLIST_ARTBOARDS, WAITLIST_CITIES, WAITLIST_HERO_CITIES, WAITLIST_HERO_IMAGE } from "@/lib/waitlist";
import { WAITLIST_LANDING_CONTENT } from "@/lib/waitlist-page-content";
import { useAppDispatch } from "@/store/hooks";

import { WaitlistCityCarousel } from "./WaitlistCityCarousel";

export function WaitlistLandingMobile() {
  const joinHref = WAITLIST_ARTBOARDS["1"].nextHref!;
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleEmailSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    if (!email) {
      return;
    }

    dispatch(updateWaitlistForm({ email }));
    router.push(joinHref);
  };

  return (
    <div className="waitlist-root waitlist-landing-mobile">
      <Navbar activePage="home" fullWidth={true} />

      <section className="waitlist-hero">
        <div>
          <p className="waitlist-hero-eyebrow">{WAITLIST_LANDING_CONTENT.eyebrow}</p>
          <h1 className="waitlist-hero-title">
            Together,
            <br />
            today.
          </h1>
          <p className="waitlist-hero-sub">{WAITLIST_LANDING_CONTENT.subtitle}</p>

          <form className="waitlist-email-pill" onSubmit={handleEmailSubmit}>
            <input
              type="email"
              name="email"
              placeholder={WAITLIST_LANDING_CONTENT.emailPlaceholder}
              aria-label={WAITLIST_LANDING_CONTENT.emailPlaceholder}
            />
            <button type="submit" aria-label="Join waitlist">
              <ArrowRight size={16} strokeWidth={2} />
            </button>
          </form>

          <div className="waitlist-city-pills">
            {WAITLIST_HERO_CITIES.map((city, i) => (
              <span
                key={city}
                className={
                  "waitlist-city-pill" + (i === 0 ? " waitlist-city-pill--active" : "")
                }
              >
                {city}
              </span>
            ))}
          </div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={WAITLIST_HERO_IMAGE}
          alt=""
          className="waitlist-hero-image"
          width={600}
          height={450}
        />
      </section>

      <section className="waitlist-section waitlist-section--timer">
        <div className="waitlist-section-grid">
          <div>
            <h2 className="waitlist-section-heading">{WAITLIST_LANDING_CONTENT.timerHeading}</h2>
            <p className="waitlist-section-serif">{WAITLIST_LANDING_CONTENT.timerBody}</p>
          </div>
          <div className="waitlist-timer-ring" aria-hidden>
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="#ebe4dc" strokeWidth="6" />
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="6"
                strokeDasharray="210 276"
                strokeLinecap="round"
              />
            </svg>
            <div className="waitlist-timer-inner">
              <span className="waitlist-timer-time">12:04:33</span>
              <div className="waitlist-timer-labels">
                <span>HRS</span>
                <span>MIN</span>
                <span>SEC</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="waitlist-section">
        <h2 className="waitlist-section-heading">{WAITLIST_LANDING_CONTENT.featuresHeading}</h2>
        <div className="waitlist-feature-row">
          {WAITLIST_LANDING_CONTENT.features.map((feature) => (
            <div key={feature} className="waitlist-feature-item">
              <span aria-hidden>✓</span>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="waitlist-section waitlist-section--launch">
        <h2 className="waitlist-section-heading">{WAITLIST_LANDING_CONTENT.launchHeading}</h2>
        <p className="waitlist-launch-subtitle">{WAITLIST_LANDING_CONTENT.launchSubtitle}</p>
        <WaitlistCityCarousel
          cities={WAITLIST_CITIES.map((city) => ({
            id: city.id,
            name: city.name,
            plans: city.plans,
            image: city.image,
            city: city.name,
            state: null,
          }))}
        />
      </section>

      <section className="waitlist-section waitlist-section--footer">
        <div className="waitlist-footer-cta">
          <h2 className="waitlist-footer-title">
            {WAITLIST_LANDING_CONTENT.footerTitle}
            <br />
            <em>{WAITLIST_LANDING_CONTENT.footerEmphasis}</em>
          </h2>
          <form className="waitlist-footer-form" onSubmit={handleEmailSubmit}>
            <input
              type="email"
              name="email"
              className="waitlist-box-input waitlist-footer-input"
              placeholder={WAITLIST_LANDING_CONTENT.footerEmailPlaceholder}
              aria-label={WAITLIST_LANDING_CONTENT.footerEmailPlaceholder}
            />
            <button type="submit" className="waitlist-btn-primary waitlist-footer-submit">
              {WAITLIST_LANDING_CONTENT.footerCta}
              <ArrowRight size={18} strokeWidth={2} aria-hidden />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
