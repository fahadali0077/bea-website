"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { readAccessToken } from "@/lib/api";
import {
  useGetMeQuery,
  useResendAmbassadorInviteMutation,
  useValidateAmbassadorOnboardingQuery,
} from "@/features/api/apiSlice";
import { markStepReached, type OnboardingStepId } from "@/lib/onboarding-progress";
import { describeInviteFailure, getErrorStatus } from "@/lib/invite-failure";

const ALLOWED_NEXT_STEPS = new Set([
  "onboarding",
  "the-role",
  "verify-email",
  "account",
  "your-school",
  "youre-in",
]);

function CenteredPanel({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center gap-3 px-6 text-center">
      {children}
    </main>
  );
}

function RedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const requestedNext = searchParams.get("next") ?? "";
  const nextStep = ALLOWED_NEXT_STEPS.has(requestedNext) ? requestedNext : "onboarding";

  const [accessToken, setAccessToken] = useState<string | null | undefined>(undefined);
  const [resent, setResent] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  useEffect(() => {
    setAccessToken(readAccessToken());
  }, []);

  const {
    data: me,
    isLoading: meLoading,
    isFetching: meFetching,
    isSuccess: meSuccess,
  } = useGetMeQuery(undefined, { skip: !accessToken });

  const isAmbassador = meSuccess && me?.user.role === "AMBASSADOR";
  const stillCheckingSession = accessToken === undefined || (Boolean(accessToken) && (meLoading || meFetching));

  // Whether the invite has been used lives in the database, not in this browser.
  // The session check above is only a fast path — it can't answer this on a
  // different device, in a private window, or after the local session is gone.
  const {
    isFetching: validating,
    isError: inviteRejected,
    error: inviteError,
  } = useValidateAmbassadorOnboardingQuery(token, {
    skip: !token || stillCheckingSession || isAmbassador,
  });

  const [resendInvite, { isLoading: resending }] = useResendAmbassadorInviteMutation();

  const blocked = inviteRejected ? describeInviteFailure(getErrorStatus(inviteError)) : null;

  useEffect(() => {
    if (stillCheckingSession || isAmbassador) return;

    if (!token) {
      router.replace("/onboarding");
      return;
    }

    // Hold at this screen until the invite is confirmed usable, so a spent or
    // expired token never gets written to sessionStorage or started as a flow.
    if (validating || inviteRejected) return;

    sessionStorage.setItem("ambassador_onboarding_token", token);
    markStepReached(nextStep as OnboardingStepId);
    router.replace(`/${nextStep}?token=${token}`);
  }, [stillCheckingSession, isAmbassador, token, nextStep, router, validating, inviteRejected]);

  const handleResend = async () => {
    setResendError(null);
    try {
      await resendInvite(token).unwrap();
      setResent(true);
    } catch (err) {
      setResendError((err as { message?: string })?.message ?? "Couldn't resend right now. Please try again.");
    }
  };

  if (stillCheckingSession) {
    return (
      <CenteredPanel>
        <Loader2 className="w-7 h-7 text-neutral-400 animate-spin" />
        <p className="font-lato text-[14px] font-medium text-neutral-500">Initializing onboarding flow…</p>
      </CenteredPanel>
    );
  }

  if (isAmbassador) {
    return (
      <CenteredPanel>
        <p className="font-lato text-[15px] font-semibold text-neutral-800">You&apos;re already a Bea Ambassador.</p>
        <Link
          href="/dashboard/ambassador"
          className="font-lato text-[14px] font-semibold text-[#1f4d3a] underline underline-offset-2"
        >
          Go to your dashboard
        </Link>
      </CenteredPanel>
    );
  }

  if (blocked) {
    return (
      <CenteredPanel>
        <h1 className="font-canela text-[22px] leading-[1.3] text-neutral-900">{blocked.title}</h1>
        <p className="font-lato text-[14px] leading-[1.5] text-neutral-600">{blocked.body}</p>

        {blocked.action && (
          <Link
            href={blocked.action.href}
            className="mt-2 inline-flex h-12 items-center justify-center rounded-[16px] bg-[#1f4d3a] px-7 font-lato text-[14px] font-semibold text-white"
          >
            {blocked.action.label}
          </Link>
        )}

        {blocked.allowResend && (
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || resent}
            className="mt-2 inline-flex h-12 items-center justify-center rounded-[16px] bg-[#1f4d3a] px-7 font-lato text-[14px] font-semibold text-white disabled:opacity-60"
          >
            {resent ? "Email sent" : resending ? "Sending…" : "Send me a new link"}
          </button>
        )}

        {resendError && <p className="font-lato text-[13px] font-semibold text-[#b0453a]">{resendError}</p>}

        <Link
          href="/auth/login"
          className="mt-1 font-lato text-[13px] font-semibold text-neutral-500 underline underline-offset-2"
        >
          Already have an account? Log in
        </Link>
      </CenteredPanel>
    );
  }

  return (
    <CenteredPanel>
      <Loader2 className="w-7 h-7 text-neutral-400 animate-spin" />
      <p className="font-lato text-[14px] font-medium text-neutral-500">Initializing onboarding flow…</p>
    </CenteredPanel>
  );
}

export default function AmbassadorOnboardingPage() {
  return (
    <Suspense fallback={null}>
      <RedirectContent />
    </Suspense>
  );
}