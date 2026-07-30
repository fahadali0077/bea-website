"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

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

  useEffect(() => {
    if (token) {
      sessionStorage.setItem("ambassador_onboarding_token", token);
      router.replace(`/${nextStep}?token=${token}`);
    } else {
      router.replace("/onboarding");
    }
  }, [token, nextStep, router]);

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