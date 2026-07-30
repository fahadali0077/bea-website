"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { AppleIcon, GoogleIcon } from "./SocialProviderIcons";

export function AccountMobileForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="onboarding-account-form" onSubmit={(e) => e.preventDefault()} noValidate>
      <div className="field-group">
        <label className="field-label" htmlFor="name">
          Full Name
        </label>
        <input
          className="field-input"
          id="name"
          name="name"
          type="text"
          placeholder="Enter your full name"
          autoComplete="name"
        />
      </div>

      <div className="field-group">
        <label className="field-label" htmlFor="email">
          Email Address
        </label>
        <input
          className="field-input"
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
        />
      </div>

      <div className="field-group">
        <label className="field-label" htmlFor="password">
          Password
        </label>
        <div className="input-wrap">
          <input
            className="field-input"
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create your password"
            autoComplete="new-password"
            style={{ paddingRight: "46px" }}
          />
          <button
            type="button"
            className="password-toggle"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? (
              <EyeOff size={20} strokeWidth={1.7} aria-hidden="true" />
            ) : (
              <Eye size={20} strokeWidth={1.7} aria-hidden="true" />
            )}
          </button>
        </div>
        <p className="onboarding-field-hint">Must be at least 8 characters</p>
      </div>

      <div className="or-divider">
        <span className="or-text">or continue with</span>
      </div>

      <button type="button" className="btn-social">
        <GoogleIcon />
        Google
      </button>
      <button type="button" className="btn-social">
        <AppleIcon />
        Apple
      </button>

      <p className="onboarding-legal">
        By creating an account, you agree to our{" "}
        <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </p>
    </form>
  );
}
