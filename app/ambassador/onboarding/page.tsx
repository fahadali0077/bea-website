"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { readAccessToken } from "@/lib/api";
import { useGetMeQuery } from "@/features/api/apiSlice";
import { markStepReached, type OnboardingStepId } from "@/lib/onboarding-progress";

const ALLOWED_NEXT_STEPS = new Set([
  "onboarding",
  "the-role",
  "verify-email",
  "account",
  "your-school",
  "youre-in",
]);

function RedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const requestedNext = searchParams.get("next") ?? "";
  const nextStep = ALLOWED_NEXT_STEPS.has(requestedNext) ? requestedNext : "onboarding";

  const [accessToken, setAccessToken] = useState<string | null | undefined>(undefined);

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

  // Only fall through into the invite-link redirect once we know for sure
  // this isn't an already-logged-in ambassador clicking a stale invite link.
  useEffect(() => {
    if (stillCheckingSession || isAmbassador) return;

    if (token) {
      sessionStorage.setItem("ambassador_onboarding_token", token);
      markStepReached(nextStep as OnboardingStepId);
      router.replace(`/${nextStep}?token=${token}`);
    } else {
      router.replace("/onboarding");
    }
  }, [stillCheckingSession, isAmbassador, token, nextStep, router]);

  if (stillCheckingSession) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6 text-center">
        <Loader2 className="w-7 h-7 text-neutral-400 animate-spin" />
        <p className="font-lato text-[14px] font-medium text-neutral-500 mt-3">Initializing onboarding flow…</p>
      </main>
    );
  }

  if (isAmbassador) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6 text-center gap-3">
        <p className="font-lato text-[15px] font-semibold text-neutral-800">
          You&apos;re already a Bea Ambassador.
        </p>
        <Link
          href="/dashboard/ambassador"
          className="font-lato text-[14px] font-semibold text-[#153b29] underline underline-offset-2"
        >
          Go to your dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <Loader2 className="w-7 h-7 text-neutral-400 animate-spin" />
      <p className="font-lato text-[14px] font-medium text-neutral-500 mt-3">Initializing onboarding flow…</p>
    </main>
  );
}

export default function AmbassadorOnboardingPage() {
  return (
    <Suspense fallback={null}>
      <RedirectContent />
    </Suspense>
  );
}