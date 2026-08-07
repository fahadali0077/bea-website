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
          <img src="/bubba/logo.png" alt="Bubba" />
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
          <div className="jn-input-wrap relative">
            <svg className="absolute left-[17.5px] top-[25.56px]" width="26" height="20" viewBox="0 0 26 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25 0H1C0.45 0 0 0.45 0 1V18C0 19.1 0.9 20 2 20H24C25.1 20 26 19.1 26 18V1C26 0.45 25.55 0 25 0ZM22.4299 2L13 10.6401L3.56995 2H22.4299ZM24 18H2V3.27002L12.3199 12.73C12.6999 13.08 13.29 13.08 13.67 12.73L23.99 3.27002V18H24Z" fill="#C4C4C4"/>
            </svg>

            <input
              id="jn-intro-email"
              className="jn-input jn-input--icon pl-[61.99px]!"
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

          <button type="submit" className="jn-cta mt-[40.76px]">
            Join the waitlist
            <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.85 17.5623C11.5 17.2123 11.5 16.6525 11.85 16.3025L18.35 9.80254H0.890015C0.400015 9.80254 0 9.4024 0 8.9124C0 8.4224 0.400015 8.02227 0.890015 8.02227H18.35L11.85 1.52227C11.5 1.17227 11.5 0.6125 11.85 0.2625C12.2 -0.0875 12.76 -0.0875 13.11 0.2625L21.14 8.29228C21.49 8.64228 21.49 9.20254 21.14 9.55254L13.11 17.5823C12.76 17.9323 12.2 17.9323 11.85 17.5823V17.5623Z" fill="white"/>
            </svg>
          </button>
        </form>

          <p className="jn-promise">
            <svg width="23" height="20" viewBox="0 0 23 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.23 0C14.16 0 12.35 0.890137 11.22 2.39014C10.09 0.890137 8.27996 0 6.20996 0C2.77996 0 0.01 2.77996 0 6.20996C0 13.22 10.39 18.8899 10.83 19.1299C11.07 19.2599 11.35 19.2599 11.59 19.1299C12.03 18.8999 22.4199 13.22 22.4199 6.20996C22.4199 2.77996 19.64 0.01 16.21 0H16.23ZM11.22 17.5C9.38997 16.43 1.60999 11.58 1.60999 6.20996C1.60999 3.66996 3.66997 1.6101 6.21997 1.6001C8.16997 1.6001 9.79998 2.6398 10.48 4.2998C10.65 4.7098 11.1199 4.90023 11.5299 4.74023C11.7299 4.66023 11.89 4.4998 11.97 4.2998C12.65 2.6298 14.29 1.6001 16.23 1.6001C18.77 1.6001 20.83 3.65996 20.84 6.20996C20.84 11.58 13.05 16.44 11.23 17.5H11.22Z" fill="#7190BA"/>
            </svg>
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
