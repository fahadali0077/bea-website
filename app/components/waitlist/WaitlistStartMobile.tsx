"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Heart, Mail } from "lucide-react";

import { updateWaitlistForm } from "@/features/waitlist/waitlist.slice";
import { selectWaitlistForm } from "@/features/waitlist/waitlist.selectors";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { WaitlistFieldError } from "./WaitlistFieldError";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function WaitlistStartMobile() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const form = useAppSelector(selectWaitlistForm);
  const [email, setEmail] = useState(form.email);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    const value = email.trim();
    if (!value) {
      setError("Email is required.");
      return;
    }
    if (!EMAIL_RE.test(value)) {
      setError("Enter a valid email address.");
      return;
    }

    setError(null);
    dispatch(updateWaitlistForm({ email: value }));
    router.push("/waitlist/3");
  };

  return (
    <div className="waitlist-root waitlist-coded waitlist-email-start">
      <main className="waitlist-email-start__content font-sfpro!">
        <div className="waitlist-email-start__wordmark">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/4x/BubbaLogo.png" alt="Bubba" style={{ display: "block", width: "auto", height: 26 }} />
        </div>
        <h1 className="font-canela!">
          Join the waitlist<br />for early access<br />to <span>your city</span>
        </h1>
        <p className="font-sfpro! waitlist-email-start__intro">
          Bea is launching soon.<br />We&apos;ve designed a special waitlist<br />experience beforehand.
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/4x/market.png" alt="An illustrated bench and signs" className="waitlist-email-start__art" />
        <div className="waitlist-email-start__form">
          <label htmlFor="waitlist-start-email">Enter your email to get started</label>
          <div className="waitlist-email-start__input-wrap">
            <Mail size={26} aria-hidden="true" />
            <input
              id="waitlist-start-email"
              type="email"
              className="font-sfpro!"
              placeholder="you@email.com"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError(null);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleContinue();
                }
              }}
            />
          </div>
          <button type="button" className="waitlist-email-start__submit font-sfpro!" style={{position:"relative", cursor: "pointer"}} onClick={handleContinue}>
            Join the waitlist <ArrowRight size={21} aria-hidden="true" style={{ position: "absolute", right: "24px" }} />
          </button>
          <p className="waitlist-email-start__privacy font-sfpro!"><Heart size={22} aria-hidden="true" /> We&apos;ll never spam you. Unsubscribe anytime.</p>
          <WaitlistFieldError message={error} />
        </div>
      </main>
    </div>
  );
}
