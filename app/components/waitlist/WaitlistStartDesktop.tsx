"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { updateWaitlistForm } from "@/features/waitlist/waitlist.slice";
import { selectWaitlistForm } from "@/features/waitlist/waitlist.selectors";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { WaitlistFieldError } from "./WaitlistFieldError";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function WaitlistStartDesktop() {
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
    <div className="wld-step7-container">
      <div className="wld-step7-left">
        <div className="wld-step7-top">
          <Link href="/" className="wld-step7-back">
            <ArrowLeft size={24} strokeWidth={2} />
          </Link>
          <div className="wld-step7-progress">
            <div className="wld-step7-progress-bar" />
            <div className="wld-step7-progress-bar" />
            <div className="wld-step7-progress-bar" />
            <div className="wld-step7-progress-bar" />
          </div>
        </div>

        <div className="wld-step7-header">
          <h1 className="wld-step7-title">What&apos;s your email?</h1>
          <p className="wld-step7-subtitle">
            We&apos;ll use this to save your spot on the waitlist.
          </p>
        </div>

        <div className="wld-step7-field-wrapper">
          <input
            id="waitlist-start-email"
            type="email"
            className="wld-step7-input"
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

        <div className="wld-step7-actions">
          <button
            type="button"
            className="wld-step7-primary-btn"
            onClick={handleContinue}
          >
            Continue
            <ArrowRight size={20} strokeWidth={2} style={{ marginLeft: "8px" }} />
          </button>
          <WaitlistFieldError message={error} />
        </div>
      </div>
    </div>
  );
}
