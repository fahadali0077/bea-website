import { cookies } from "next/headers";
import { ADMIN_EMAIL_COOKIE, ADMIN_TOKEN_COOKIE } from "@/lib/admin/auth-constants";

export const BEA_API_BASE_URL = process.env.BEA_API_BASE_URL ?? "http://localhost:4000/api";

export async function beaFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${BEA_API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
}

export async function getAdminToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(ADMIN_TOKEN_COOKIE)?.value ?? null;
}

export class UnauthenticatedError extends Error {
  constructor() {
    super("Admin session is missing or expired");
    this.name = "UnauthenticatedError";
  }
}

export async function adminFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = await getAdminToken();
  if (!token) throw new UnauthenticatedError();

  return beaFetch(path, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function proxyAdmin(path: string, init?: RequestInit): Promise<Response> {
  try {
    const upstream = await adminFetch(path, init);
    const data = await upstream.json().catch(() => null);

    if (upstream.status === 401) {
      const store = await cookies();
      store.delete(ADMIN_TOKEN_COOKIE);
      store.delete(ADMIN_EMAIL_COOKIE);
    }

    return Response.json(data ?? { ok: upstream.ok }, { status: upstream.status });
  } catch (error) {
    if (error instanceof UnauthenticatedError) {
      return Response.json({ ok: false, message: "Session expired. Please sign in again." }, { status: 401 });
    }
    return Response.json(
      { ok: false, message: "Unable to reach the server. Please try again." },
      { status: 502 },
    );
  }
}
