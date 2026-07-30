import { cookies } from "next/headers";
import { beaFetch } from "@/lib/admin/backend";
import { ADMIN_EMAIL_COOKIE, ADMIN_TOKEN_COOKIE } from "@/lib/admin/auth-constants";

export async function POST() {
  const store = await cookies();
  const token = store.get(ADMIN_TOKEN_COOKIE)?.value;

  if (token) {
    await beaFetch("/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => null);
  }

  store.delete(ADMIN_TOKEN_COOKIE);
  store.delete(ADMIN_EMAIL_COOKIE);
  return Response.json({ ok: true });
}
