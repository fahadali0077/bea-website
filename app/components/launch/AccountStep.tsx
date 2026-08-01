/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, Loader2 } from "lucide-react";

import { ACCOUNT_STEP } from "@/lib/launch";
import { useValidateAmbassadorOnboardingQuery, useLazyCheckAmbassadorEmailQuery } from "@/features/api/apiSlice";
import { markStepReached } from "@/lib/onboarding-progress";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CHECK_DEBOUNCE_MS = 500;

type FieldErrors = {
  fullName?: string;
  email?: string;
};

export function AccountStep() {
  const router = useRouter();
  const { eyebrow, titleLines, alreadyRegisteredNote, availableNote, legal, cta, loginPrompt, loginLabel, loginHref } =
    ACCOUNT_STEP;

  const [token, setToken] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

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
  const alreadyRegistered = !checkingEmail && emailMatchesChecked && Boolean(emailCheck?.registered);

  const clearFieldError = (field: keyof FieldErrors) =>
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: FieldErrors = {};
    if (!isNameValid) errors.fullName = "Please enter your full name.";
    if (!email.trim()) errors.email = "Please enter your email.";
    else if (!isEmailValid) errors.email = "Please enter a valid email.";
    else if (alreadyRegistered) errors.email = "This email is already registered. Try logging in instead.";

    setFieldErrors(errors);

    // Focus the first field that failed so the user lands on the problem.
    if (errors.fullName) return nameRef.current?.focus();
    if (errors.email) return emailRef.current?.focus();

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

        <form onSubmit={handleSubmit} className="launch-form" noValidate>
          <div>
            <label className="launch-field-label" htmlFor="launch-fullName">
              Full name
            </label>
            <div className="launch-field-wrap">
              <input
                ref={nameRef}
                id="launch-fullName"
                name="fullName"
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  clearFieldError("fullName");
                }}
                className={`launch-field-input${fieldErrors.fullName ? " is-invalid" : ""}`}
                autoComplete="off"
                aria-invalid={Boolean(fieldErrors.fullName)}
                aria-describedby={fieldErrors.fullName ? "launch-fullName-error" : undefined}
              />
              {isNameValid && !fieldErrors.fullName && (
                <span className="launch-field-check" aria-hidden="true">
                  <Check size={16} strokeWidth={2.5} />
                </span>
              )}
            </div>
            {fieldErrors.fullName && (
              <p className="launch-field-error" id="launch-fullName-error" role="alert">
                {fieldErrors.fullName}
              </p>
            )}
          </div>

          <div>
            <label className="launch-field-label" htmlFor="launch-email">
              Email
            </label>
            <div className="launch-field-wrap">
              <input
                ref={emailRef}
                id="launch-email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearFieldError("email");
                }}
                className={`launch-field-input${fieldErrors.email ? " is-invalid" : ""}`}
                autoComplete="off"
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? "launch-email-error" : undefined}
              />
              {checkingEmail && (
                <span className="launch-field-check" aria-hidden="true">
                  <Loader2 size={16} strokeWidth={2.5} className="animate-spin" />
                </span>
              )}
              {!checkingEmail && isEmailValid && !fieldErrors.email && (
                <span className="launch-field-check" aria-hidden="true">
                  <Check size={16} strokeWidth={2.5} />
                </span>
              )}
            </div>
            {fieldErrors.email && (
              <p className="launch-field-error" id="launch-email-error" role="alert">
                {fieldErrors.email}
              </p>
            )}
            {!fieldErrors.email && !checkingEmail && emailMatchesChecked && (
              <p className={emailCheck?.registered ? "launch-already-registered" : "launch-email-available"}>
                {emailCheck?.registered ? alreadyRegisteredNote : availableNote}
              </p>
            )}
          </div>

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