"use client";

import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import Link from "next/link";

import { AmbassadorLoginBrandPanel } from "@/app/components/login/AmbassadorLoginBrandPanel";
import { login as loginConfig, navigation } from "@/lib/config";

const RESEND_COOLDOWN_SECONDS = 30;

type ForgotPasswordResponse = { ok?: boolean; message?: string };

async function requestPasswordReset(targetEmail: string): Promise<void> {
  const res = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email: targetEmail }),
  });
  const data = (await res.json().catch(() => null)) as ForgotPasswordResponse | null;

  if (!res.ok || !data?.ok) {
    throw new Error(data?.message ?? "Unable to send reset link. Please try again.");
  }
}

export default function ForgotPasswordPage() {
  const { header, theme } = loginConfig;
  const themeStyle = theme.cssVariables as CSSProperties;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [justResent, setJustResent] = useState(false);

  // Ticks the resend cooldown down once a second while it's active.
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const trimmed = email.trim();
      await requestPasswordReset(trimmed);
      setEmail(trimmed);
      setSent(true);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resending || resendCooldown > 0) return;
    setError(null);
    setJustResent(false);
    setResending(true);

    try {
      await requestPasswordReset(email);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      setJustResent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to resend the link. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="ambassador-login-root ambassador-login-root--program" style={themeStyle}>
      <div className="page-wrapper page-wrapper--program">
        <div className="login-layout login-layout--program">
          <AmbassadorLoginBrandPanel />

          <div className="right-panel right-panel--program">
            <div className="right-form-wrap right-form-wrap--program">
              <Link href={navigation.login} className="forgot-link forgot-link--program forgot-back-link">
                {header.backLabel}
              </Link>

              <p className="form-eyebrow form-eyebrow--program">Password reset</p>
              <h1 className="form-title form-title--program">Forgot your password?</h1>

              {sent ? (
                <>
                  <p className="form-subtitle form-subtitle--program">
                    <span className="text-highlight">Check your email.</span>
                  </p>

                  {error ? (
                    <div className="form-error" role="alert">
                      {error}
                    </div>
                  ) : null}

                  <div className="form-success" role="status">
                    {justResent ? (
                      <>
                        Sent again — if an account exists for <strong>{email}</strong>, a fresh link is
                        on its way. The link is single-use and expires in 30 minutes.
                      </>
                    ) : (
                      <>
                        If an account exists for <strong>{email}</strong>, we&apos;ve sent a link to
                        reset your password. The link is single-use and expires in 30 minutes.
                      </>
                    )}
                  </div>

                  <p className="form-subtitle form-subtitle--program" style={{ marginTop: 24, marginBottom: 12 }}>
                    Didn&apos;t get it?
                  </p>
                  <button
                    className="btn-login btn-login--program"
                    type="button"
                    onClick={() => void handleResend()}
                    disabled={resending || resendCooldown > 0}
                  >
                    {resending
                      ? "Resending…"
                      : resendCooldown > 0
                        ? `Resend email (${resendCooldown}s)`
                        : "Resend email"}
                  </button>
                </>
              ) : (
                <>
                  <p className="form-subtitle form-subtitle--program">
                    Enter the email linked to your ambassador account. We&apos;ll send you a link to
                    reset your password.
                  </p>

                  <form onSubmit={(event) => void handleSubmit(event)} noValidate>
                    {error ? (
                      <div className="form-error" role="alert">
                        {error}
                      </div>
                    ) : null}

                    <div className="field-group">
                      <label className="field-label field-label--strong" htmlFor="email">
                        Email
                      </label>
                      <div className="input-wrap">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          placeholder="you@email.com"
                          className="field-input"
                          required
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      className="btn-login btn-login--program"
                      type="submit"
                      disabled={loading || !email.trim()}
                    >
                      {loading ? "Sending…" : "Send reset link"}
                    </button>
                  </form>
                </>
              )}

              <div className="apply-section">
                <p>Remember your password?</p>
                <Link href={navigation.login} className="apply-link">
                  Back to login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}