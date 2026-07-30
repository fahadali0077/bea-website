import type { LoginConfig } from "@/lib/config";

export type LoginPayload = {
  email: string;
  password: string;
  remember: boolean;
};

export type AuthResponse = {
  ok: boolean;
  message?: string;
  token?: string;
  user?: { email: string; name?: string };
  redirectTo?: string;
};

export type SocialPayload = {
  provider: "google" | "apple";
};

async function readJsonResponse(res: Response, fallbackMessage: string): Promise<AuthResponse> {
  const text = await res.text();
  const contentType = res.headers.get("content-type") ?? "";

  if (!text) {
    return { ok: res.ok, message: res.ok ? undefined : fallbackMessage };
  }

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text) as AuthResponse;
    } catch {
      return { ok: false, message: "The server returned malformed JSON. Please try again." };
    }
  }

  return {
    ok: false,
    message: text.trim().startsWith("<")
      ? "Login server returned an HTML page instead of JSON. Please check that the frontend API route and backend server are running."
      : text.slice(0, 240),
  };
}

function resolveEndpoint(config: LoginConfig["api"], key: "login" | "google" | "apple"): string {
  const path = config[key];
  if (config.useExternalBackend && config.externalBaseUrl) {
    return `${config.externalBaseUrl.replace(/\/$/, "")}${path}`;
  }
  return path;
}

export async function loginRequest(
  config: LoginConfig["api"],
  payload: LoginPayload,
): Promise<AuthResponse> {
  const res = await fetch(resolveEndpoint(config, "login"), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  const data = await readJsonResponse(res, "Login failed");
  if (!res.ok) {
    throw new Error(data.message ?? "Login failed");
  }
  return data;
}

export async function socialAuthRequest(
  config: LoginConfig["api"],
  payload: SocialPayload,
): Promise<AuthResponse> {
  const endpoint = payload.provider === "google" ? config.google : config.apple;
  const url =
    config.useExternalBackend && config.externalBaseUrl
      ? `${config.externalBaseUrl.replace(/\/$/, "")}${endpoint}`
      : endpoint;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  const data = await readJsonResponse(res, "Social sign-in failed");
  if (!res.ok) {
    throw new Error(data.message ?? "Social sign-in failed");
  }
  return data;
}
