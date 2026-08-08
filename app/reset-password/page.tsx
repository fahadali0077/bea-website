"use client";

import { Suspense, useState, type CSSProperties, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

import { AmbassadorLoginBrandPanel } from "@/app/components/login/AmbassadorLoginBrandPanel";
import { persistAccessToken } from "@/lib/api";
import { login as loginConfig, navigation } from "@/lib/config";

type ResetResponse = {
  ok?: boolean;
  message?: string;
  token?: string;
};

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { theme } = loginConfig;
  const themeStyle = theme.cssVariables as CSSProperties;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!token) {
      setError("This reset link is missing its token. Please request a new one.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = (await res.json().catch(() => null)) as ResetResponse | null;

      if (!res.ok || !data?.ok) {
        throw new Error(data?.message ?? "This reset link is invalid or has expired.");
      }

      // Resetting the password logs the ambassador straight in — same
      // localStorage bearer-token mechanism magic-link login and onboarding
      // use, so the dashboard is authenticated the moment we redirect.
      if (data.token) {
        persistAccessToken(data.token);
      }

      setDone(true);
      setTimeout(() => router.push("/dashboard/ambassador"), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "This reset link is invalid or has expired.");
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
              <Link
                href={navigation.login}
                className="forgot-link forgot-link--program forgot-back-link"
              >
                <ArrowLeft size={14} strokeWidth={2} />
                Back to login
              </Link>

              <p className="form-eyebrow form-eyebrow--program">Password reset</p>
              <h1 className="form-title form-title--program">Choose a new password.</h1>

              {done ? (
                <>
                  <p className="form-subtitle form-subtitle--program">
                    <span className="text-highlight">Password updated.</span>
                  </p>
                  <div className="form-success" role="status">
                    Taking you to your dashboard…
                  </div>
                </>
              ) : !token ? (
                <>
                  <p className="form-subtitle form-subtitle--program">
                    This reset link is missing its token.
                  </p>
                  <div className="form-error" role="alert">
                    Please request a new password reset link.
                  </div>
                  <div className="apply-section">
                    <p>Need a new link?</p>
                    <Link href="/forgot-password" className="apply-link">
                      Request password reset
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <p className="form-subtitle form-subtitle--program">
                    Set a new password for your ambassador account.
                  </p>

                  <form onSubmit={(event) => void handleSubmit(event)} noValidate>
                    {error ? (
                      <div className="form-error" role="alert">
                        {error}
                      </div>
                    ) : null}

                    <div className="field-group">
                      <label className="field-label field-label--strong" htmlFor="password">
                        New password
                      </label>
                      <div className="input-wrap">
                        <input
                          className="field-input"
                          style={{ paddingRight: "46px" }}
                          type={passwordVisible ? "text" : "password"}
                          id="password"
                          name="password"
                          placeholder="Enter a new password"
                          autoComplete="new-password"
                          required
                          minLength={8}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          className="password-toggle"
                          type="button"
                          aria-label="Toggle password visibility"
                          onClick={() => setPasswordVisible((v) => !v)}
                        >
                          {passwordVisible ? (
                            <EyeOff size={20} strokeWidth={1.7} aria-hidden="true" />
                          ) : (
                            <Eye size={20} strokeWidth={1.7} aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="field-group">
                      <label className="field-label field-label--strong" htmlFor="confirmPassword">
                        Confirm new password
                      </label>
                      <div className="input-wrap">
                        <input
                          className="field-input"
                          type={passwordVisible ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          placeholder="Re-enter your new password"
                          autoComplete="new-password"
                          required
                          minLength={8}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      className="btn-login btn-login--program"
                      type="submit"
                      disabled={loading || !password || !confirmPassword}
                    >
                      {loading ? "Updating…" : "Reset password"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}