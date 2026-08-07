import type { Metadata } from "next";
import Link from "next/link";

import { AmbassadorLoginBrandPanel } from "@/app/components/login/AmbassadorLoginBrandPanel";
import { login as loginConfig, navigation } from "@/lib/config";
import "@/styles/login.css";

export const metadata: Metadata = {
  title: "Reset password — Bea Ambassador",
  description: "Request a password reset link for your Bea ambassador account",
};

export default function ForgotPasswordPage() {
  const { header } = loginConfig;

  return (
    <div className="ambassador-login-root ambassador-login-root--program">
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
              <p className="form-subtitle form-subtitle--program">
                Enter the email linked to your ambassador account. Reset emails will be enabled once
                the backend is connected.
              </p>

              <form noValidate>
                <label className="field-label field-label--strong" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@email.com"
                  className="field-input"
                  required
                />

                <button className="btn-login btn-login--program" type="button" disabled>
                  Send reset link (coming soon)
                </button>
              </form>

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
