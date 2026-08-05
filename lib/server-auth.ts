import loginConfig from "@/config/login.json";
import type { LoginConfig } from "@/lib/config";

export type LoginBody = {
  email?: string;
  password?: string;
  remember?: boolean;
};

export type SocialBody = {
  provider?: "google" | "apple";
};

export async function proxyToExternalBackend<TBody extends object>(
  path: string,
  body: TBody,
): Promise<Response> {
  const { useExternalBackend, externalBaseUrl } = loginConfig.api as LoginConfig["api"];

  if (!useExternalBackend || !externalBaseUrl) {
    return Response.json(
      { ok: false, message: "External backend is not configured" },
      { status: 501 },
    );
  }

  const url = `${externalBaseUrl.replace(/\/$/, "")}${path}`;
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
}

export function validateLoginBody(body: LoginBody): string | null {
  if (!body.email?.trim()) return "Email is required";
  if (!body.password?.trim()) return "Password is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return "Enter a valid email address";
  return null;
}

export async function withAuthBackend<TBody extends object>(
  externalPath: string,
  body: TBody,
): Promise<Response> {
  const { useExternalBackend } = loginConfig.api as LoginConfig["api"];

  if (useExternalBackend) {
    const upstream = await proxyToExternalBackend(externalPath, body);
    const data = await upstream.json();
    return Response.json(data, { status: upstream.status });
  }

  return Response.json(
    { ok: false, message: "Live authentication backend is not configured for this route." },
    { status: 501 },
  );
}
