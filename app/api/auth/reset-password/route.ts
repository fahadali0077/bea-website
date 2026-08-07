import {
  proxyAuthRequest,
  validateResetPasswordBody,
  type ResetPasswordBody,
} from "@/lib/server-auth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ResetPasswordBody | null;
  if (!body) {
    return Response.json({ ok: false, message: "Invalid JSON request body" }, { status: 400 });
  }

  const validationError = validateResetPasswordBody(body);
  if (validationError) {
    return Response.json({ ok: false, message: validationError }, { status: 400 });
  }

  return proxyAuthRequest(
    "/auth/reset-password",
    { token: body.token!.trim(), password: body.password! },
    "This reset link is invalid or has expired.",
  );
}
