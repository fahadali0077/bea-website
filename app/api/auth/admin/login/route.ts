import { cookies } from "next/headers";
import { beaFetch } from "@/lib/admin/backend";
import {
  ADMIN_EMAIL_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  ADMIN_TOKEN_COOKIE,
} from "@/lib/admin/auth-constants";
import { validateLoginBody, type LoginBody } from "@/lib/server-auth";

function extractToken(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;
  const data = (record.data as Record<string, unknown>) ?? {};
  const candidate = record.accessToken ?? record.token ?? data.accessToken ?? data.token;
  return typeof candidate === "string" ? candidate : null;
}

async function readUpstreamJson(upstream: Response): Promise<unknown> {
  const text = await upstream.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return {
      message: text.trim().startsWith("<")
        ? "Authentication server returned HTML instead of JSON. Check BEA_API_BASE_URL and that the backend is running."
        : text.slice(0, 240),
    };
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as LoginBody | null;
  if (!body) {
    return Response.json({ ok: false, message: "Invalid JSON request body" }, { status: 400 });
  }

  const validationError = validateLoginBody(body);
  if (validationError) {
    return Response.json({ ok: false, message: validationError }, { status: 400 });
  }

  const email = body.email!.trim();

  let upstream: Response;
  try {
    upstream = await beaFetch("/auth/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password: body.password }),
    });
  } catch {
    return Response.json(
      { ok: false, message: "Unable to reach the authentication server. Please try again." },
      { status: 502 },
    );
  }

  const data = await readUpstreamJson(upstream);

  if (!upstream.ok) {
    const message =
      (data && typeof data === "object" && "message" in data && String((data as Record<string, unknown>).message)) ||
      "Invalid email or password";
    return Response.json({ ok: false, message }, { status: upstream.status });
  }

  const accessToken = extractToken(data);
  if (!accessToken) {
    return Response.json(
      { ok: false, message: "Login succeeded but no access token was returned." },
      { status: 502 },
    );
  }

  const store = await cookies();
  const secure = process.env.NODE_ENV === "production";

  store.delete(ADMIN_TOKEN_COOKIE);
  store.delete(ADMIN_EMAIL_COOKIE);

  store.set(ADMIN_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
  store.set(ADMIN_EMAIL_COOKIE, email, {
    httpOnly: false,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });

  return Response.json({ ok: true, message: "Login successful", redirectTo: "/admin" });
}
