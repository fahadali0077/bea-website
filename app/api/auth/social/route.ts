import { proxyAuthRequest, type SocialBody } from "@/lib/server-auth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as SocialBody | null;
  const provider = body?.provider;

  if (provider !== "google" && provider !== "apple") {
    return Response.json({ ok: false, message: "Invalid social provider" }, { status: 400 });
  }

  return proxyAuthRequest("/auth/social", { provider }, "Social sign-in failed");
}
