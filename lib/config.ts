import loginConfig from "@/config/login.json";
import adminLoginConfig from "@/config/admin-login.json";
import navigationConfig from "@/config/navigation.json";
import onboardingConfig from "@/config/onboarding.json";

export type LoginFieldConfig = {
  id: string;
  label: string;
  type: "email" | "password" | "text";
  placeholder: string;
  autoComplete: string;
  required?: boolean;
  showToggle?: boolean;
};

export type SocialProviderConfig = {
  id: string;
  label: string;
  provider: "google" | "apple";
};

export type LoginConfig = {
  meta: { title: string; description: string };
  theme: {
    cssVariables: Record<string, string>;
  };
  api: {
    login: string;
    google: string;
    apple: string;
    useExternalBackend: boolean;
    externalBaseUrl: string;
    redirectOnSuccess: string;
  };
  leftPanel: {
    image: string;
    imageAlt: string;
    brand: string;
    eyebrow: string;
    headline: string[];
    body: string;
  };
  header: { backLabel: string; backHref: string };
  form: {
    eyebrow: string;
    title: string;
    subtitle: string;
    fields: LoginFieldConfig[];
    rememberMe: { label: string; defaultChecked: boolean };
    forgotPassword: { label: string; href: string };
    submit: { label: string; loadingLabel: string };
    divider: string;
    social: SocialProviderConfig[];
    apply: { prompt: string; linkLabel: string; href: string };
  };
  footer: { prefix: string; email: string; emailHref: string };
};

export type AdminLoginConfig = {
  meta: { title: string; description: string };
  theme: { cssVariables: Record<string, string> };
  api: LoginConfig["api"];
  leftPanel: {
    image: string;
    imageAlt: string;
    brand: string;
    eyebrow: string;
    headline: string[];
    body: string;
  };
  header: { backLabel: string; backHref: string };
  form: {
    eyebrow: string;
    title: string;
    subtitle: string;
    fields: LoginFieldConfig[];
    rememberMe: { label: string; defaultChecked: boolean };
    submit: { label: string; loadingLabel: string };
  };
};

export type NavigationConfig = typeof navigationConfig;
export type OnboardingConfig = typeof onboardingConfig;

export const login = loginConfig as LoginConfig;
export const adminLogin = adminLoginConfig as AdminLoginConfig;
export const navigation = navigationConfig as NavigationConfig;
export const onboarding = onboardingConfig as OnboardingConfig;
