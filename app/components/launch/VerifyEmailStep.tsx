/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";

import { WAYS_STEP } from "@/lib/launch";
import { useResendAmbassadorInviteMutation, useValidateAmbassadorOnboardingQuery } from "@/features/api/apiSlice";
import { resetOnboardingProgress } from "@/lib/onboarding-progress";

export function VerifyEmailStep() {
  const router = useRouter();
  const { eyebrow, titleLines, bodyPrefix, continuePrompt, resend, useDifferentEmail } = WAYS_STEP;

  const [token, setToken] = useState("");
  const { data: invite } = useValidateAmbassadorOnboardingQuery(token, { skip: !token });
  const [resendInvite, { isLoading: resending }] = useResendAmbassadorInviteMutation();
  const [resent, setResent] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = sessionStorage.getItem("ambassador_onboarding_token") ?? "";
    setToken(savedToken);
  }, []);

  const email = invite?.email ?? "email@email.com";

  const handleResend = async () => {
    if (!token) return;
    setResendError(null);
    try {
      await resendInvite(token).unwrap();
      setResent(true);
    } catch {
      setResendError("Couldn't resend right now. Please try again in a moment.");
    }
  };

  const handleUseDifferentEmail = () => {
    sessionStorage.removeItem("ambassador_onboarding_token");
    resetOnboardingProgress();
    router.push("/onboarding");
  };

  return (
    <section className="launch-step launch-step--verify">
      <div className="launch-step-inner launch-step-inner--verify">
        <div className="verify-art">
          <Image
            src="/images/onboarding/sailboat.png"
            alt=""
            width={1044}
            height={1008}
            aria-hidden="true"
          />
        </div>

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
            {bodyPrefix} <strong>{email}</strong>
          </p>
          {invite?.alreadyRegistered && (
            <p className="launch-already-registered">
              Email registered — you already have a Bea account. Continuing will sign you into it.
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
          {resendError && <p className="verify-error">{resendError}</p>}

          <div className="verify-links">
            <button type="button" className="verify-link" onClick={handleResend} disabled={resending || resent}>
              {resent ? "Email sent" : resending ? "Sending…" : resend.label}
            </button>
            <span className="verify-links-divider" aria-hidden="true">
              ·
            </span>
            <button type="button" className="verify-link" onClick={handleUseDifferentEmail}>
              {useDifferentEmail.label}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}