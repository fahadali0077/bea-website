"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useMemo, useState, type CSSProperties, type FormEvent } from "react";

import { loginRequest } from "@/lib/auth-client";
import { login as loginConfig } from "@/lib/config";
import type { LoginFieldConfig } from "@/lib/config";

import { AmbassadorLoginBrandPanel } from "./AmbassadorLoginBrandPanel";

function LoginField({
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
      <label className="field-label field-label--strong" htmlFor={field.id}>
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
        {isPassword && field.showToggle ? (
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
        ) : null}
      </div>
    </div>
  );
}

export function AmbassadorLoginPage() {
  const router = useRouter();
  const { form, api, theme } = loginConfig;

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
    <div className="ambassador-login-root ambassador-login-root--program" style={themeStyle}>
      <div className="page-wrapper page-wrapper--program">
        <div className="login-layout login-layout--program">
          <AmbassadorLoginBrandPanel />

          <div className="right-panel right-panel--program">
            <div className="right-form-wrap right-form-wrap--program">
              <p className="form-eyebrow form-eyebrow--program">{form.eyebrow}</p>
              <h1 className="form-title form-title--program">{form.title}</h1>
              <p className="form-subtitle form-subtitle--program">
                <span className="text-highlight">{form.subtitle}</span>
              </p>

              <form onSubmit={handleSubmit} noValidate>
                {error ? (
                  <div className="form-error" role="alert">
                    {error}
                  </div>
                ) : null}

                {form.fields.map((field) => (
                  <LoginField
                    key={field.id}
                    field={field}
                    value={values[field.id] ?? ""}
                    visible={passwordVisible}
                    onChange={(next) => setValues((current) => ({ ...current, [field.id]: next }))}
                    onToggleVisibility={field.showToggle ? () => setPasswordVisible((v) => !v) : undefined}
                  />
                ))}

                <div className="form-row form-row--program">
                  <label className="remember-label remember-label--program" htmlFor="remember">
                    <input
                      className="remember-checkbox"
                      type="checkbox"
                      id="remember"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />
                    <span className="text-highlight">{form.rememberMe.label}</span>
                  </label>

                  <Link href={form.forgotPassword.href} className="forgot-link forgot-link--program">
                    {form.forgotPassword.label}
                  </Link>
                </div>

                <button className="btn-login btn-login--program" type="submit" disabled={loading}>
                  {loading ? form.submit.loadingLabel : form.submit.label}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
