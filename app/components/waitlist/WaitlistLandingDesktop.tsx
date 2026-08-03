"use client";

import React, { useState, useEffect, useRef, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Heart,
  Zap,
  Compass,
  Clock,
  Calendar,
  Sparkles,
  Gift,
} from "lucide-react";

import Navbar from "../Navbar";

import { updateWaitlistForm } from "@/features/waitlist/waitlist.slice";
import {
  WAITLIST_ARTBOARDS,
  WAITLIST_CITIES,
  WAITLIST_HERO_CITIES,
  WAITLIST_HERO_IMAGE,
  WAITLIST_HERO_IMAGE_MOBILE,
} from "@/lib/waitlist";
import { useAppDispatch } from "@/store/hooks";

export function WaitlistLandingDesktop() {
  const joinHref = WAITLIST_ARTBOARDS["1"].nextHref!;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [activeCity, setActiveCity] = useState(0);
  const [time, setTime] = useState({ h: 23, m: 58, s: 12 });
  const emailRef = useRef<HTMLInputElement>(null);
  const footerEmailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");
  const totalSecs = time.h * 3600 + time.m * 60 + time.s;
  const maxSecs = 24 * 3600;
  const dashArray = 276;
  const filled = (totalSecs / maxSecs) * dashArray;

  const handleEmailSubmit = (
    event: FormEvent<HTMLFormElement>,
    input: HTMLInputElement | null,
  ) => {
    event.preventDefault();
    const email = input?.value.trim();
    if (!email) {
      return;
    }

    dispatch(updateWaitlistForm({ email }));
    router.push(joinHref);
  };

  return (
    <div className="wld-root">
      <Navbar activePage="home" fullWidth={true} />

      {/* ── Hero ── */}
      <section className="wld-hero">
        <div className="wld-hero-left">
          <p className="wld-eyebrow">Launching this summer</p>
          <h1 className="wld-hero-title">Together,<br />today.</h1>
          <p className="wld-hero-sub">
            24 hour to chat.<br />
          </p>
          <form
            className="wld-email-pill"
            onSubmit={(event) => handleEmailSubmit(event, emailRef.current)}
          >
            <input
              ref={emailRef}
              type="email"
              name="email"
              placeholder="Enter email to join waitlist"
              className="wld-email-input"
            />
            <button type="submit" className="wld-email-btn" aria-label="Join waitlist">
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </form>
        </div>
        <div className="wld-hero-right">
          <div className="wld-hero-img-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={WAITLIST_HERO_IMAGE}
              alt="People connecting on Bea"
              className="wld-hero-img wld-hero-img--desktop"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={WAITLIST_HERO_IMAGE_MOBILE}
              alt="People connecting on Bea"
              className="wld-hero-img wld-hero-img--mobile"
            />
          </div>
        </div>
      </section>

      {/* ── City pills + experience ── */}
      <section className="wld-cities-section">
        <p className="wld-eyebrow" style={{ marginBottom: "12px", color: "#1a1a1a", letterSpacing: "0.05em", fontSize: "14px", fontWeight: "500", textTransform: "none", fontFamily: "var(--font-lato), sans-serif" }}>Launching first in</p>
        <div className="wld-city-pills">
          {WAITLIST_HERO_CITIES.map((city, i) => (
            <button
              key={city}
              type="button"
              onClick={() => setActiveCity(i)}
              className={`wld-city-pill${activeCity === i ? " wld-city-pill--active" : ""}`}
            >
              {city}
            </button>
          ))}
        </div>

        <div className="wld-experience-container">
          <div className="wld-experience-left">
            <h2>Experience the<br />waitlist</h2>
          </div>
          <div className="wld-experience-steps">
            <div className="wld-experience-step">
              <div className="wld-experience-icon-wrap">
                <span className="wld-experience-badge">1</span>
                <Calendar size={36} strokeWidth={1.5} className="wld-experience-icon" />
              </div>
              <div className="wld-experience-text">
                <h3>Join the<br />waitlist</h3>
                <div className="wld-experience-badges">
                  <span>Choose your campus</span>
                  <span>and market</span>
                </div>
              </div>
            </div>
            <div className="wld-experience-step">
              <div className="wld-experience-icon-wrap">
                <span className="wld-experience-badge">2</span>
                <Sparkles size={36} strokeWidth={1.5} className="wld-experience-icon" />
              </div>
              <div className="wld-experience-text">
                <h3>Friendly<br />competition</h3>
                <div className="wld-experience-badges">
                  <span>Daily icebreaker prompts</span>
                  <span>Post and vote to gain points</span>
                </div>
              </div>
            </div>
            <div className="wld-experience-step">
              <div className="wld-experience-icon-wrap">
                <span className="wld-experience-badge">3</span>
                <Gift size={36} strokeWidth={1.5} className="wld-experience-icon" />
              </div>
              <div className="wld-experience-text">
                <h3>Win prizes &amp;<br />perks</h3>
                <div className="wld-experience-badges">
                  <span>We&apos;re giving away in-app perks,</span>
                  <span>merch, cash, &amp; a car!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timer / features ── */}
      <section className="wld-timer-section">
        <div className="wld-timer-col">
          <div className="wld-timer-ring">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="#ebe4dc" strokeWidth="5" />
              <circle
                cx="50" cy="50" r="44"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="5"
                strokeDasharray="205 71"
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="wld-timer-inner">
              <span className="wld-timer-time">{pad(time.h)}:{pad(time.m)}:{pad(time.s)}</span>
              <div className="wld-timer-labels">
                <span>HRS</span><span>MIN</span><span>SEC</span>
              </div>
              <Zap size={22} className="wld-timer-icon-center" fill="currentColor" strokeWidth={0} />
            </div>
          </div>
        </div>
        <div className="wld-timer-content">
          <p className="wld-eyebrow">Built for the moment</p>
          <h2 className="wld-section-title">24 hours to connect.</h2>
          <p className="wld-section-sub">Less text, more date.</p>
          <div className="wld-features">
            <div className="wld-feature-item">
              <Heart size={26} strokeWidth={1.5} className="wld-feature-icon" />
              <span className="wld-feature-label">Match<br />with intention</span>
            </div>
            <div className="wld-feature-item">
              <Clock size={26} strokeWidth={1.5} className="wld-feature-icon" />
              <span className="wld-feature-label">Connect<br />today</span>
            </div>
            <div className="wld-feature-item">
              <Compass size={26} strokeWidth={1.5} className="wld-feature-icon" />
              <span className="wld-feature-label">Explore<br />anywhere</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── City cards ── */}
      <section className="wld-launch-section">
        <div className="wld-launch-left">
          <p className="wld-eyebrow">Launching soon</p>
          <h2 className="wld-launch-title">We&rsquo;re curating<br />something special.</h2>
        </div>
        <div className="wld-city-cards">
          {WAITLIST_CITIES.map((city) => (
            <div key={city.id} className="wld-city-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={city.image} alt={city.name} className="wld-city-card-img" />
              <div className="wld-city-card-overlay">
                <p className="wld-city-card-name">{city.name}</p>
                <p className="wld-city-card-count">{city.plans}</p>
                <p className="wld-city-card-label">plans tonight</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="wld-footer-section">
        <div className="wld-footer-left">
          <h2 className="wld-footer-title">Be first when Bea launches.</h2>
          <p className="wld-footer-sub">Meet intentionally. Connect faster.</p>
          <div className="wld-footer-features">
            <div className="wld-footer-feature"><span>Early</span><span>access</span></div>
            <div className="wld-footer-feature"><span>Interactive</span><span>waitlist experience</span></div>
            <div className="wld-footer-feature"><span>Shape the</span><span>community</span></div>
          </div>
        </div>
        <form
          className="wld-footer-form"
          onSubmit={(event) => handleEmailSubmit(event, footerEmailRef.current)}
        >
          <input
            ref={footerEmailRef}
            type="email"
            name="email"
            placeholder="Your email address"
            className="wld-footer-input"
          />
          <button type="submit" className="wld-footer-btn">
            Join waitlist
            <ArrowRight size={16} strokeWidth={2} />
          </button>
        </form>
      </section>
    </div>
  );
}
