/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, Eye, EyeOff, Loader2, Lock } from "lucide-react";

import { ACCOUNT_STEP } from "@/lib/launch";
import { useValidateAmbassadorOnboardingQuery, useLazyCheckAmbassadorEmailQuery } from "@/features/api/apiSlice";
import { markStepReached } from "@/lib/onboarding-progress";
import { setPendingPassword } from "@/lib/onboarding-credentials";
import { getPasswordStrength, PASSWORD_MIN_LENGTH } from "@/lib/password-strength";
import { useEnterAdvance } from "@/lib/use-enter-advance";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CHECK_DEBOUNCE_MS = 500;

type FieldErrors = {
  fullName?: string;
  email?: string;
  password?: string;
};

export function AccountStep() {
  const router = useRouter();
  const handleFormKeyDown = useEnterAdvance();
  const {
    eyebrow,
    titleLines,
    alreadyRegisteredNote,
    availableNote,
    lockedEmailNote,
    legal,
    cta,
    loginPrompt,
    loginLabel,
    loginHref,
  } = ACCOUNT_STEP;

  const [token, setToken] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailNoticeVisible, setEmailNoticeVisible] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const { data: invite } = useValidateAmbassadorOnboardingQuery(token, { skip: !token });
  const [checkEmail, { data: emailCheck, isFetching: checkingEmail }] = useLazyCheckAmbassadorEmailQuery();

  useEffect(() => {
    const savedToken = sessionStorage.getItem("ambassador_onboarding_token") ?? "";
    setToken(savedToken);
  }, []);

  useEffect(() => {
    if (invite?.email) setEmail(invite.email);
  }, [invite]);

  // The invite email is fixed by the token, so it is locked once we have it.
  const emailLocked = Boolean(invite?.email);
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
  const strength = getPasswordStrength(password);

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
    if (!password) errors.password = "Please create a password.";
    else if (password.length < PASSWORD_MIN_LENGTH) {
      errors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
    }

    setFieldErrors(errors);

    // Focus the first field that failed so the user lands on the problem.
    if (errors.fullName) return nameRef.current?.focus();
    if (errors.password) return passwordRef.current?.focus();

    setSubmitting(true);
    sessionStorage.setItem("invite_full_name", fullName.trim());
    sessionStorage.setItem("invite_email", email.trim());
    // Kept in memory only — never written to sessionStorage.
    setPendingPassword(password);
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

        <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} className="launch-form" noValidate>
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
                onFocus={() => setEmailNoticeVisible(false)}
                className={`launch-field-input${fieldErrors.fullName ? " is-invalid" : ""}`}
                autoComplete="name"
                enterKeyHint="next"
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
                id="launch-email"
                name="email"
                type="email"
                value={email}
                readOnly={emailLocked}
                onChange={(e) => {
                  if (emailLocked) return;
                  setEmail(e.target.value);
                  clearFieldError("email");
                }}
                onFocus={() => setEmailNoticeVisible(emailLocked)}
                onClick={() => setEmailNoticeVisible(emailLocked)}
                onBlur={() => setEmailNoticeVisible(false)}
                className={`launch-field-input${emailLocked ? " is-locked" : ""}`}
                autoComplete="email"
                inputMode="email"
                aria-readonly={emailLocked}
                aria-describedby={emailLocked && emailNoticeVisible ? "launch-email-locked" : undefined}
              />
              {emailLocked ? (
                <span className="launch-field-lock" aria-hidden="true">
                  <Lock size={15} strokeWidth={2.2} />
                </span>
              ) : (
                <>
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
                </>
              )}
            </div>

            {emailLocked && emailNoticeVisible && (
              <p className="launch-field-note" id="launch-email-locked" role="status">
                <Lock size={13} strokeWidth={2.2} aria-hidden="true" />
                <span>{lockedEmailNote}</span>
              </p>
            )}

            {!emailLocked && !checkingEmail && emailMatchesChecked && (
              <p className={emailCheck?.registered ? "launch-already-registered" : "launch-email-available"}>
                {emailCheck?.registered ? alreadyRegisteredNote : availableNote}
              </p>
            )}
          </div>

          <div>
            <label className="launch-field-label" htmlFor="launch-password">
              Create password
            </label>
            <div className="launch-field-wrap">
              <input
                ref={passwordRef}
                id="launch-password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearFieldError("password");
                }}
                onFocus={() => setEmailNoticeVisible(false)}
                className={`launch-field-input${fieldErrors.password ? " is-invalid" : ""}`}
                autoComplete="new-password"
                enterKeyHint="done"
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={
                  fieldErrors.password ? "launch-password-error" : password ? "launch-password-strength" : undefined
                }
              />
              <button
                type="button"
                className="launch-field-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
              </button>
            </div>

            {fieldErrors.password ? (
              <p className="launch-field-error" id="launch-password-error" role="alert">
                {fieldErrors.password}
              </p>
            ) : (
              <div className="launch-password-meter" id="launch-password-strength">
                <div className={`launch-password-bar is-score-${strength.score}`} aria-hidden="true">
                  <span />
                </div>
                <p className="launch-password-hint">{strength.label}</p>
              </div>
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