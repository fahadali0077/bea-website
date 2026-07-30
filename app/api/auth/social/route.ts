import { withAuthBackend, type SocialBody } from "@/lib/server-auth";

export async function POST(request: Request) {
  const body = (await request.json()) as SocialBody;
  const provider = body.provider;

  if (provider !== "google" && provider !== "apple") {
    return Response.json({ ok: false, message: "Invalid social provider" }, { status: 400 });
  }

  return withAuthBackend("/auth/social", { provider });
}
