/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, Loader2 } from "lucide-react";

import { ACCOUNT_STEP } from "@/lib/launch";
import { useValidateAmbassadorOnboardingQuery, useLazyCheckAmbassadorEmailQuery } from "@/features/api/apiSlice";
import { markStepReached } from "@/lib/onboarding-progress";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CHECK_DEBOUNCE_MS = 500;

export function AccountStep() {
  const router = useRouter();
  const { eyebrow, titleLines, alreadyRegisteredNote, availableNote, legal, cta, loginPrompt, loginLabel, loginHref } =
    ACCOUNT_STEP;

  const [token, setToken] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { data: invite } = useValidateAmbassadorOnboardingQuery(token, { skip: !token });
  const [checkEmail, { data: emailCheck, isFetching: checkingEmail }] = useLazyCheckAmbassadorEmailQuery();

  useEffect(() => {
    const savedToken = sessionStorage.getItem("ambassador_onboarding_token") ?? "";
    setToken(savedToken);
  }, []);

  useEffect(() => {
    if (invite?.email) setEmail(invite.email);
  }, [invite]);

  const isEmailValid = EMAIL_RE.test(email.trim());

  useEffect(() => {
    if (!isEmailValid) return;
    const handle = setTimeout(() => {
      checkEmail(email.trim());
    }, CHECK_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [email, isEmailValid, checkEmail]);

  const isNameValid = fullName.trim().length > 1;
  const emailMatchesChecked = emailCheck?.email === email.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isNameValid) return setError("Please enter your full name.");
    if (!isEmailValid) return setError("Please enter a valid email.");

    setError(null);
    setSubmitting(true);
    sessionStorage.setItem("invite_full_name", fullName.trim());
    sessionStorage.setItem("invite_email", email.trim());
    markStepReached("your-school");
    router.push(cta.href);
  };

  return (
    <section className="launch-step launch-step--account">
      <div className="launch-step-inner">
        <p className="launch-eyebrow">{eyebrow}</p>
        <h1 className="launch-title font-canela onboarding-heading">
          {titleLines.map((line, i) => (
            <span key={line}>
              {line}
              {i < titleLines.length - 1 && <br />}
            </span>
          ))}
        </h1>

        <form onSubmit={handleSubmit} className="launch-form">
          <div>
            <label className="launch-field-label" htmlFor="launch-fullName">
              Full name
            </label>
            <div className="launch-field-wrap">
              <input
                id="launch-fullName"
                name="fullName"
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setError(null);
                }}
                className="launch-field-input"
                autoComplete="off"
              />
              {isNameValid && (
                <span className="launch-field-check" aria-hidden="true">
                  <Check size={16} strokeWidth={2.5} />
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="launch-field-label" htmlFor="launch-email">
              Email
            </label>
            <div className="launch-field-wrap">
              <input
                id="launch-email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                className="launch-field-input"
                autoComplete="off"
              />
              {checkingEmail && (
                <span className="launch-field-check" aria-hidden="true">
                  <Loader2 size={16} strokeWidth={2.5} className="animate-spin" />
                </span>
              )}
              {!checkingEmail && isEmailValid && (
                <span className="launch-field-check" aria-hidden="true">
                  <Check size={16} strokeWidth={2.5} />
                </span>
              )}
            </div>
            {!checkingEmail && emailMatchesChecked && (
              <p className={emailCheck?.registered ? "launch-already-registered" : "launch-email-available"}>
                {emailCheck?.registered ? alreadyRegisteredNote : availableNote}
              </p>
            )}
          </div>

          {error && <p className="font-lato text-[13px] font-semibold text-[#b0453a]">{error}</p>}

          <p className="launch-legal">
            {legal.prefix}
            <Link href={legal.termsHref}>{legal.termsLabel}</Link>
            {legal.conjunction}
            <Link href={legal.privacyHref}>{legal.privacyLabel}</Link>
          </p>

          <button type="submit" disabled={submitting} className="launch-cta cursor-pointer">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>{cta.label}</span>}
            {!submitting && <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />}
          </button>
        </form>

        <p className="launch-login-prompt">
          {loginPrompt}
          <Link href={loginHref}>{loginLabel}</Link>
        </p>
      </div>
    </section>
  );
}