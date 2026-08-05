import type { Metadata } from "next";
import Link from "next/link";

import { login as loginConfig, navigation } from "@/lib/config";
import "@/styles/login.css";

export const metadata: Metadata = {
  title: "Reset password — Bea Ambassador",
  description: "Request a password reset link for your Bea ambassador account",
};

export default function ForgotPasswordPage() {
  const { leftPanel, header } = loginConfig;

  return (
    <div className="ambassador-login-root">
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
              <Link href={navigation.login} className="back-link">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                {header.backLabel}
              </Link>
            </div>

            <div className="right-form-wrap">
              <p className="form-eyebrow">Password reset</p>
              <h1 className="form-title">Forgot your password?</h1>
              <p className="form-subtitle">
                Enter the email linked to your ambassador account. Reset emails will be
                enabled once the backend is connected.
              </p>

              <form noValidate>
                <label className="field-label" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@beadating.com"
                  className="field-input"
                  required
                />

                <button className="btn-login" type="button" disabled>
                  <span>Send reset link (coming soon)</span>
                </button>
              </form>

              <div className="apply-section">
                <p>Remember your password?</p>
                <Link href={navigation.login} className="apply-link">
                  Back to login
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
