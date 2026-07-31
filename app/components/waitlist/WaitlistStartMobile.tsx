"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import { updateWaitlistForm } from "@/features/waitlist/waitlist.slice";
import { selectWaitlistForm } from "@/features/waitlist/waitlist.selectors";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { WaitlistContinueButton } from "./WaitlistContinueButton";
import { WaitlistFieldError } from "./WaitlistFieldError";
import { WaitlistProgress } from "./WaitlistProgress";

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
    <div className="waitlist-root waitlist-coded">
      <div className="waitlist-step-shell">
        <div className="waitlist-step-top">
          <Link href="/" className="waitlist-back" aria-label="Go back">
            <ArrowLeft size={24} strokeWidth={1.75} />
          </Link>
          <WaitlistProgress filledCount={0} />
        </div>

        <div className="waitlist-step-body">
          <h1 className="waitlist-step-title waitlist-step-title--serif">
            What&apos;s your email?
          </h1>
          <p className="waitlist-step-subtitle">
            We&apos;ll use this to save your spot on the waitlist.
          </p>

          <div className="waitlist-search-block">
            <label className="waitlist-field-label" htmlFor="waitlist-start-email">
              Email
            </label>
            <input
              id="waitlist-start-email"
              type="email"
              className="waitlist-box-input"
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

          <WaitlistContinueButton label="Continue" onContinue={handleContinue} />
          <WaitlistFieldError message={error} />
        </div>
      </div>
    </div>
  );
}
