"use client";

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { updateWaitlistForm } from "@/features/waitlist/waitlist.slice";
import { joinStepHref } from "@/lib/join";
import { useAppDispatch } from "@/store/hooks";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Props = {
  placeholder?: string;
  label: string;
  note?: string;
};

/**
 * Hands the address to the existing waitlist slice and drops the visitor into
 * the join flow at its first step — the step screens themselves are untouched.
 */
export function BubbaCapture({
  placeholder = "Email address",
  label,
  note,
}: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const inputId = useId();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = value.trim();

    if (!email) {
      setError("Enter your email to continue.");
      return;
    }
    if (!EMAIL_PATTERN.test(email)) {
      setError("That address doesn't look right. Check it and try again.");
      return;
    }

    setError(null);
    dispatch(updateWaitlistForm({ email }));
    // Straight into the first collecting step — the address is already
    // in the store, so the intro screen would just ask for it again.
    router.push(joinStepHref(0));
  };

  return (
    <div>
      <form className="bb-capture" onSubmit={handleSubmit} noValidate>
        <label className="bb-sr" htmlFor={inputId}>
          {label}
        </label>
        <input
          id={inputId}
          className="bb-capture-input"
          type="email"
          name="email"
          autoComplete="email"
          placeholder={placeholder}
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            if (error) setError(null);
          }}
          aria-invalid={error ? true : undefined}
        />
        <button type="submit" className="bb-capture-btn" aria-label={label}>
          <svg width="20" height="10" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.97 4.1174L15.05 0.2175C14.76 -0.0725 14.28 -0.0725 13.99 0.2175C13.7 0.5075 13.7 0.987559 13.99 1.27756L16.62 3.89768H0.75C0.34 3.89768 0 4.23768 0 4.64768C0 5.05768 0.34 5.39768 0.75 5.39768H16.62L13.99 8.0173C13.7 8.3073 13.7 8.78736 13.99 9.07736C14.28 9.36736 14.76 9.36736 15.05 9.07736L18.97 5.17746C19.26 4.88746 19.26 4.4074 18.97 4.1174Z" fill="white"/>
          </svg>
        </button>
      </form>

      {error ? (
        <p className="bb-capture-note bb-capture-note--error" role="alert">
          {error}
        </p>
      ) : note ? (
        <p className="bb-capture-note">{note}</p>
      ) : null}
    </div>
  );
}
