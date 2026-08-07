import {
  proxyAuthRequest,
  validateForgotPasswordBody,
  type ForgotPasswordBody,
} from "@/lib/server-auth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ForgotPasswordBody | null;
  if (!body) {
    return Response.json({ ok: false, message: "Invalid JSON request body" }, { status: 400 });
  }

  const validationError = validateForgotPasswordBody(body);
  if (validationError) {
    return Response.json({ ok: false, message: validationError }, { status: 400 });
  }

  // The backend always responds 200 here regardless of whether the email is
  // registered, so this proxy never reveals account existence either.
  return proxyAuthRequest(
    "/auth/forgot-password",
    { email: body.email!.trim() },
    "Unable to send reset link. Please try again.",
  );
}
