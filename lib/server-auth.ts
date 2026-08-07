import { beaFetch } from "@/lib/admin/backend";

export type LoginBody = {
  email?: string;
  password?: string;
  remember?: boolean;
};

export type ForgotPasswordBody = {
  email?: string;
};

export type ResetPasswordBody = {
  token?: string;
  password?: string;
};

export type SocialBody = {
  provider?: "google" | "apple";
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLoginBody(body: LoginBody): string | null {
  if (!body.email?.trim()) return "Email is required";
  if (!body.password?.trim()) return "Password is required";
  if (!EMAIL_PATTERN.test(body.email)) return "Enter a valid email address";
  return null;
}

export function validateForgotPasswordBody(body: ForgotPasswordBody): string | null {
  if (!body.email?.trim()) return "Email is required";
  if (!EMAIL_PATTERN.test(body.email)) return "Enter a valid email address";
  return null;
}

export function validateResetPasswordBody(body: ResetPasswordBody): string | null {
  if (!body.token?.trim()) return "Reset link is missing its token";
  if (!body.password?.trim()) return "Password is required";
  if (body.password.length < 8) return "Password must be at least 8 characters";
  return null;
}

type BackendUser = {
  id: string;
  email: string;
  fullName?: string | null;
  role?: string;
} & Record<string, unknown>;

type BackendAuthPayload = {
  message?: string;
  token?: string;
  user?: BackendUser | null;
};

async function readUpstreamJson(upstream: Response): Promise<Record<string, unknown>> {
  const text = await upstream.text();
  if (!text) return {};

  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return {
      message: text.trim().startsWith("<")
        ? "Authentication server returned HTML instead of JSON. Check BEA_API_BASE_URL and that the backend is running."
        : text.slice(0, 240),
    };
  }
}

function extractPayload(data: Record<string, unknown>): BackendAuthPayload {
  const inner = (data.data as Record<string, unknown>) ?? {};
  return {
    message: typeof data.message === "string" ? data.message : undefined,
    token: typeof inner.token === "string" ? inner.token : undefined,
    user: (inner.user as BackendUser) ?? null,
  };
}

/**
 * Proxies a POST request to the real backend (BEA_API_BASE_URL — the same
 * env var the admin login route uses) and reshapes the backend's
 * {success, message, data:{token,user}} envelope into the flat
 * {ok, message, token, user} shape the ambassador auth pages consume.
 */
export async function proxyAuthRequest(
  path: string,
  body: object,
  fallbackMessage: string,
): Promise<Response> {
  let upstream: Response;
  try {
    upstream = await beaFetch(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
  } catch {
    return Response.json(
      { ok: false, message: "Unable to reach the authentication server. Please try again." },
      { status: 502 },
    );
  }

  const data = await readUpstreamJson(upstream);

  if (!upstream.ok) {
    const message = (typeof data.message === "string" && data.message) || fallbackMessage;
    return Response.json({ ok: false, message }, { status: upstream.status });
  }

  const { message, token, user } = extractPayload(data);
  return Response.json({ ok: true, message, token, user });
}
