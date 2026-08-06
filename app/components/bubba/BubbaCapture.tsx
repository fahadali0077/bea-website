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
          <ArrowRight size={17} strokeWidth={2.2} />
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
