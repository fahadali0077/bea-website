"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronLeft, Eye, EyeOff } from "lucide-react";
import { useMemo, useState, type CSSProperties, type FormEvent } from "react";

import { loginRequest } from "@/lib/auth-client";
import { adminLogin as adminConfig } from "@/lib/config";
import type { LoginFieldConfig } from "@/lib/config";

function AdminField({
  field,
  value,
  visible,
  onChange,
  onToggleVisibility,
}: {
  field: LoginFieldConfig;
  value: string;
  visible: boolean;
  onChange: (value: string) => void;
  onToggleVisibility?: () => void;
}) {
  const isPassword = field.type === "password";

  return (
    <div className="field-group">
      <label className="field-label" htmlFor={field.id}>
        {field.label}
      </label>
      <div className="input-wrap">
        <input
          className="field-input"
          style={isPassword && field.showToggle ? { paddingRight: "46px" } : undefined}
          type={isPassword && visible ? "text" : field.type}
          id={field.id}
          name={field.id}
          placeholder={field.placeholder}
          autoComplete={field.autoComplete}
          required={field.required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {isPassword && field.showToggle && (
          <button
            className="password-toggle"
            type="button"
            aria-label="Toggle password visibility"
            onClick={onToggleVisibility}
          >
            {visible ? (
              <EyeOff size={20} strokeWidth={1.7} aria-hidden="true" />
            ) : (
              <Eye size={20} strokeWidth={1.7} aria-hidden="true" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export function AdminLoginPage() {
  const router = useRouter();
  const { leftPanel, header, form, api, theme } = adminConfig;

  const initialValues = useMemo(
    () => Object.fromEntries(form.fields.map((field) => [field.id, ""])) as Record<string, string>,
    [form.fields],
  );

  const [values, setValues] = useState(initialValues);
  const [remember, setRemember] = useState(form.rememberMe.defaultChecked);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const themeStyle = useMemo(() => theme.cssVariables as CSSProperties, [theme.cssVariables]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await loginRequest(api, {
        email: values.email ?? "",
        password: values.password ?? "",
        remember,
      });
      router.push(result.redirectTo ?? api.redirectOnSuccess);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
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
              <p className="form-eyebrow">{form.eyebrow}</p>
              <h1 className="form-title">{form.title}</h1>
              <p className="form-subtitle">{form.subtitle}</p>

              <form onSubmit={handleSubmit} noValidate>
                {error && (
                  <div className="form-error" role="alert">
                    {error}
                  </div>
                )}

                {form.fields.map((field) => (
                  <AdminField
                    key={field.id}
                    field={field}
                    value={values[field.id] ?? ""}
                    visible={passwordVisible}
                    onChange={(next) => setValues((current) => ({ ...current, [field.id]: next }))}
                    onToggleVisibility={field.showToggle ? () => setPasswordVisible((v) => !v) : undefined}
                  />
                ))}

                <div className="form-row">
                  <label className="remember-label" htmlFor="remember">
                    <input
                      className="remember-checkbox"
                      type="checkbox"
                      id="remember"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />
                    {form.rememberMe.label}
                  </label>
                </div>

                <button className="btn-login" type="submit" disabled={loading}>
                  <span>{loading ? form.submit.loadingLabel : form.submit.label}</span>
                  <span className="btn-arrow">
                    <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
