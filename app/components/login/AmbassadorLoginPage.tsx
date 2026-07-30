"use client";

import Link from "next/link";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { useMemo, useState, type CSSProperties, type FormEvent } from "react";

import { getApiErrorMessage } from "@/lib/api";
import { useRequestMagicLinkMutation } from "@/features/api/apiSlice";
import { login as loginConfig } from "@/lib/config";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AmbassadorLoginPage() {
  const { leftPanel, header, footer, theme } = loginConfig;
  const themeStyle = useMemo(() => theme.cssVariables as CSSProperties, [theme.cssVariables]);

  const [requestMagicLink, { isLoading: loading }] = useRequestMagicLinkMutation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim().toLowerCase();
    if (!EMAIL_RE.test(value)) {
      setError("Enter a valid email address");
      return;
    }

    setError(null);
    try {
      const res = await requestMagicLink(value).unwrap();
      const link = res.magicLink;
      if (link) {
        window.location.href = link;
        return;
      }
      setSent(true);
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to send login link. Please try again."));
    }
  };

  return (
    <div className="ambassador-login-root" style={themeStyle}>
      <div className="page-wrapper">
        <div className="login-layout">
          <div className="left-panel">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={leftPanel.image} alt={leftPanel.imageAlt} />
            <div className="left-overlay" />
            <div className="left-brand">{leftPanel.brand}</div>
            <div className="left-content">
              <p className="left-eyebrow">{leftPanel.eyebrow}</p>
              <h2 className="left-headline">
                {leftPanel.headline.map((line, index) => (
                  <span key={line}>
                    {line}
                    {index < leftPanel.headline.length - 1 && <br />}
                  </span>
                ))}
              </h2>
              <div className="left-divider" />
              <p className="left-body">{leftPanel.body}</p>
            </div>
          </div>

          <div className="right-panel">
            <div className="right-header">
              <Link href={header.backHref} className="back-link">
                <ChevronLeft size={18} strokeWidth={1.8} aria-hidden="true" />
                {header.backLabel}
              </Link>
            </div>

            <div className="right-form-wrap">
              {sent ? (
                <>
                  <p className="form-eyebrow">Check your email</p>
                  <h1 className="form-title">Link on the way</h1>
                  <p className="form-subtitle">
                    If an account exists for <strong>{email}</strong>, we&apos;ve sent a secure login
                    link. Open it on this device to sign in.
                  </p>

                  <button
                    className="btn-login"
                    type="button"
                    onClick={() => {
                      setSent(false);
                      setEmail("");
                    }}
                  >
                    <span>Use a different email</span>
                    <span className="btn-arrow">
                      <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <p className="form-eyebrow">Log in</p>
                  <h1 className="form-title">Welcome back</h1>
                  <p className="form-subtitle">Enter your email and we&apos;ll send you a secure login link.</p>

                  <form onSubmit={handleSubmit} noValidate>
                    {error && (
                      <div className="form-error" role="alert">
                        {error}
                      </div>
                    )}

                    <div className="field-group">
                      <label className="field-label" htmlFor="email">
                        Email
                      </label>
                      <div className="input-wrap">
                        <input
                          className="field-input"
                          type="email"
                          id="email"
                          name="email"
                          placeholder="you@email.com"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setError(null);
                          }}
                        />
                      </div>
                    </div>

                    <button className="btn-login" type="submit" disabled={loading}>
                      <span>{loading ? "Sending link…" : "Email me a login link"}</span>
                      <span className="btn-arrow">
                        <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
                      </span>
                    </button>
                  </form>

                  <div className="apply-section">
                    <p>New to Bea?</p>
                    <Link href="/waitlist" className="apply-link">
                      Join the waitlist
                      <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <footer className="page-footer">
          {footer.prefix} <a href={footer.emailHref}>{footer.email}</a>
        </footer>
      </div>
    </div>
  );
}
