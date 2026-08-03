/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Mail } from "lucide-react";

import { WAYS_STEP } from "@/lib/launch";
import {
  useGetMeQuery,
  useResendAmbassadorInviteMutation,
  useValidateAmbassadorOnboardingQuery,
} from "@/features/api/apiSlice";
import { readAccessToken } from "@/lib/api";
import { describeInviteFailure, getErrorStatus } from "@/lib/invite-failure";

const LOGIN_REDIRECT_SECONDS = 5;

export function VerifyEmailStep() {
  const router = useRouter();
  const { eyebrow, titleLines, bodyPrefix, continuePrompt, resend } = WAYS_STEP;

  const [token, setToken] = useState("");
  const [tokenChecked, setTokenChecked] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null | undefined>(undefined);
  const [resent, setResent] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(LOGIN_REDIRECT_SECONDS);

  useEffect(() => {
    setToken(sessionStorage.getItem("ambassador_onboarding_token") ?? "");
    setTokenChecked(true);
    setAccessToken(readAccessToken());
  }, []);

  const {
    data: invite,
    isFetching: validating,
    isError: inviteRejected,
    error: inviteError,
  } = useValidateAmbassadorOnboardingQuery(token, { skip: !token });

  const {
    data: me,
    isLoading: meLoading,
    isFetching: meFetching,
    isSuccess: meSuccess,
  } = useGetMeQuery(undefined, { skip: !accessToken });

  const [resendInvite, { isLoading: resending }] = useResendAmbassadorInviteMutation();

  const isAmbassador = meSuccess && me?.user.role === "AMBASSADOR";
  const checkingSession = accessToken === undefined || (Boolean(accessToken) && (meLoading || meFetching));

  const status = token ? getErrorStatus(inviteError) : undefined;
  const failure = (tokenChecked && !token) || inviteRejected ? describeInviteFailure(status) : null;

  // 409 means the invite was spent, so the account exists. Where that person
  // belongs depends purely on whether they still have a session here.
  const inviteAlreadyUsed = Boolean(failure) && status === 409;

  // Signed-in ambassador: nothing to read, nothing to do — send them straight on.
  useEffect(() => {
    if (inviteAlreadyUsed && !checkingSession && isAmbassador) {
      router.replace("/dashboard/ambassador");
    }
  }, [inviteAlreadyUsed, checkingSession, isAmbassador, router]);

  // Signed out: show the reason, then move them along to log in.
  useEffect(() => {
    if (!inviteAlreadyUsed || checkingSession || isAmbassador) return;

    if (countdown <= 0) {
      router.replace("/auth/login");
      return;
    }

    const timer = setTimeout(() => setCountdown((n) => n - 1), 1000);
    return () => clearTimeout(timer);
  }, [inviteAlreadyUsed, checkingSession, isAmbassador, countdown, router]);

  const handleResend = async () => {
    if (!token) return;
    setResendError(null);
    try {
      await resendInvite(token).unwrap();
      setResent(true);
    } catch (err) {
      // Surface the server's own reason — a used or revoked invite will never
      // succeed on a retry, so "try again in a moment" would be misleading.
      setResendError((err as { message?: string })?.message ?? "Couldn't resend right now. Please try again.");
    }
  };

  const renderArt = () => (
    <div className="verify-art">
      <Image src="/images/onboarding/sailboat.png" alt="" width={1044} height={1008} aria-hidden="true" />
    </div>
  );

  const shell = (children: React.ReactNode) => (
    <section className="launch-step launch-step--verify">
      <div className="launch-step-inner launch-step-inner--verify">
        {renderArt()}
        <div className="verify-content">{children}</div>
      </div>
    </section>
  );

  if (!tokenChecked || validating || (inviteAlreadyUsed && checkingSession)) {
    return shell(
      <>
        <span className="verify-icon" aria-hidden="true">
          <Loader2 size={22} strokeWidth={1.6} className="animate-spin" />
        </span>
        <p className="verify-lede">Checking your invite…</p>
      </>,
    );
  }

  if (inviteAlreadyUsed && isAmbassador) {
    return shell(
      <>
        <span className="verify-icon" aria-hidden="true">
          <Loader2 size={22} strokeWidth={1.6} className="animate-spin" />
        </span>
        <h1 className="verify-title font-canela onboarding-heading">You&apos;re already set up.</h1>
        <p className="verify-lede">Taking you to your ambassador dashboard…</p>
        <div className="verify-links">
          <Link href="/dashboard/ambassador" className="verify-link">
            Go there now
          </Link>
        </div>
      </>,
    );
  }

  if (failure) {
    return shell(
      <>
        <span className="verify-icon" aria-hidden="true">
          <Mail size={22} strokeWidth={1.6} />
        </span>
        <h1 className="verify-title font-canela onboarding-heading">{failure.title}</h1>
        <p className="verify-lede">{failure.body}</p>

        {inviteAlreadyUsed && (
          <p className="verify-hint">
            Redirecting you to the login page in {countdown} second{countdown === 1 ? "" : "s"}.
          </p>
        )}

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

        {!inviteAlreadyUsed && (
          <div className="verify-links">
            <Link href="/auth/login" className="verify-link">
              Already have an account? Log in
            </Link>
          </div>
        )}
      </>,
    );
  }

  // Invite is valid. alreadyRegistered means a user row exists — true for a
  // waitlist member being promoted, who still needs to finish onboarding. It is
  // not the same as "already an ambassador", so it never blocks the flow.
  const accountExists = Boolean(invite?.alreadyRegistered);

  return shell(
    <>
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
          You already have a Bea account with this email. Continuing will upgrade it to an ambassador account — nothing
          you&apos;ve already earned is lost.
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
    </>,
  );
}
