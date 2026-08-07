"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Heart, Mail } from "lucide-react";

import { updateWaitlistForm } from "@/features/waitlist/waitlist.slice";
import { BUBBA_BRAND } from "@/lib/bubba-content";
import { joinStepHref } from "@/lib/join";
import { useAppDispatch } from "@/store/hooks";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function JoinIntro() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = value.trim();
    if (!EMAIL.test(email)) {
      setError("That address doesn't look right. Check it and try again.");
      return;
    }
    setError(null);
    dispatch(updateWaitlistForm({ email }));
    router.push(joinStepHref(0));
  };

  return (
    <div className="jn-page jn-page--intro">
      <header className="jn-top jn-top--intro">
        <Link href="/" className="jn-brand" aria-label="Bubba — home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BUBBA_BRAND.wordmark} alt="Bubba" />
        </Link>
      </header>

      <main className="jn-main jn-main--intro">
        <div className="jn-intro-copy">
          <h1 className="jn-intro-title">
          Join the waitlist
          <br />
          for early access
          <br />
            to <span className="jn-intro-accent">your city</span>
          </h1>

          <p className="jn-intro-sub">
            Bubba is launching soon.
            <br />
            We&rsquo;ve designed a special waitlist
            <br />
            experience beforehand.
          </p>

          <form className="jn-intro-form" onSubmit={submit} noValidate>
          <label className="jn-field-label" htmlFor="jn-intro-email">
            Enter your email to get started
          </label>
          <div className="jn-input-wrap">
            <Mail
              className="jn-input-icon"
              size={16}
              strokeWidth={1.8}
              aria-hidden="true"
            />
            <input
              id="jn-intro-email"
              className="jn-input jn-input--icon"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@email.com"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (error) setError(null);
              }}
            />
          </div>
          {error ? (
            <p className="jn-error" role="alert">
              {error}
            </p>
          ) : null}

          <button type="submit" className="jn-cta">
            Join the waitlist
            <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.85 17.5623C11.5 17.2123 11.5 16.6525 11.85 16.3025L18.35 9.80254H0.890015C0.400015 9.80254 0 9.4024 0 8.9124C0 8.4224 0.400015 8.02227 0.890015 8.02227H18.35L11.85 1.52227C11.5 1.17227 11.5 0.6125 11.85 0.2625C12.2 -0.0875 12.76 -0.0875 13.11 0.2625L21.14 8.29228C21.49 8.64228 21.49 9.20254 21.14 9.55254L13.11 17.5823C12.76 17.9323 12.2 17.9323 11.85 17.5823V17.5623Z" fill="white"/>
            </svg>
          </button>
        </form>

          <p className="jn-promise">
            <Heart size={13} strokeWidth={1.8} />
            We&rsquo;ll never spam you. Unsubscribe anytime.
          </p>
        </div>

        <div className="jn-intro-art" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/bubba/intro-bench.png" alt="" />
        </div>
      </main>
    </div>
  );
}
