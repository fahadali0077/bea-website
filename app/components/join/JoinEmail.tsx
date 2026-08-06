"use client";

import { useRouter } from "next/navigation";

import { joinWaitlist, updateWaitlistForm } from "@/features/waitlist/waitlist.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { JoinShell } from "./JoinShell";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Last collecting step — this is where the whole form is submitted, so
 * Continue waits on the request rather than navigating optimistically.
 */
export function JoinEmail() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { form, joinStatus, joinError } = useAppSelector((s) => s.waitlist);

  const valid = EMAIL.test(form.email.trim());

  const submit = () => {
    void dispatch(joinWaitlist())
      .unwrap()
      .then(() => router.push("/waitlist/done"))
      .catch(() => {
        /* joinError is already in the store; the shell renders it. */
      });
    return false;
  };

  return (
    <JoinShell
      slug="email"
      canContinue={valid}
      busy={joinStatus === "loading"}
      error={joinError}
      onContinue={submit}
    >
      <input
        className="jn-input"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="you@email.com"
        value={form.email}
        onChange={(e) => dispatch(updateWaitlistForm({ email: e.target.value }))}
        aria-label="Email address"
      />
    </JoinShell>
  );
}
