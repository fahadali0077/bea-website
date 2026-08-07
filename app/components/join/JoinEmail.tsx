"use client";

import { useRouter } from "next/navigation";

import {
  clearWaitlistErrors,
  joinWaitlist,
  updateWaitlistForm,
} from "@/features/waitlist/waitlist.slice";
import { isAlreadyOnWaitlistError } from "@/lib/waitlist-errors";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { JoinAlreadyOnWaitlistModal } from "./JoinAlreadyOnWaitlistModal";
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
  const alreadyOnWaitlist = isAlreadyOnWaitlistError(joinError);
  const inlineError = alreadyOnWaitlist ? null : joinError;

  const submit = () => {
    void dispatch(joinWaitlist())
      .unwrap()
      .then(() => router.push("/waitlist/done"))
      .catch(() => {
        /* joinError is already in the store; the shell renders it. */
      });
    return false;
  };

  const dismissAlreadyOnWaitlist = () => {
    dispatch(clearWaitlistErrors());
  };

  return (
    <>
      {alreadyOnWaitlist ? (
        <JoinAlreadyOnWaitlistModal onClose={dismissAlreadyOnWaitlist} />
      ) : null}

      <JoinShell
        slug="email"
        canContinue={valid}
        busy={joinStatus === "loading"}
        error={inlineError}
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
    </>
  );
}
