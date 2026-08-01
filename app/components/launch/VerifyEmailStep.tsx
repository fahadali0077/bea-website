/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Mail } from "lucide-react";

import { WAYS_STEP } from "@/lib/launch";
import { useResendAmbassadorInviteMutation, useValidateAmbassadorOnboardingQuery } from "@/features/api/apiSlice";
import { describeInviteFailure, getErrorStatus } from "@/lib/invite-failure";

export function VerifyEmailStep() {
  const { eyebrow, titleLines, bodyPrefix, continuePrompt, resend } = WAYS_STEP;

  const [token, setToken] = useState("");
  const [tokenChecked, setTokenChecked] = useState(false);
  const [resent, setResent] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  const {
    data: invite,
    isFetching: validating,
    isError: inviteRejected,
    error: inviteError,
  } = useValidateAmbassadorOnboardingQuery(token, { skip: !token });

  const [resendInvite, { isLoading: resending }] = useResendAmbassadorInviteMutation();

  useEffect(() => {
    setToken(sessionStorage.getItem("ambassador_onboarding_token") ?? "");
    setTokenChecked(true);
  }, []);

  const handleResend = async () => {
    if (!token) return;
    setResendError(null);
    try {
      await resendInvite(token).unwrap();
      setResent(true);
    } catch (err) {
      // Surface the server's own reason rather than a generic retry message —
      // a used or revoked invite will never succeed on a second attempt.
      setResendError((err as { message?: string })?.message ?? "Couldn't resend right now. Please try again.");
    }
  };

  // A missing token is the same dead end as an unrecognised one.
  const failure =
    (tokenChecked && !token) || inviteRejected
      ? describeInviteFailure(token ? getErrorStatus(inviteError) : undefined)
      : null;

  const renderArt = () => (
    <div className="verify-art">
      <Image src="/images/onboarding/sailboat.png" alt="" width={1044} height={1008} aria-hidden="true" />
    </div>
  );

  if (!tokenChecked || validating) {
    return (
      <section className="launch-step launch-step--verify">
        <div className="launch-step-inner launch-step-inner--verify">
          {renderArt()}
          <div className="verify-content">
            <span className="verify-icon" aria-hidden="true">
              <Loader2 size={22} strokeWidth={1.6} className="animate-spin" />
            </span>
            <p className="verify-lede">Checking your invite…</p>
          </div>
        </div>
      </section>
    );
  }

  if (failure) {
    return (
      <section className="launch-step launch-step--verify">
        <div className="launch-step-inner launch-step-inner--verify">
          {renderArt()}
          <div className="verify-content">
            <span className="verify-icon" aria-hidden="true">
              <Mail size={22} strokeWidth={1.6} />
            </span>
            <h1 className="verify-title font-canela onboarding-heading">{failure.title}</h1>
            <p className="verify-lede">{failure.body}</p>

            {failure.action && (
              <Link href={failure.action.href} className="launch-cta verify-blocked-cta">
                {failure.action.label}
              </Link>
            )}

            {failure.allowResend && (
              <button
                type="button"
                className="launch-cta verify-blocked-cta"
                onClick={handleResend}
                disabled={resending || resent}
              >
                {resent ? "Email sent" : resending ? "Sending…" : "Send me a new link"}
              </button>
            )}

            {resendError && (
              <p className="verify-error" role="alert">
                {resendError}
              </p>
            )}

            <div className="verify-links">
              <Link href="/auth/login" className="verify-link">
                Already have an account? Log in
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Invite is valid. alreadyRegistered tells us whether the user row exists yet:
  // it does when a waitlist member is being promoted, and doesn't for a brand
  // new ambassador. Both can continue — the copy just needs to differ.
  const accountExists = Boolean(invite?.alreadyRegistered);

  return (
    <section className="launch-step launch-step--verify">
      <div className="launch-step-inner launch-step-inner--verify">
        {renderArt()}

        <div className="verify-content">
          <span className="verify-icon" aria-hidden="true">
            <Mail size={22} strokeWidth={1.6} />
          </span>
          <p className="verify-eyebrow">{eyebrow}</p>
          <h1 className="verify-title font-canela onboarding-heading">
            {titleLines.map((line, i) => (
              <span key={line}>
                {line}
                {i < titleLines.length - 1 && <br />}
              </span>
            ))}
          </h1>
          <p className="verify-lede">
            {bodyPrefix} <strong>{invite?.email}</strong>
          </p>

          {accountExists && (
            <p className="launch-already-registered">
              You already have a Bea account with this email. Continuing will upgrade it to an ambassador account —
              nothing you&apos;ve already earned is lost.
            </p>
          )}

          <p className="verify-hint">
            {continuePrompt.split("\n").map((line, i, arr) => (
              <span key={line}>
                {line}
                {i < arr.length - 1 && " "}
              </span>
            ))}
          </p>

          {resendError && (
            <p className="verify-error" role="alert">
              {resendError}
            </p>
          )}

          <div className="verify-links">
            <button type="button" className="verify-link" onClick={handleResend} disabled={resending || resent}>
              {resent ? "Email sent" : resending ? "Sending…" : resend.label}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}