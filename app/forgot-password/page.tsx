"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import Link from "next/link";

import { AmbassadorLoginBrandPanel } from "@/app/components/login/AmbassadorLoginBrandPanel";
import { login as loginConfig, navigation } from "@/lib/config";

export default function ForgotPasswordPage() {
  const { header, theme } = loginConfig;
  const themeStyle = theme.cssVariables as CSSProperties;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; message?: string } | null;

      if (!res.ok || !data?.ok) {
        throw new Error(data?.message ?? "Unable to send reset link. Please try again.");
      }

      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send reset link. Please try again.");
    } finally {
      setLoading(false);
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
                  <div className="form-success" role="status">
                    If an account exists for <strong>{email.trim()}</strong>, we&apos;ve sent a link to
                    reset your password. The link is single-use and expires in 30 minutes.
                  </div>
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
